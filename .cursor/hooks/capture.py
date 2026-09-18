#!/usr/bin/env python3
"""Append Cursor prompt/response pairs to .agent-logs/. Fires from hooks.json."""

from __future__ import annotations

import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

AUTHOR = "rida-noor"
PROJECT = "higgsfield-clone"
TOOL = "cursor"
DEFAULT_MODEL = "cursor-grok-4.6"

ENTRY_RE = re.compile(
    r"\[LOG_ENTRY type=(PROMPT|RESPONSE) num=(\d+) session=([^\]]+)\]"
)


def utc_now() -> str:
    now = datetime.now(timezone.utc)
    return now.strftime("%Y-%m-%dT%H:%M:%S.") + f"{int(now.microsecond / 1000):03d}Z"


def utc_now_filename(ts: str | None = None) -> str:
    stamp = ts or utc_now()
    date, rest = stamp.split("T", 1)
    time_part = rest.split(".", 1)[0]
    return f"{date}_{time_part.replace(':', '-')}"


def debug(root: Path, message: str, payload: dict | None = None) -> None:
    try:
        path = root / ".cursor" / "hooks" / "debug.log"
        path.parent.mkdir(parents=True, exist_ok=True)
        extra = ""
        if payload is not None:
            keys = {
                "hook_event_name": payload.get("hook_event_name"),
                "conversation_id": payload.get("conversation_id")
                or payload.get("session_id"),
                "generation_id": payload.get("generation_id"),
                "model": payload.get("model") or payload.get("model_id"),
                "status": payload.get("status"),
                "prompt_len": len(payload.get("prompt") or ""),
                "text_len": len(payload.get("text") or ""),
            }
            extra = " " + json.dumps(keys, ensure_ascii=False)
        with path.open("a", encoding="utf-8") as fh:
            fh.write(f"{utc_now()} {message}{extra}\n")
    except Exception:
        pass


def read_stdin_json() -> dict:
    raw = sys.stdin.buffer.read()
    if raw.startswith(b"\xef\xbb\xbf"):
        raw = raw[3:]
    text = raw.decode("utf-8", errors="replace").strip()
    if not text:
        return {}
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        text = text.lstrip("\ufeff")
        data = json.loads(text)
    return data if isinstance(data, dict) else {}


def repo_root(payload: dict) -> Path:
    roots = payload.get("workspace_roots") or []
    if isinstance(roots, list):
        for item in roots:
            if item:
                path = Path(item)
                if path.exists():
                    return path
    cwd = Path.cwd()
    if (cwd / ".cursor" / "hooks.json").exists() or (cwd / ".agent-logs").exists():
        return cwd
    return cwd


def logs_dir(root: Path) -> Path:
    path = root / ".agent-logs"
    path.mkdir(parents=True, exist_ok=True)
    return path


def session_id_of(payload: dict) -> str:
    value = payload.get("conversation_id") or payload.get("session_id") or "unknown"
    return str(value).strip() or "unknown"


def session_short(session_id: str) -> str:
    return session_id.split("-")[0][:8] if session_id else "unknown"


def model_of(payload: dict) -> str:
    return str(
        payload.get("model")
        or payload.get("model_id")
        or DEFAULT_MODEL
    ).strip() or DEFAULT_MODEL


def event_name(payload: dict) -> str:
    name = str(payload.get("hook_event_name") or "").strip()
    if name:
        return name
    if payload.get("prompt") is not None and "text" not in payload:
        return "beforeSubmitPrompt"
    if payload.get("text") is not None and payload.get("prompt") is None:
        return "afterAgentResponse"
    if payload.get("status") in {"completed", "aborted", "error"}:
        return "stop"
    if payload.get("composer_mode") or (
        payload.get("session_id") and payload.get("prompt") is None and payload.get("text") is None
    ):
        return "sessionStart"
    return "unknown"


def lock_path(root: Path) -> Path:
    return root / ".cursor" / "hooks" / "capture.lock"


class ExclusiveLock:
    def __init__(self, path: Path, timeout_s: float = 8.0) -> None:
        self.path = path
        self.timeout_s = timeout_s
        self.fd: int | None = None

    def __enter__(self) -> "ExclusiveLock":
        self.path.parent.mkdir(parents=True, exist_ok=True)
        deadline = time.time() + self.timeout_s
        while True:
            try:
                self.fd = os.open(self.path, os.O_CREAT | os.O_EXCL | os.O_RDWR)
                os.write(self.fd, str(os.getpid()).encode("ascii"))
                return self
            except FileExistsError:
                if time.time() >= deadline:
                    try:
                        os.remove(self.path)
                    except OSError:
                        pass
                    continue
                time.sleep(0.05)

    def __exit__(self, *args: object) -> None:
        if self.fd is not None:
            try:
                os.close(self.fd)
            except OSError:
                pass
        try:
            os.remove(self.path)
        except OSError:
            pass


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}
    fields: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        fields[key.strip()] = value.strip()
    return fields


def render_frontmatter(
    session_id: str,
    date: str,
    model: str,
    total_exchanges: int,
    first_prompt_time: str,
    last_prompt_time: str,
) -> str:
    short = session_short(session_id)
    return (
        "---\n"
        f"session_id: {session_id}\n"
        f"date: {date}\n"
        f"author: {AUTHOR}\n"
        f"model: {model}\n"
        f"tool: {TOOL}\n"
        f"project: {PROJECT}\n"
        f"total_exchanges: {total_exchanges}\n"
        f"first_prompt_time: {first_prompt_time}\n"
        f"last_prompt_time: {last_prompt_time}\n"
        "---\n\n"
        f"# Session Log - {date}\n\n"
        f"Session: `{short}` | Project: `{PROJECT}` | Author: `{AUTHOR}`\n\n"
        "---\n"
    )


def count_prompts(text: str) -> int:
    return len(re.findall(r"\[LOG_ENTRY type=PROMPT num=", text))


def max_entry_num(text: str, entry_type: str | None = None) -> int:
    nums = []
    for kind, num, _session in ENTRY_RE.findall(text):
        if entry_type is None or kind == entry_type:
            nums.append(int(num))
    return max(nums) if nums else 0


def has_response(text: str, num: int) -> bool:
    return bool(
        re.search(rf"\[LOG_ENTRY type=RESPONSE num={num} session=", text)
    )


def find_log(logs: Path, session_id: str) -> Path | None:
    needle = f"session_id: {session_id}"
    for path in sorted(logs.glob("*.md")):
        try:
            head = path.read_text(encoding="utf-8")[:2000]
        except OSError:
            continue
        if needle in head:
            return path
    return None


def create_log(logs: Path, session_id: str, timestamp: str, model: str) -> Path:
    date = timestamp.split("T", 1)[0]
    filename = f"{utc_now_filename(timestamp)}_{session_id}.md"
    path = logs / filename
    path.write_text(
        render_frontmatter(
            session_id=session_id,
            date=date,
            model=model,
            total_exchanges=0,
            first_prompt_time=timestamp,
            last_prompt_time=timestamp,
        ),
        encoding="utf-8",
        newline="\n",
    )
    return path


def rewrite_frontmatter(
    path: Path,
    *,
    model: str | None = None,
    total_exchanges: int | None = None,
    last_prompt_time: str | None = None,
) -> None:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return
    end = text.find("\n---\n", 4)
    if end == -1:
        return
    header = text[4:end]
    body = text[end:]

    def set_field(block: str, key: str, value: str) -> str:
        pattern = re.compile(rf"^{re.escape(key)}: .*$", re.M)
        replacement = f"{key}: {value}"
        if pattern.search(block):
            return pattern.sub(replacement, block, count=1)
        return block.rstrip() + f"\n{replacement}\n"

    if model is not None:
        header = set_field(header, "model", model)
    if total_exchanges is not None:
        header = set_field(header, "total_exchanges", str(total_exchanges))
    if last_prompt_time is not None:
        header = set_field(header, "last_prompt_time", last_prompt_time)
    path.write_text("---\n" + header + body, encoding="utf-8", newline="\n")


def format_entry(
    entry_type: str,
    num: int,
    session_id: str,
    timestamp: str,
    model: str,
    body: str,
) -> str:
    short = session_short(session_id)
    content = body.replace("\r\n", "\n").rstrip()
    return (
        f"[LOG_ENTRY type={entry_type} num={num} session={short}]\n"
        f"timestamp: {timestamp}\n"
        f"model: {model}\n"
        f"\n{content}\n"
    )


def append_prompt(path: Path, session_id: str, timestamp: str, model: str, prompt: str) -> int:
    text = path.read_text(encoding="utf-8")
    num = max(max_entry_num(text, "PROMPT"), max_entry_num(text, "RESPONSE")) + 1
    block = format_entry("PROMPT", num, session_id, timestamp, model, prompt)
    path.write_text(text.rstrip() + "\n\n" + block + "\n", encoding="utf-8", newline="\n")
    rewrite_frontmatter(
        path,
        model=model,
        total_exchanges=num,
        last_prompt_time=timestamp,
    )
    return num


def upsert_response(
    path: Path,
    session_id: str,
    timestamp: str,
    model: str,
    body: str,
    num: int | None = None,
) -> int:
    text = path.read_text(encoding="utf-8")
    prompt_num = max_entry_num(text, "PROMPT")
    response_num = max_entry_num(text, "RESPONSE")
    if num is None:
        num = prompt_num if prompt_num else response_num + 1
        if num < 1:
            num = 1
    short = session_short(session_id)
    prompt_marker = f"[LOG_ENTRY type=PROMPT num={num} session={short}]"
    response_marker = f"[LOG_ENTRY type=RESPONSE num={num} session={short}]"
    block = format_entry("RESPONSE", num, session_id, timestamp, model, body)
    prompt_idx = text.rfind(prompt_marker)
    search_from = prompt_idx if prompt_idx != -1 else 0
    idx = text.find(response_marker, search_from)
    if prompt_idx != -1 and idx != -1 and idx < prompt_idx:
        idx = -1
    if idx == -1:
        path.write_text(text.rstrip() + "\n\n" + block + "\n", encoding="utf-8", newline="\n")
    else:
        next_idx = text.find("[LOG_ENTRY ", idx + 1)
        if next_idx == -1:
            new_text = text[:idx] + block + "\n"
        else:
            new_text = text[:idx] + block + "\n" + text[next_idx:]
        path.write_text(new_text, encoding="utf-8", newline="\n")
    rewrite_frontmatter(path, model=model)
    return num


def extract_transcript_text(conversation_id: str) -> str | None:
    home = Path.home() / ".cursor" / "projects"
    matches = list(home.glob(f"*/agent-transcripts/{conversation_id}/{conversation_id}.jsonl"))
    if not matches:
        return None
    path = max(matches, key=lambda p: p.stat().st_mtime)
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return None
    last_text = None
    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        if row.get("role") != "assistant":
            continue
        content = ((row.get("message") or {}).get("content")) or []
        parts = []
        if isinstance(content, list):
            for item in content:
                if not isinstance(item, dict):
                    continue
                if item.get("type") == "text" and item.get("text"):
                    parts.append(str(item["text"]))
        elif isinstance(content, str):
            parts.append(content)
        joined = "\n".join(parts).strip()
        if joined:
            last_text = joined
    return last_text


def emit(event: str, ok: bool = True) -> None:
    if event == "beforeSubmitPrompt":
        sys.stdout.write(json.dumps({"continue": True}))
    elif event == "sessionStart":
        sys.stdout.write(json.dumps({}))
    elif event == "stop":
        sys.stdout.write(json.dumps({}))
    else:
        sys.stdout.write("{}\n")
    sys.stdout.flush()
    sys.exit(0 if ok else 0)


def handle(payload: dict) -> str:
    event = event_name(payload)
    root = repo_root(payload)
    logs = logs_dir(root)
    session_id = session_id_of(payload)
    model = model_of(payload)
    timestamp = utc_now()
    debug(root, f"event={event}", payload)

    if event == "sessionStart":
        debug(root, f"sessionStart session={session_id}")
        return event

    if event == "beforeSubmitPrompt":
        prompt = payload.get("prompt")
        if prompt is None:
            return event
        path = find_log(logs, session_id) or create_log(logs, session_id, timestamp, model)
        append_prompt(path, session_id, timestamp, model, str(prompt))
        debug(root, f"wrote PROMPT to {path.name}")
        return event

    if event == "afterAgentResponse":
        text = payload.get("text")
        if text is None:
            return event
        path = find_log(logs, session_id)
        if path is None:
            path = create_log(logs, session_id, timestamp, model)
        upsert_response(path, session_id, timestamp, model, str(text))
        debug(root, f"wrote RESPONSE to {path.name}")
        return event

    if event == "stop":
        path = find_log(logs, session_id)
        if path is None:
            return event
        text = path.read_text(encoding="utf-8")
        prompt_num = max_entry_num(text, "PROMPT")
        if prompt_num and not has_response(text, prompt_num):
            fallback = extract_transcript_text(session_id)
            if fallback:
                upsert_response(path, session_id, timestamp, model, fallback, num=prompt_num)
                debug(root, f"stop fallback RESPONSE from transcript for {path.name}")
            else:
                debug(root, "stop: missing RESPONSE and no transcript text")
        return event

    debug(root, f"unhandled event={event}")
    return event


def main() -> None:
    try:
        payload = read_stdin_json()
    except Exception as exc:
        sys.stderr.write(f"capture hook stdin error: {exc}\n")
        sys.stdout.write("{}\n")
        sys.exit(0)

    root = repo_root(payload)
    event = event_name(payload)
    try:
        with ExclusiveLock(lock_path(root)):
            event = handle(payload)
    except Exception as exc:
        debug(root, f"ERROR {type(exc).__name__}: {exc}", payload)
        sys.stderr.write(f"capture hook error: {exc}\n")
    emit(event)


if __name__ == "__main__":
    main()

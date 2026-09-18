# CAPTURE-TEST

## Tool and model (step 1)

- **Tool:** Cursor
- **Model (session 1 / canary 1):** `cursor-grok-4.6-high-fast` — same model planned and executed in that chat
- **Model (session 2 / canary 2):** `default` — Cursor Auto/default model selection (not edited in the raw log)
- **Automatic capture available:** Yes. Cursor project hooks (`.cursor/hooks.json`) can run a command on `beforeSubmitPrompt`, `afterAgentResponse`, `stop`, and `sessionStart`. Confirmed via Cursor hooks docs and the create-hook skill. Cursor also writes on-disk session transcripts under `~/.cursor/projects/.../agent-transcripts/` (used only as a `stop` fallback).

## Mechanism and config changed

- **Mechanism:** Cursor command hooks that fire automatically on each prompt submit and each final agent response.
- **Config file:** `.cursor/hooks.json`
- **Script:** `.cursor/hooks/capture.py` (invoked via `.cursor/hooks/capture.cmd` on Windows)
- **Events wired:** `sessionStart`, `beforeSubmitPrompt`, `afterAgentResponse`, `stop`
- **Also added:** `.cursor/rules/agent-capture.mdc` (always-apply reminder not to edit/tidy logs; not the capture mechanism itself)

## Log file paths (canaries)

- Canary 1 (same session that installed the hook):  
  `.agent-logs/2026-09-18_14-20-20_194fd587-e2d4-4692-93f9-39c5adbcbe58.md`
- Canary 2 (new Agent session):  
  `.agent-logs/2026-09-18_14-23-52_3b012fc4-e623-4397-a7c6-2a49000ffff0.md`

## `.agent-logs/` gitignore check

- `.agent-logs/` is **not** in `.gitignore`.
- `.gitignore` only ignores `.cursor/hooks/debug.log` and `.cursor/hooks/capture.lock`.
- `git check-ignore` does not match `.agent-logs/` or its log files; both canary logs show as untracked and are ready to commit.

## Raw canary entries

### Canary 1 — session `194fd587-e2d4-4692-93f9-39c5adbcbe58`

```
[LOG_ENTRY type=PROMPT num=1 session=194fd587]
timestamp: 2026-09-18T14:22:36.850Z
model: cursor-grok-4.6-high-fast

CAPTURE TEST â€” 8x assignment, Rida Noor

[LOG_ENTRY type=RESPONSE num=1 session=194fd587]
timestamp: 2026-09-18T14:23:13.979Z
model: cursor-grok-4.6-high-fast

Canary 1 prompt is in the log.

**Prompt captured:** `CAPTURE TEST â€” 8x assignment, Rida Noor`  
**Log:** `.agent-logs/2026-09-18_14-20-20_194fd587-e2d4-4692-93f9-39c5adbcbe58.md`  
**Session:** `194fd587-e2d4-4692-93f9-39c5adbcbe58`  
This reply should land in that same file via `afterAgentResponse` when the turn ends.

This chatâ€™s hook is working. Next: open a **new** Agent session in this repo and send:

`CAPTURE TEST 2 â€” 8x assignment, Rida Noor`

Do not start the product build yet. After that second canary lands, I will write `CAPTURE-TEST.md`.
```

### Canary 2 — session `3b012fc4-e623-4397-a7c6-2a49000ffff0`

```
[LOG_ENTRY type=PROMPT num=1 session=3b012fc4]
timestamp: 2026-09-18T14:23:52.123Z
model: default

CAPTURE TEST 2 â€” 8x assignment, Rida Noor

[LOG_ENTRY type=RESPONSE num=1 session=3b012fc4]
timestamp: 2026-09-18T14:24:05.717Z
model: default

Canary 2 received in this new session.

**Prompt:** `CAPTURE TEST 2 â€” 8x assignment, Rida Noor`  
**Capture:** hooks in `.cursor/hooks.json` â†’ `.cursor/hooks/capture.cmd` â†’ `.agent-logs/`  
**Events:** `beforeSubmitPrompt` / `afterAgentResponse` / `stop`

This reply should land in a new log file under `.agent-logs/` when the turn ends. No product build started. After both canaries appear in the logs, the next step is writing `CAPTURE-TEST.md`.
```

Note on canary 2 model: this session used Cursor’s Auto/default model selection, so the hook recorded `model: default`. That value is left as captured; the raw log was not modified.

## What was tried first that did not work / caveats

1. **Initial assignment message was sent before hooks existed**, so that first turn had no PROMPT capture. The first `afterAgentResponse` that fired after install wrote a RESPONSE-only block for the prior turn (honest gap; left in the log).
2. **Piped PowerShell self-tests** briefly corrupted em dashes / non-ASCII when feeding JSON through the console encoding path; the real Cursor hook path still fires. Raw logs may show `â€”` for `—` on this Windows setup (known Cursor Windows stdin encoding quirk); entries were not cleaned up after the fact.
3. **Response numbering** after a RESPONSE-without-PROMPT bootstrap needed a small fix so a later canary RESPONSE would not overwrite an earlier RESPONSE with the same num; fixed in `.cursor/hooks/capture.py` before canary 1’s response landed cleanly as a separate entry.
4. Did **not** fall back to manual logging; project hooks were confirmed and used.

## Status

Capture setup is verified across two sessions. Product build has not started.

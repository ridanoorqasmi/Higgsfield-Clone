"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = {
  id: string;
  label: string;
  badge?: "TOP" | "NEW";
};

type ComposerDropdownProps = {
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  compact?: boolean;
};

function ChevronDown() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 opacity-70" aria-hidden>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function Badge({ type }: { type: "TOP" | "NEW" }) {
  const styles =
    type === "TOP"
      ? "bg-[#ff4fd8] text-white"
      : "bg-hf-accent text-hf-accent-text";
  return (
    <span className={`rounded px-1 py-0.5 text-[9px] font-bold uppercase leading-none ${styles}`}>
      {type}
    </span>
  );
}

export function ComposerDropdown({
  label,
  value,
  options,
  onChange,
  icon,
  compact = false,
}: ComposerDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={[
          "flex items-center gap-1.5 rounded-full border border-hf-border bg-hf-surface-2 text-hf-text transition-colors hover:border-hf-border-light hover:bg-hf-surface-3",
          compact ? "h-8 px-2.5 text-[12px]" : "h-9 px-3 text-[13px]",
        ].join(" ")}
      >
        {icon ? <span className="text-hf-muted">{icon}</span> : null}
        <span className="max-w-[9rem] truncate">{selected.label}</span>
        <ChevronDown />
        <span className="sr-only">{label}</span>
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute bottom-[calc(100%+8px)] left-0 z-50 min-w-[220px] overflow-hidden rounded-xl border border-hf-border bg-[#101010] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        >
          {options.map((option) => {
            const active = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px]",
                  active
                    ? "bg-hf-surface-3 text-hf-text"
                    : "text-hf-muted hover:bg-hf-surface-2 hover:text-hf-text",
                ].join(" ")}
              >
                <span>{option.label}</span>
                {option.badge ? <Badge type={option.badge} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

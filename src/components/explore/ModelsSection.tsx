import Link from "next/link";
import { MODEL_TOOLS } from "@/lib/explore";
import { MediaPlaceholder } from "./MediaPlaceholder";

const BADGE_CLASS: Record<NonNullable<(typeof MODEL_TOOLS)[number]["badge"]>, string> = {
  TOP: "bg-hf-accent text-hf-accent-text",
  FREE: "bg-emerald-500/90 text-white",
  NEW: "bg-white/10 text-hf-text ring-1 ring-white/15",
};

export function ModelsSection() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {MODEL_TOOLS.map((tool) => (
        <Link
          key={tool.id}
          href={tool.href}
          className="group flex gap-3 rounded-2xl border border-hf-border bg-hf-surface p-3 transition-colors hover:border-hf-border-light hover:bg-hf-surface-2 sm:p-3.5"
        >
          <div className="w-[88px] shrink-0 sm:w-[96px]">
            <MediaPlaceholder
              mediaSrc={tool.mediaSrc}
              aspectRatio="1/1"
              alt={tool.title}
              objectPosition={tool.objectPosition}
              className="rounded-lg border-hf-border-light"
              sizes="96px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[14px] font-semibold text-hf-text group-hover:text-white">
                {tool.title}
              </h3>
              {tool.badge ? (
                <span
                  className={[
                    "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                    BADGE_CLASS[tool.badge],
                  ].join(" ")}
                >
                  {tool.badge}
                </span>
              ) : null}
              <span className="rounded bg-hf-surface-3 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-hf-muted">
                {tool.mediaType}
              </span>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-hf-muted">
              {tool.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

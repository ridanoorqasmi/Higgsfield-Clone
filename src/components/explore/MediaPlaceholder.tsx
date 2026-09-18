import Image from "next/image";
import type { ExploreAspectRatio } from "@/lib/explore";

type MediaPlaceholderProps = {
  mediaSrc: string | null;
  aspectRatio: ExploreAspectRatio;
  alt: string;
  label?: string;
  badge?: string;
  overlayLabel?: string;
  className?: string;
  fill?: boolean;
};

const ASPECT_CLASS: Record<ExploreAspectRatio, string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "9/16": "aspect-[9/16]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "3/4": "aspect-[3/4]",
};

export function MediaPlaceholder({
  mediaSrc,
  aspectRatio,
  alt,
  label,
  badge,
  overlayLabel,
  className = "",
  fill = false,
}: MediaPlaceholderProps) {
  const aspectClass = fill ? "h-full w-full" : ASPECT_CLASS[aspectRatio];

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border border-hf-border bg-hf-surface-2",
        aspectClass,
        className,
      ].join(" ")}
    >
      {mediaSrc ? (
        <Image src={mediaSrc} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 320px" />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#1a1a1a_0%,#111111_45%,#1f1f1f_100%)]">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 10px)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-hf-muted-2">
              Media slot
            </span>
            <span className="text-[11px] text-hf-muted">{aspectRatio.replace("/", ":")}</span>
          </div>
        </div>
      )}

      {overlayLabel ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pb-3 pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/90">
            {overlayLabel}
          </p>
        </div>
      ) : null}

      {label ? (
        <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
          {label}
        </span>
      ) : null}

      {badge ? (
        <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-hf-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-hf-accent-text">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

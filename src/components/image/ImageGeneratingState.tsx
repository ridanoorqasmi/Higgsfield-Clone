import type { AspectRatioId } from "@/lib/image-options";

const ASPECT_RATIO_CSS: Record<AspectRatioId, string> = {
  auto: "4 / 5",
  "1:1": "1 / 1",
  "4:5": "4 / 5",
  "16:9": "16 / 9",
  "9:16": "9 / 16",
};

function gridClass(count: number): string {
  if (count <= 1) return "grid max-w-sm grid-cols-1 mx-auto";
  if (count === 2) return "grid max-w-3xl grid-cols-1 sm:grid-cols-2 mx-auto";
  if (count === 3) return "grid max-w-5xl grid-cols-1 sm:grid-cols-3 mx-auto";
  return "grid max-w-6xl grid-cols-2 sm:grid-cols-4 mx-auto";
}

type ImageGeneratingStateProps = {
  count: number;
  aspectRatio: AspectRatioId;
};

export function ImageGeneratingState({
  count,
  aspectRatio,
}: ImageGeneratingStateProps) {
  const slots = Math.min(4, Math.max(1, count));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-44 pt-8 sm:px-6 sm:pb-48">
      <p className="mb-5 text-center text-[13px] text-hf-muted sm:text-left">
        Generating {slots} image{slots === 1 ? "" : "s"}…
      </p>
      <div className={`gap-3 sm:gap-4 ${gridClass(slots)}`}>
        {Array.from({ length: slots }, (_, index) => (
          <div
            key={index}
            className="relative block w-full max-h-[70vh] overflow-hidden rounded-2xl border border-hf-border bg-hf-surface-2"
            style={{ aspectRatio: ASPECT_RATIO_CSS[aspectRatio] }}
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-hf-surface-2 via-hf-surface-3 to-hf-surface" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full border border-hf-border bg-hf-bg/70 px-3 py-1 text-[11px] text-hf-muted backdrop-blur-sm">
                Creating…
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

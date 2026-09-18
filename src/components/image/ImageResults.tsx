import Image from "next/image";
import type { AspectRatioId } from "@/lib/image-options";
import type { GeneratedImage } from "@/lib/generation";

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

type ImageResultsProps = {
  images: GeneratedImage[];
  aspectRatio: AspectRatioId;
  prompt: string;
};

export function ImageResults({ images, aspectRatio, prompt }: ImageResultsProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-44 pt-8 sm:px-6 sm:pb-48">
      <p className="mb-5 line-clamp-2 text-center text-[13px] text-hf-muted sm:text-left">
        {prompt}
      </p>
      <div className={`gap-3 sm:gap-4 ${gridClass(images.length)}`}>
        {images.map((image) => (
          <figure
            key={image.id}
            className="relative block w-full max-h-[70vh] overflow-hidden rounded-2xl border border-hf-border bg-hf-surface"
            style={{ aspectRatio: ASPECT_RATIO_CSS[aspectRatio] }}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 90vw, 384px"
              className="object-cover"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";

const PREVIEW_CARDS = [
  {
    src: "/ui/image-hero/media-1.jpg",
    alt: "Preview of a couple watching a film",
    rotate: "-rotate-[8deg]",
    zIndex: "z-10",
    objectPosition: "center 28%",
  },
  {
    src: "/ui/image-hero/media-2.jpg",
    alt: "Preview of a soccer player on the field",
    rotate: "-rotate-[3deg]",
    zIndex: "z-20",
    objectPosition: "center 40%",
  },
  {
    src: "/ui/image-hero/media-3.jpg",
    alt: "Preview of a guitar in colored light",
    rotate: "rotate-[2deg]",
    zIndex: "z-30",
    objectPosition: "center",
  },
  {
    src: "/ui/image-hero/media-4.jpg",
    alt: "Preview of a portrait in warm light",
    rotate: "rotate-[7deg]",
    zIndex: "z-40",
    objectPosition: "center 22%",
  },
] as const;

export function ImageEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 pb-44 pt-6 sm:px-6 sm:pb-48">
      <div className="flex items-center justify-center pl-3">
        {PREVIEW_CARDS.map((card, index) => (
          <div
            key={card.src}
            className={[
              "relative shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-[0_10px_28px_rgba(0,0,0,0.35)]",
              "h-[92px] w-[72px] sm:h-[108px] sm:w-[84px]",
              card.rotate,
              card.zIndex,
              index === 0 ? "" : "-ml-7 sm:-ml-8",
            ].join(" ")}
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes="84px"
              className="object-cover"
              style={{ objectPosition: card.objectPosition }}
              priority
            />
          </div>
        ))}
      </div>

      <div className="mt-5 max-w-md text-center">
        <h1 className="text-[17px] font-semibold uppercase leading-[1.25] tracking-[0.02em] sm:text-[20px]">
          <span className="block text-hf-text">START CREATING WITH</span>
          <span className="block text-hf-accent">HIGGSFIELD SOUL CINEMA</span>
        </h1>
        <p className="mx-auto mt-2.5 max-w-sm text-[13px] leading-5 text-hf-muted sm:text-sm">
          Describe a scene, character, mood, or style — and watch it come to life.
        </p>
      </div>
    </div>
  );
}

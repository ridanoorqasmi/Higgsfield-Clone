import Image from "next/image";

type VideoEmptyStateProps = {
  onAddImage: () => void;
};

export function VideoEmptyState({ onAddImage }: VideoEmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-8 sm:px-8 sm:py-12">
      <div className="max-w-xl">
        <h1 className="text-[28px] font-semibold uppercase tracking-wide text-hf-text sm:text-[36px]">
          Make videos in one click
        </h1>
        <p className="mt-3 max-w-lg text-[14px] leading-6 text-hf-muted">
          Add a reference, describe the motion you want, and generate a demo clip — or start
          from a prompt alone.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
        <button
          type="button"
          onClick={onAddImage}
          className="group text-left"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-hf-border bg-hf-surface-2">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-hf-muted">
              <span className="text-[22px] leading-none">+</span>
              <span className="mt-2 text-[12px] uppercase tracking-wide">Upload image</span>
            </div>
          </div>
          <p className="mt-3 text-center text-[13px] font-medium uppercase tracking-wide text-hf-text">
            Add image
          </p>
        </button>

        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-hf-border">
            <Image
              src="/ui/video-empty/preset.jpg"
              alt=""
              fill
              sizes="280px"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-center text-[13px] font-medium uppercase tracking-wide text-hf-muted">
            Choose preset
          </p>
        </div>

        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-hf-border">
            <video
              src="/ui/video-empty/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <p className="mt-3 text-center text-[13px] font-medium uppercase tracking-wide text-hf-muted">
            Get video
          </p>
        </div>
      </div>
    </div>
  );
}

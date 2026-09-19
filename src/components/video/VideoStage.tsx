"use client";

import type { GeneratedVideo, VideoGenerationRequest } from "@/lib/video";
import { VIDEO_ASPECT_CSS, durationSeconds } from "@/lib/video/options";
import { VideoEmptyState } from "./VideoEmptyState";

type VideoStageProps = {
  status: "idle" | "generating" | "success" | "error";
  result: GeneratedVideo | null;
  resultRequest: VideoGenerationRequest | null;
  resultPrompt: string;
  errorMessage: string | null;
  onAddImage: () => void;
  onRetry: () => void;
};

export function VideoStage({
  status,
  result,
  resultRequest,
  resultPrompt,
  errorMessage,
  onAddImage,
  onRetry,
}: VideoStageProps) {
  if (status === "generating" && !result) {
    const aspect = resultRequest?.aspectRatio ?? "16:9";
    return (
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div
          className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-hf-border bg-hf-surface-2"
          style={{ aspectRatio: VIDEO_ASPECT_CSS[aspect] }}
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-hf-surface-2 via-hf-surface-3 to-hf-surface" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-hf-border bg-hf-bg/70 px-4 py-2 text-[13px] text-hf-text backdrop-blur-sm">
              Generating video…
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" && !result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-[15px] font-medium text-hf-text">Generation failed</p>
        <p className="mt-2 max-w-md text-[13px] leading-5 text-hf-muted">
          {errorMessage ?? "Something went wrong. You can try again."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center rounded-full bg-hf-accent px-5 text-[13px] font-semibold text-hf-accent-text hover:bg-hf-accent-hover"
        >
          Try again
        </button>
      </div>
    );
  }

  if (result) {
    const aspect = resultRequest?.aspectRatio ?? "16:9";
    const seconds = resultRequest ? durationSeconds(resultRequest.duration) : 5;

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-5 py-8 sm:px-8">
        {status === "generating" ? (
          <p className="mb-4 text-[13px] text-hf-muted">Generating another clip…</p>
        ) : null}
        <p className="mb-4 line-clamp-2 text-[13px] text-hf-muted">{resultPrompt}</p>
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-hf-border bg-black"
          style={{ aspectRatio: VIDEO_ASPECT_CSS[aspect] }}
        >
          {result.url ? (
            <video
              key={result.id}
              className="h-full w-full object-cover"
              src={result.url}
              poster={result.posterUrl ?? undefined}
              controls
              playsInline
              loop
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-hf-surface-2 px-6 text-center">
              {result.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.posterUrl}
                  alt={result.alt}
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
              ) : null}
              <p className="relative text-[14px] font-medium text-hf-text">Demo video ready</p>
              <p className="relative mt-1 text-[12px] text-hf-muted">
                {aspect} · {seconds}s slot — playable media can be supplied later
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <VideoEmptyState onAddImage={onAddImage} />;
}

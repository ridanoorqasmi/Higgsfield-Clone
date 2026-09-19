"use client";

import type { RefObject } from "react";
import Image from "next/image";
import {
  VIDEO_ASPECT_RATIOS,
  VIDEO_DURATIONS,
  VIDEO_MODELS,
  type VideoAspectRatioId,
  type VideoDurationId,
  type VideoModelId,
} from "@/lib/video/options";

type VideoCreatePanelProps = {
  model: VideoModelId;
  onModelChange: (value: VideoModelId) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  aspectRatio: VideoAspectRatioId;
  onAspectRatioChange: (value: VideoAspectRatioId) => void;
  duration: VideoDurationId;
  onDurationChange: (value: VideoDurationId) => void;
  referencePreview: string | null;
  onReferenceSelect: (file: File) => void;
  onReferenceRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  canGenerate: boolean;
  isGenerating: boolean;
  hasResult: boolean;
  onGenerate: () => void;
};

export function VideoCreatePanel({
  model,
  onModelChange,
  prompt,
  onPromptChange,
  aspectRatio,
  onAspectRatioChange,
  duration,
  onDurationChange,
  referencePreview,
  onReferenceSelect,
  onReferenceRemove,
  fileInputRef,
  canGenerate,
  isGenerating,
  hasResult,
  onGenerate,
}: VideoCreatePanelProps) {
  const selectedModel = VIDEO_MODELS.find((item) => item.id === model) ?? VIDEO_MODELS[0];
  const generateDisabled = !canGenerate || isGenerating;

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-hf-border bg-hf-bg lg:h-[calc(100vh-3.5rem)] lg:w-[300px] lg:border-b-0 lg:border-r xl:w-[320px]">
      <div className="border-b border-hf-border px-4 py-3">
        <p className="text-[13px] font-semibold text-hf-text">Create Video</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
        <section>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-hf-muted">
            Model
          </p>
          <div className="space-y-1.5">
            {VIDEO_MODELS.map((item) => {
              const active = item.id === selectedModel.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onModelChange(item.id)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl border px-2.5 py-2 text-left transition-colors",
                    active
                      ? "border-hf-border-light bg-hf-surface-2"
                      : "border-hf-border bg-hf-surface hover:border-hf-border-light",
                  ].join(" ")}
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-hf-border">
                    <Image
                      src="/ui/previews/card-3.jpg"
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wide text-hf-muted-2">
                      {item.caption}
                    </span>
                    <span className="block text-[13px] font-medium text-hf-text">
                      {item.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-hf-muted">
            Reference Image
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) onReferenceSelect(file);
            }}
          />
          {referencePreview ? (
            <div className="relative overflow-hidden rounded-xl border border-hf-border">
              <div className="relative aspect-video">
                <Image
                  src={referencePreview}
                  alt="Reference preview"
                  fill
                  unoptimized
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={onReferenceRemove}
                className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-hf-text hover:bg-black/85"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[88px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-hf-border-light bg-hf-surface text-hf-muted transition-colors hover:border-hf-muted-2 hover:text-hf-text"
            >
              <span className="text-[20px] leading-none">+</span>
              <span className="mt-1 text-[12px]">Image</span>
            </button>
          )}
        </section>

        <section>
          <label className="block">
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-hf-muted">
              Prompt
            </span>
            <textarea
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              rows={5}
              placeholder="Describe the visual change you want — e.g. make it snow at nighttime."
              className="min-h-[120px] w-full resize-none rounded-xl border border-hf-border bg-hf-surface-2 px-3 py-2.5 text-[13px] leading-5 text-hf-text placeholder:text-hf-muted-2 focus:border-hf-border-light focus:outline-none"
            />
          </label>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-hf-muted">
              Aspect
            </p>
            <div className="flex flex-wrap gap-1">
              {VIDEO_ASPECT_RATIOS.map((item) => {
                const active = item.id === aspectRatio;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onAspectRatioChange(item.id)}
                    className={[
                      "h-8 rounded-full px-2.5 text-[12px] transition-colors",
                      active
                        ? "bg-hf-surface-3 text-hf-text"
                        : "text-hf-muted hover:text-hf-text",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-hf-muted">
              Duration
            </p>
            <div className="flex flex-wrap gap-1">
              {VIDEO_DURATIONS.map((item) => {
                const active = item.id === duration;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onDurationChange(item.id)}
                    className={[
                      "h-8 rounded-full px-2.5 text-[12px] transition-colors",
                      active
                        ? "bg-hf-surface-3 text-hf-text"
                        : "text-hf-muted hover:text-hf-text",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-hf-border p-4">
        <button
          type="button"
          disabled={generateDisabled}
          onClick={onGenerate}
          title={
            isGenerating
              ? "Generation in progress"
              : prompt.trim().length === 0
                ? "Enter a prompt to generate"
                : hasResult
                  ? "Generate again"
                  : "Generate video"
          }
          className={[
            "inline-flex h-11 w-full items-center justify-center rounded-full bg-hf-accent text-[14px] font-semibold text-hf-accent-text transition-opacity",
            generateDisabled ? "cursor-not-allowed opacity-45" : "hover:bg-hf-accent-hover",
          ].join(" ")}
        >
          {isGenerating ? "Generating…" : hasResult ? "Generate Again" : "Generate"}
        </button>
      </div>
    </aside>
  );
}

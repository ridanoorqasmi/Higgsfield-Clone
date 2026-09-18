"use client";

import {
  ASPECT_RATIOS,
  IMAGE_MODELS,
  MAX_OUTPUT_COUNT,
  MIN_OUTPUT_COUNT,
  MODE_OPTIONS,
  QUALITY_OPTIONS,
  RESOLUTION_OPTIONS,
  type AspectRatioId,
  type ImageModelId,
  type ModeId,
  type QualityId,
  type ResolutionId,
} from "@/lib/image-options";
import { ComposerDropdown } from "./ComposerDropdown";

type ImageComposerProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  model: ImageModelId;
  onModelChange: (value: ImageModelId) => void;
  aspectRatio: AspectRatioId;
  onAspectRatioChange: (value: AspectRatioId) => void;
  quality: QualityId;
  onQualityChange: (value: QualityId) => void;
  resolution: ResolutionId;
  onResolutionChange: (value: ResolutionId) => void;
  mode: ModeId;
  onModeChange: (value: ModeId) => void;
  outputCount: number;
  onOutputCountChange: (value: number) => void;
  canGenerate: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path
        d="M8 1.5L9.2 6.1L13.5 7.3L9.2 8.5L8 13.1L6.8 8.5L2.5 7.3L6.8 6.1L8 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AspectIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path d="M8 2.5L12.5 8L8 13.5L3.5 8L8 2.5Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function ModeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M8 2.5V13.5M2.5 8H13.5M4.2 4.2L11.8 11.8M11.8 4.2L4.2 11.8"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-hf-accent" aria-hidden>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function ImageComposer({
  prompt,
  onPromptChange,
  model,
  onModelChange,
  aspectRatio,
  onAspectRatioChange,
  quality,
  onQualityChange,
  resolution,
  onResolutionChange,
  mode,
  onModeChange,
  outputCount,
  onOutputCountChange,
  canGenerate,
  isGenerating,
  onGenerate,
}: ImageComposerProps) {
  const selectedModel = IMAGE_MODELS.find((item) => item.id === model) ?? IMAGE_MODELS[0];
  const selectedAspect = ASPECT_RATIOS.find((item) => item.id === aspectRatio) ?? ASPECT_RATIOS[0];
  const generateDisabled = !canGenerate || isGenerating;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-4 sm:px-5 sm:pb-6">
      <div className="pointer-events-auto w-full max-w-[980px] rounded-[22px] border border-hf-border bg-[#121212]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <div className="flex items-start gap-2 border-b border-hf-border px-3 py-3 sm:px-4">
          <button
            type="button"
            aria-label="Add reference"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hf-border bg-hf-surface-2 text-hf-muted transition-colors hover:border-hf-border-light hover:text-hf-text"
          >
            <PlusIcon />
          </button>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Prompt</span>
            <textarea
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              rows={2}
              placeholder="Describe the scene you imagine"
              className="min-h-[52px] w-full resize-none bg-transparent px-1 py-1.5 text-[14px] leading-6 text-hf-text placeholder:text-hf-muted-2 focus:outline-none sm:text-[15px]"
            />
          </label>
          <button
            type="button"
            aria-label="Prompt assistant"
            className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hf-border bg-hf-surface-2 text-hf-muted transition-colors hover:text-hf-text sm:flex"
          >
            <SparkIcon />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-3 py-3 sm:px-4 sm:py-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <ComposerDropdown
              label="Model"
              value={model}
              options={IMAGE_MODELS}
              onChange={(value) => onModelChange(value as ImageModelId)}
              icon={<ModelIcon />}
            />

            <ComposerDropdown
              label="Aspect ratio"
              value={aspectRatio}
              options={ASPECT_RATIOS.map((item) => ({ id: item.id, label: item.label }))}
              onChange={(value) => onAspectRatioChange(value as AspectRatioId)}
              icon={<AspectIcon />}
              compact
            />

            <ComposerDropdown
              label="Quality"
              value={quality}
              options={QUALITY_OPTIONS.map((item) => ({ id: item.id, label: item.label }))}
              onChange={(value) => onQualityChange(value as QualityId)}
              icon={<DiamondIcon />}
              compact
            />

            <ComposerDropdown
              label="Resolution"
              value={resolution}
              options={RESOLUTION_OPTIONS.map((item) => ({ id: item.id, label: item.label }))}
              onChange={(value) => onResolutionChange(value as ResolutionId)}
              icon={<DiamondIcon />}
              compact
            />

            <ComposerDropdown
              label="Mode"
              value={mode}
              options={MODE_OPTIONS.map((item) => ({ id: item.id, label: item.label }))}
              onChange={(value) => onModeChange(value as ModeId)}
              icon={<ModeIcon />}
              compact
            />

            <div className="flex h-8 items-center gap-1 rounded-full border border-hf-border bg-hf-surface-2 px-1 text-[12px] text-hf-text">
              <button
                type="button"
                aria-label="Decrease output count"
                disabled={outputCount <= MIN_OUTPUT_COUNT}
                onClick={() => onOutputCountChange(Math.max(MIN_OUTPUT_COUNT, outputCount - 1))}
                className="flex h-6 w-6 items-center justify-center rounded-full text-hf-muted transition-colors hover:bg-hf-surface-3 hover:text-hf-text disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-[2.5rem] text-center tabular-nums">
                {outputCount}/{MAX_OUTPUT_COUNT}
              </span>
              <button
                type="button"
                aria-label="Increase output count"
                disabled={outputCount >= MAX_OUTPUT_COUNT}
                onClick={() => onOutputCountChange(Math.min(MAX_OUTPUT_COUNT, outputCount + 1))}
                className="flex h-6 w-6 items-center justify-center rounded-full text-hf-muted transition-colors hover:bg-hf-surface-3 hover:text-hf-text disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <p className="text-[11px] text-hf-muted lg:hidden">
              {selectedModel.label} · {selectedAspect.label}
            </p>
            <button
              type="button"
              disabled={generateDisabled}
              onClick={onGenerate}
              title={
                isGenerating
                  ? "Generation in progress"
                  : prompt.trim().length === 0
                    ? "Enter a prompt to generate"
                    : "Generate images"
              }
              className={[
                "inline-flex h-10 min-w-[132px] items-center justify-center gap-2 rounded-full bg-hf-accent px-5 text-[14px] font-semibold text-hf-accent-text transition-opacity",
                generateDisabled ? "cursor-not-allowed opacity-45" : "hover:bg-hf-accent-hover",
              ].join(" ")}
            >
              <span>{isGenerating ? "Generating…" : "Generate"}</span>
              {!isGenerating ? (
                <span className="flex items-center gap-1 text-[12px] font-medium opacity-80">
                  <SparkIcon />
                  <span>6.5</span>
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import type {
  AspectRatioId,
  ImageModelId,
  ModeId,
  QualityId,
  ResolutionId,
} from "@/lib/image-options";
import {
  generateImages,
  type GeneratedImage,
  type GenerationStatus,
} from "@/lib/generation";
import { ImageComposer } from "./ImageComposer";
import { ImageEmptyState } from "./ImageEmptyState";
import { ImageGeneratingState } from "./ImageGeneratingState";
import { ImageResults } from "./ImageResults";

export function ImageWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<ImageModelId>("gpt-image-2");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>("auto");
  const [quality, setQuality] = useState<QualityId>("high");
  const [resolution, setResolution] = useState<ResolutionId>("2k");
  const [mode, setMode] = useState<ModeId>("auto");
  const [outputCount, setOutputCount] = useState(1);

  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [resultPrompt, setResultPrompt] = useState("");
  const [resultAspect, setResultAspect] = useState<AspectRatioId>("auto");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inFlightRef = useRef(false);

  const canGenerate = prompt.trim().length > 0 && status !== "generating";

  async function handleGenerate() {
    if (!canGenerate || inFlightRef.current) return;

    const trimmed = prompt.trim();
    if (!trimmed) return;

    inFlightRef.current = true;
    setStatus("generating");
    setErrorMessage(null);

    try {
      const result = await generateImages({
        prompt: trimmed,
        model,
        aspectRatio,
        quality,
        resolution,
        mode,
        count: outputCount,
      });

      setResults(result.images);
      setResultPrompt(result.prompt);
      setResultAspect(result.request.aspectRatio);
      setStatus("success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Generation failed. Please try again.";
      setErrorMessage(message);
      setStatus("error");
    } finally {
      inFlightRef.current = false;
    }
  }

  function renderWorkspace() {
    if (status === "generating" && results.length === 0) {
      return (
        <ImageGeneratingState count={outputCount} aspectRatio={aspectRatio} />
      );
    }

    if (results.length > 0) {
      return (
        <div className="relative flex-1">
          <ImageResults
            images={results}
            aspectRatio={resultAspect}
            prompt={resultPrompt}
          />
          {status === "generating" ? (
            <div className="pointer-events-none absolute inset-0 flex items-start justify-center bg-hf-bg/55 pt-10 backdrop-blur-[1px]">
              <span className="rounded-full border border-hf-border bg-hf-surface px-4 py-2 text-[13px] text-hf-text shadow-lg">
                Generating…
              </span>
            </div>
          ) : null}
        </div>
      );
    }

    return <ImageEmptyState />;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col">
      {renderWorkspace()}

      {errorMessage ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-[7.5rem] z-20 flex justify-center px-3 sm:bottom-[8.5rem] sm:px-5">
          <div
            role="alert"
            className="pointer-events-auto max-w-[980px] rounded-xl border border-red-500/40 bg-[#1a1010] px-4 py-2.5 text-[13px] text-red-200"
          >
            {errorMessage}
          </div>
        </div>
      ) : null}

      <ImageComposer
        prompt={prompt}
        onPromptChange={setPrompt}
        model={model}
        onModelChange={setModel}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        quality={quality}
        onQualityChange={setQuality}
        resolution={resolution}
        onResolutionChange={setResolution}
        mode={mode}
        onModeChange={setMode}
        outputCount={outputCount}
        onOutputCountChange={setOutputCount}
        canGenerate={canGenerate}
        isGenerating={status === "generating"}
        onGenerate={handleGenerate}
      />
    </div>
  );
}

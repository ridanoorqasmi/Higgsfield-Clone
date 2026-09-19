"use client";

import { useEffect, useRef, useState } from "react";
import { generateVideo, type GeneratedVideo, type VideoGenerationStatus } from "@/lib/video";
import {
  DEFAULT_VIDEO_ASPECT,
  DEFAULT_VIDEO_DURATION,
  DEFAULT_VIDEO_MODEL,
  type VideoAspectRatioId,
  type VideoDurationId,
  type VideoModelId,
} from "@/lib/video/options";
import type { VideoGenerationRequest } from "@/lib/video/types";
import { VideoCreatePanel } from "./VideoCreatePanel";
import { VideoStage } from "./VideoStage";

export function VideoWorkspace() {
  const [model, setModel] = useState<VideoModelId>(DEFAULT_VIDEO_MODEL);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatioId>(DEFAULT_VIDEO_ASPECT);
  const [duration, setDuration] = useState<VideoDurationId>(DEFAULT_VIDEO_DURATION);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);

  const [status, setStatus] = useState<VideoGenerationStatus>("idle");
  const [result, setResult] = useState<GeneratedVideo | null>(null);
  const [resultPrompt, setResultPrompt] = useState("");
  const [resultRequest, setResultRequest] = useState<VideoGenerationRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const canGenerate = prompt.trim().length > 0 && status !== "generating";

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  function handleReferenceSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.");
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setReferencePreview(url);
    setErrorMessage(null);
  }

  function handleReferenceRemove() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setReferencePreview(null);
  }

  async function handleGenerate() {
    if (!canGenerate || inFlightRef.current) return;

    const trimmed = prompt.trim();
    if (!trimmed) return;

    inFlightRef.current = true;
    setStatus("generating");
    setErrorMessage(null);

    try {
      const next = await generateVideo({
        prompt: trimmed,
        model,
        aspectRatio,
        duration,
        hasReferenceImage: Boolean(referencePreview),
      });

      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = next.video.url;
      setResult(next.video);
      setResultPrompt(next.prompt);
      setResultRequest(next.request);
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

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      <VideoCreatePanel
        model={model}
        onModelChange={setModel}
        prompt={prompt}
        onPromptChange={setPrompt}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        duration={duration}
        onDurationChange={setDuration}
        referencePreview={referencePreview}
        onReferenceSelect={handleReferenceSelect}
        onReferenceRemove={handleReferenceRemove}
        fileInputRef={fileInputRef}
        canGenerate={canGenerate}
        isGenerating={status === "generating"}
        hasResult={Boolean(result)}
        onGenerate={handleGenerate}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        {errorMessage && status !== "error" ? (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center px-4">
            <div
              role="alert"
              className="pointer-events-auto max-w-xl rounded-xl border border-red-500/40 bg-[#1a1010] px-4 py-2.5 text-[13px] text-red-200"
            >
              {errorMessage}
            </div>
          </div>
        ) : null}

        <VideoStage
          status={status}
          result={result}
          resultRequest={resultRequest}
          resultPrompt={resultPrompt}
          errorMessage={errorMessage}
          onAddImage={() => fileInputRef.current?.click()}
          onRetry={handleGenerate}
        />
      </div>
    </div>
  );
}

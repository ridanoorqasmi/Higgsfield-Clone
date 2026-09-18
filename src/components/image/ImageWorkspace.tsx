"use client";

import { useState } from "react";
import type {
  AspectRatioId,
  ImageModelId,
  ModeId,
  QualityId,
  ResolutionId,
} from "@/lib/image-options";
import { ImageComposer } from "./ImageComposer";
import { ImageEmptyState } from "./ImageEmptyState";

export function ImageWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<ImageModelId>("gpt-image-2");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>("auto");
  const [quality, setQuality] = useState<QualityId>("high");
  const [resolution, setResolution] = useState<ResolutionId>("2k");
  const [mode, setMode] = useState<ModeId>("auto");
  const [outputCount, setOutputCount] = useState(1);

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col">
      <ImageEmptyState />
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
      />
    </div>
  );
}

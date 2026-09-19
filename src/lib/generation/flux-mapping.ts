import type { AspectRatioId, ModeId, QualityId } from "@/lib/image-options";
import type { GenerationRequest } from "./types";

export const FLUX_MODEL_ID = "@cf/black-forest-labs/flux-1-schnell";

const FLUX_PROMPT_MAX = 2048;

const QUALITY_STEPS: Record<QualityId, number> = {
  standard: 2,
  high: 4,
  ultra: 8,
};

const MODE_SUFFIX: Record<ModeId, string> = {
  auto: "",
  creative:
    " Interpret the subject imaginatively, with unexpected composition and visual invention.",
  precise: " Follow the requested subject and details closely, with accurate composition.",
};

const ASPECT_SUFFIX: Record<AspectRatioId, string> = {
  auto: "",
  "1:1": " Compose the image as a 1:1 square frame.",
  "4:5": " Compose the image as a 4:5 portrait frame.",
  "16:9": " Compose the image as a 16:9 widescreen frame.",
  "9:16": " Compose the image as a 9:16 vertical frame.",
};

export type FluxGenerationParams = {
  prompt: string;
  steps: number;
};

export function mapFluxSteps(quality: QualityId): number {
  return QUALITY_STEPS[quality];
}

export function mapFluxPrompt(
  prompt: string,
  mode: ModeId,
  aspectRatio: AspectRatioId,
): string {
  const suffix = `${ASPECT_SUFFIX[aspectRatio]}${MODE_SUFFIX[mode]}`;
  if (!suffix) return prompt.slice(0, FLUX_PROMPT_MAX);

  const budget = FLUX_PROMPT_MAX - suffix.length;
  const base = budget > 0 ? prompt.slice(0, budget) : "";
  return `${base}${suffix}`.slice(0, FLUX_PROMPT_MAX);
}

export function mapGenerationToFlux(request: GenerationRequest): FluxGenerationParams {
  return {
    prompt: mapFluxPrompt(request.prompt, request.mode, request.aspectRatio),
    steps: mapFluxSteps(request.quality),
  };
}

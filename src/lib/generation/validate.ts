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
import type { GeneratedImage, GenerationRequest, GenerationResult } from "./types";

const MAX_PROMPT_LENGTH = 2048;

const MODEL_IDS = new Set<string>(IMAGE_MODELS.map((item) => item.id));
const ASPECT_IDS = new Set<string>(ASPECT_RATIOS.map((item) => item.id));
const QUALITY_IDS = new Set<string>(QUALITY_OPTIONS.map((item) => item.id));
const RESOLUTION_IDS = new Set<string>(RESOLUTION_OPTIONS.map((item) => item.id));
const MODE_IDS = new Set<string>(MODE_OPTIONS.map((item) => item.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function parseGenerationRequest(
  value: unknown,
): { ok: true; request: GenerationRequest } | { ok: false; error: string } {
  if (!isRecord(value)) {
    return { ok: false, error: "Invalid generation request." };
  }

  if (!isNonEmptyString(value.prompt)) {
    return { ok: false, error: "Prompt is required." };
  }

  const prompt = value.prompt.trim();
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { ok: false, error: "Prompt is too long." };
  }

  const count = typeof value.count === "number" ? Math.floor(value.count) : Number.NaN;
  if (!Number.isInteger(count) || count < MIN_OUTPUT_COUNT || count > MAX_OUTPUT_COUNT) {
    return { ok: false, error: "Output count must be between 1 and 4." };
  }

  const model = value.model;
  const aspectRatio = value.aspectRatio;
  const quality = value.quality;
  const resolution = value.resolution;
  const mode = value.mode;

  if (
    typeof model !== "string" ||
    !MODEL_IDS.has(model) ||
    typeof aspectRatio !== "string" ||
    !ASPECT_IDS.has(aspectRatio) ||
    typeof quality !== "string" ||
    !QUALITY_IDS.has(quality) ||
    typeof resolution !== "string" ||
    !RESOLUTION_IDS.has(resolution) ||
    typeof mode !== "string" ||
    !MODE_IDS.has(mode)
  ) {
    return { ok: false, error: "Invalid generation settings." };
  }

  return {
    ok: true,
    request: {
      prompt,
      model: model as ImageModelId,
      aspectRatio: aspectRatio as AspectRatioId,
      quality: quality as QualityId,
      resolution: resolution as ResolutionId,
      mode: mode as ModeId,
      count,
    },
  };
}

function parseGeneratedImage(value: unknown): GeneratedImage | null {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.url) || !isNonEmptyString(value.alt)) {
    return null;
  }
  return { id: value.id, url: value.url, alt: value.alt };
}

export function parseGenerationResult(value: unknown): GenerationResult | null {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.prompt)) return null;

  const parsedRequest = parseGenerationRequest(value.request);
  if (!parsedRequest.ok) return null;

  if (!Array.isArray(value.images) || value.images.length === 0) return null;
  const images = value.images
    .map(parseGeneratedImage)
    .filter((item): item is GeneratedImage => item !== null);
  if (images.length !== value.images.length) return null;
  if (images.length !== parsedRequest.request.count) return null;

  return {
    images,
    prompt: value.prompt.trim(),
    request: parsedRequest.request,
  };
}

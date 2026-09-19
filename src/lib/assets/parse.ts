import {
  ASPECT_RATIOS,
  IMAGE_MODELS,
  LEGACY_IMAGE_MODELS,
  LEGACY_RESOLUTION_IDS,
  MODE_OPTIONS,
  QUALITY_OPTIONS,
  RESOLUTION_OPTIONS,
  type AspectRatioId,
  type ModeId,
  type QualityId,
  type StoredImageModelId,
  type StoredResolutionId,
} from "@/lib/image-options";
import type { Generation, GenerationOutput, GenerationSettings } from "./types";

const MODEL_IDS = new Set<string>([
  ...IMAGE_MODELS.map((item) => item.id),
  ...LEGACY_IMAGE_MODELS.map((item) => item.id),
]);
const ASPECT_IDS = new Set<string>(ASPECT_RATIOS.map((item) => item.id));
const QUALITY_IDS = new Set<string>(QUALITY_OPTIONS.map((item) => item.id));
const RESOLUTION_IDS = new Set<string>([
  ...RESOLUTION_OPTIONS.map((item) => item.id),
  ...LEGACY_RESOLUTION_IDS,
]);
const MODE_IDS = new Set<string>(MODE_OPTIONS.map((item) => item.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseOutput(value: unknown): GenerationOutput | null {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.url)) return null;
  return { id: value.id, url: value.url };
}

function parseSettings(value: unknown): GenerationSettings | null {
  if (!isRecord(value)) return null;
  const aspectRatio = value.aspectRatio;
  const quality = value.quality;
  const resolution = value.resolution;
  const mode = value.mode;
  if (
    typeof aspectRatio !== "string" ||
    !ASPECT_IDS.has(aspectRatio) ||
    typeof quality !== "string" ||
    !QUALITY_IDS.has(quality) ||
    typeof resolution !== "string" ||
    !RESOLUTION_IDS.has(resolution) ||
    typeof mode !== "string" ||
    !MODE_IDS.has(mode)
  ) {
    return null;
  }
  return {
    aspectRatio: aspectRatio as AspectRatioId,
    quality: quality as QualityId,
    resolution: resolution as StoredResolutionId,
    mode: mode as ModeId,
  };
}

export function parseGeneration(value: unknown): Generation | null {
  if (!isRecord(value)) return null;
  if (value.type !== "image") return null;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.prompt)) return null;
  if (!isNonEmptyString(value.createdAt)) return null;
  if (typeof value.model !== "string" || !MODEL_IDS.has(value.model)) return null;

  const settings = parseSettings(value.settings);
  if (!settings) return null;

  if (!Array.isArray(value.outputs) || value.outputs.length === 0) return null;
  const outputs = value.outputs
    .map(parseOutput)
    .filter((item): item is GenerationOutput => item !== null);
  if (outputs.length !== value.outputs.length) return null;

  return {
    id: value.id,
    type: "image",
    prompt: value.prompt,
    model: value.model as StoredImageModelId,
    createdAt: value.createdAt,
    settings,
    outputs,
  };
}

export function parseGenerations(value: unknown): Generation[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(parseGeneration)
    .filter((item): item is Generation => item !== null)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

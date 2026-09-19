export const IMAGE_MODELS = [
  { id: "flux-1-schnell", label: "FLUX.1 Schnell", badge: "TOP" as const },
] as const;

/** Older stored Assets entries from Phase 5–8 demo/UI labels. */
export const LEGACY_IMAGE_MODELS = [
  { id: "gpt-image-2", label: "GPT Image 2" },
  { id: "gpt-image-2-5-sunburst", label: "GPT Image 2.5 Sunburst" },
  { id: "gpt-image-2-5-flare", label: "GPT Image 2.5 Flare" },
  { id: "higgsfield-soul-cinema", label: "Higgsfield Soul Cinema" },
  { id: "nano-banana-pro", label: "Nano Banana Pro" },
] as const;

export const ASPECT_RATIOS = [
  { id: "auto", label: "Auto" },
  { id: "1:1", label: "1:1" },
  { id: "4:5", label: "4:5" },
  { id: "16:9", label: "16:9" },
  { id: "9:16", label: "9:16" },
] as const;

export const QUALITY_OPTIONS = [
  { id: "standard", label: "Standard" },
  { id: "high", label: "High" },
  { id: "ultra", label: "Ultra" },
] as const;

export const RESOLUTION_OPTIONS = [{ id: "1k", label: "1K" }] as const;

/**
 * 2K/4K need width/height that Cloudflare's FLUX REST schema rejects.
 * Kept only so older Assets entries still parse.
 */
export const LEGACY_RESOLUTION_IDS = ["2k", "4k"] as const;

export const MODE_OPTIONS = [
  { id: "auto", label: "Auto" },
  { id: "creative", label: "Creative" },
  { id: "precise", label: "Precise" },
] as const;

export const MAX_OUTPUT_COUNT = 4;
export const MIN_OUTPUT_COUNT = 1;

export type ImageModelId = (typeof IMAGE_MODELS)[number]["id"];
export type LegacyImageModelId = (typeof LEGACY_IMAGE_MODELS)[number]["id"];
export type StoredImageModelId = ImageModelId | LegacyImageModelId;
export type AspectRatioId = (typeof ASPECT_RATIOS)[number]["id"];
export type QualityId = (typeof QUALITY_OPTIONS)[number]["id"];
export type ResolutionId = (typeof RESOLUTION_OPTIONS)[number]["id"];
export type StoredResolutionId = ResolutionId | (typeof LEGACY_RESOLUTION_IDS)[number];
export type ModeId = (typeof MODE_OPTIONS)[number]["id"];

export function getModelLabel(modelId: string): string {
  const current = IMAGE_MODELS.find((item) => item.id === modelId);
  if (current) return current.label;
  const legacy = LEGACY_IMAGE_MODELS.find((item) => item.id === modelId);
  return legacy?.label ?? modelId;
}

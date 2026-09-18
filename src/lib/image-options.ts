export const IMAGE_MODELS = [
  { id: "gpt-image-2", label: "GPT Image 2", badge: "TOP" as const },
  { id: "gpt-image-2-5-sunburst", label: "GPT Image 2.5 Sunburst", badge: "NEW" as const },
  { id: "gpt-image-2-5-flare", label: "GPT Image 2.5 Flare", badge: "NEW" as const },
  { id: "higgsfield-soul-cinema", label: "Higgsfield Soul Cinema" },
  { id: "nano-banana-pro", label: "Nano Banana Pro", badge: "TOP" as const },
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

export const RESOLUTION_OPTIONS = [
  { id: "1k", label: "1K" },
  { id: "2k", label: "2K" },
  { id: "4k", label: "4K" },
] as const;

export const MODE_OPTIONS = [
  { id: "auto", label: "Auto" },
  { id: "creative", label: "Creative" },
  { id: "precise", label: "Precise" },
] as const;

export const MAX_OUTPUT_COUNT = 4;
export const MIN_OUTPUT_COUNT = 1;

export type ImageModelId = (typeof IMAGE_MODELS)[number]["id"];
export type AspectRatioId = (typeof ASPECT_RATIOS)[number]["id"];
export type QualityId = (typeof QUALITY_OPTIONS)[number]["id"];
export type ResolutionId = (typeof RESOLUTION_OPTIONS)[number]["id"];
export type ModeId = (typeof MODE_OPTIONS)[number]["id"];

import {
  VIDEO_ASPECT_RATIOS,
  VIDEO_DURATIONS,
  VIDEO_MODELS,
  type VideoAspectRatioId,
  type VideoDurationId,
  type VideoModelId,
} from "./options";
import type { VideoGenerationRequest } from "./types";

const MODEL_IDS = new Set<string>(VIDEO_MODELS.map((item) => item.id));
const ASPECT_IDS = new Set<string>(VIDEO_ASPECT_RATIOS.map((item) => item.id));
const DURATION_IDS = new Set<string>(VIDEO_DURATIONS.map((item) => item.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseVideoGenerationRequest(
  value: unknown,
): { ok: true; request: VideoGenerationRequest } | { ok: false; error: string } {
  if (!isRecord(value)) {
    return { ok: false, error: "Invalid video request." };
  }

  if (typeof value.prompt !== "string" || value.prompt.trim().length === 0) {
    return { ok: false, error: "Prompt is required." };
  }

  const prompt = value.prompt.trim();
  if (prompt.length > 2048) {
    return { ok: false, error: "Prompt is too long." };
  }

  if (
    typeof value.model !== "string" ||
    !MODEL_IDS.has(value.model) ||
    typeof value.aspectRatio !== "string" ||
    !ASPECT_IDS.has(value.aspectRatio) ||
    typeof value.duration !== "string" ||
    !DURATION_IDS.has(value.duration)
  ) {
    return { ok: false, error: "Invalid video settings." };
  }

  return {
    ok: true,
    request: {
      prompt,
      model: value.model as VideoModelId,
      aspectRatio: value.aspectRatio as VideoAspectRatioId,
      duration: value.duration as VideoDurationId,
      hasReferenceImage: value.hasReferenceImage === true,
    },
  };
}

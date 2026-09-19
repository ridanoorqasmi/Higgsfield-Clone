import type { GenerationRequest, GenerationResult } from "./types";
import { parseGenerationResult } from "./validate";

/**
 * Client entry point for image generation.
 * Calls the server route, which talks to Cloudflare Workers AI.
 */
export async function generateImages(
  request: GenerationRequest,
): Promise<GenerationResult> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "Generation failed. Please try again.";
    throw new Error(message);
  }

  const result = parseGenerationResult(payload);
  if (!result) {
    throw new Error("Generation failed. Please try again.");
  }

  return result;
}

export type {
  GeneratedImage,
  GenerationRequest,
  GenerationResult,
  GenerationStatus,
  ImageGenerationProvider,
} from "./types";

import { demoImageProvider } from "./demo-provider";
import type { GenerationRequest, GenerationResult } from "./types";

/**
 * Single entry point for image generation.
 * Phase 5 uses a local demo provider; a later phase can swap the implementation
 * without changing Image UI components.
 */
export async function generateImages(
  request: GenerationRequest,
): Promise<GenerationResult> {
  return demoImageProvider.generate(request);
}

export type {
  GeneratedImage,
  GenerationRequest,
  GenerationResult,
  GenerationStatus,
  ImageGenerationProvider,
} from "./types";

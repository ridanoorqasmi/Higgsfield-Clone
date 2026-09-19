import { demoVideoProvider } from "./demo-provider";
import type { VideoGenerationRequest, VideoGenerationResult } from "./types";

/**
 * Client entry point for video generation.
 * Phase 9 uses a local demo provider; a later phase can swap this.
 */
export async function generateVideo(
  request: VideoGenerationRequest,
): Promise<VideoGenerationResult> {
  return demoVideoProvider.generate(request);
}

export type {
  GeneratedVideo,
  VideoGenerationRequest,
  VideoGenerationResult,
  VideoGenerationStatus,
} from "./types";

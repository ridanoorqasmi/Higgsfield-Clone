import type { VideoAspectRatioId, VideoDurationId, VideoModelId } from "./options";

export type VideoGenerationStatus = "idle" | "generating" | "success" | "error";

export type VideoGenerationRequest = {
  prompt: string;
  model: VideoModelId;
  aspectRatio: VideoAspectRatioId;
  duration: VideoDurationId;
  hasReferenceImage: boolean;
};

export type GeneratedVideo = {
  id: string;
  url: string | null;
  posterUrl: string | null;
  alt: string;
};

export type VideoGenerationResult = {
  video: GeneratedVideo;
  prompt: string;
  request: VideoGenerationRequest;
};

export type VideoGenerationProvider = {
  generate(request: VideoGenerationRequest): Promise<VideoGenerationResult>;
};

import type {
  AspectRatioId,
  ImageModelId,
  ModeId,
  QualityId,
  ResolutionId,
} from "@/lib/image-options";

export type GenerationStatus = "idle" | "generating" | "success" | "error";

export type GenerationRequest = {
  prompt: string;
  model: ImageModelId;
  aspectRatio: AspectRatioId;
  quality: QualityId;
  resolution: ResolutionId;
  mode: ModeId;
  count: number;
};

export type GeneratedImage = {
  id: string;
  url: string;
  alt: string;
};

export type GenerationResult = {
  images: GeneratedImage[];
  prompt: string;
  request: GenerationRequest;
};

export type ImageGenerationProvider = {
  generate(request: GenerationRequest): Promise<GenerationResult>;
};

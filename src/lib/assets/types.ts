import type {
  AspectRatioId,
  ImageModelId,
  ModeId,
  QualityId,
  ResolutionId,
} from "@/lib/image-options";

export type GenerationType = "image";

export type GenerationSettings = {
  aspectRatio: AspectRatioId;
  quality: QualityId;
  resolution: ResolutionId;
  mode: ModeId;
};

export type GenerationOutput = {
  id: string;
  url: string;
};

export type Generation = {
  id: string;
  type: GenerationType;
  prompt: string;
  model: ImageModelId;
  createdAt: string;
  settings: GenerationSettings;
  outputs: GenerationOutput[];
};

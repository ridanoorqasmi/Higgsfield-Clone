import type {
  AspectRatioId,
  ModeId,
  QualityId,
  StoredImageModelId,
  StoredResolutionId,
} from "@/lib/image-options";

export type GenerationType = "image";

export type GenerationSettings = {
  aspectRatio: AspectRatioId;
  quality: QualityId;
  resolution: StoredResolutionId;
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
  model: StoredImageModelId;
  createdAt: string;
  settings: GenerationSettings;
  outputs: GenerationOutput[];
};

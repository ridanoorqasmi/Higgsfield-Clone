export const VIDEO_MODELS = [
  { id: "kling-2-5", label: "Kling 2.5", caption: "General" },
] as const;

export const VIDEO_ASPECT_RATIOS = [
  { id: "16:9", label: "16:9" },
  { id: "9:16", label: "9:16" },
  { id: "1:1", label: "1:1" },
] as const;

export const VIDEO_DURATIONS = [
  { id: "5s", label: "5s", seconds: 5 },
  { id: "10s", label: "10s", seconds: 10 },
] as const;

export type VideoModelId = (typeof VIDEO_MODELS)[number]["id"];
export type VideoAspectRatioId = (typeof VIDEO_ASPECT_RATIOS)[number]["id"];
export type VideoDurationId = (typeof VIDEO_DURATIONS)[number]["id"];

export const DEFAULT_VIDEO_MODEL: VideoModelId = "kling-2-5";
export const DEFAULT_VIDEO_ASPECT: VideoAspectRatioId = "16:9";
export const DEFAULT_VIDEO_DURATION: VideoDurationId = "5s";

export const VIDEO_ASPECT_CSS: Record<VideoAspectRatioId, string> = {
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "1:1": "1 / 1",
};

export function durationSeconds(id: VideoDurationId): number {
  return VIDEO_DURATIONS.find((item) => item.id === id)?.seconds ?? 5;
}

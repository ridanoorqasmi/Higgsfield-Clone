import { durationSeconds } from "./options";
import type {
  VideoGenerationProvider,
  VideoGenerationRequest,
  VideoGenerationResult,
} from "./types";
import { parseVideoGenerationRequest } from "./validate";

const DEMO_DELAY_MS = 1400;
const DEMO_POSTER = "/ui/previews/card-3.jpg";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `vid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function pickRecorderMime(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

function canvasSize(aspectRatio: VideoGenerationRequest["aspectRatio"]): {
  width: number;
  height: number;
} {
  if (aspectRatio === "9:16") return { width: 360, height: 640 };
  if (aspectRatio === "1:1") return { width: 480, height: 480 };
  return { width: 640, height: 360 };
}

async function recordDemoClip(
  request: VideoGenerationRequest,
): Promise<string | null> {
  if (typeof document === "undefined") return null;
  const mime = pickRecorderMime();
  if (!mime || typeof HTMLCanvasElement === "undefined") return null;

  const { width, height } = canvasSize(request.aspectRatio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let stream: MediaStream;
  try {
    stream = canvas.captureStream(24);
  } catch {
    return null;
  }

  const chunks: BlobPart[] = [];
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType: mime });
  } catch {
    return null;
  }

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const seconds = Math.min(3, durationSeconds(request.duration));
  const started = performance.now();

  recorder.start();

  await new Promise<void>((resolve) => {
    const draw = (now: number) => {
      const t = (now - started) / 1000;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2);
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = `rgba(212, 255, 0, ${0.08 + pulse * 0.08})`;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#f5f5f5";
      ctx.font = `600 ${Math.round(width * 0.045)}px sans-serif`;
      ctx.fillText("Demo video", 24, height * 0.42);
      ctx.fillStyle = "#8a8a8a";
      ctx.font = `400 ${Math.round(width * 0.03)}px sans-serif`;
      ctx.fillText(`${request.aspectRatio} · ${request.duration}`, 24, height * 0.5);
      if (t < seconds) {
        requestAnimationFrame(draw);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(draw);
  });

  await new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
    recorder.stop();
  });

  stream.getTracks().forEach((track) => track.stop());
  if (chunks.length === 0) return null;

  const blob = new Blob(chunks, { type: mime });
  if (blob.size < 32) return null;
  return URL.createObjectURL(blob);
}

export const demoVideoProvider: VideoGenerationProvider = {
  async generate(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    const parsed = parseVideoGenerationRequest(request);
    if (!parsed.ok) {
      throw new Error(parsed.error);
    }

    await delay(DEMO_DELAY_MS);

    let url: string | null = null;
    try {
      url = await recordDemoClip(parsed.request);
    } catch {
      url = null;
    }

    return {
      video: {
        id: createId(),
        url,
        posterUrl: DEMO_POSTER,
        alt: parsed.request.prompt,
      },
      prompt: parsed.request.prompt,
      request: parsed.request,
    };
  },
};

import type {
  GeneratedImage,
  GenerationRequest,
  GenerationResult,
  ImageGenerationProvider,
} from "./types";

/** Local demo assets only — no network. Swap this provider later for a real API. */
const DEMO_IMAGE_POOL: Omit<GeneratedImage, "id">[] = [
  {
    url: "/ui/previews/card-1.jpg",
    alt: "Demo generation — cinematic musician",
  },
  {
    url: "/ui/previews/card-2.jpg",
    alt: "Demo generation — warm couple silhouette",
  },
  {
    url: "/ui/previews/card-3.jpg",
    alt: "Demo generation — portrait on telephone",
  },
  {
    url: "/ui/previews/card-4.jpg",
    alt: "Demo generation — candid laugh portrait",
  },
];

const DEMO_DELAY_MS = 1400;

function clampCount(count: number): number {
  return Math.min(4, Math.max(1, Math.floor(count)));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const demoImageProvider: ImageGenerationProvider = {
  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const prompt = request.prompt.trim();
    if (!prompt) {
      throw new Error("Prompt is required.");
    }

    const count = clampCount(request.count);
    await delay(DEMO_DELAY_MS);

    const images: GeneratedImage[] = Array.from({ length: count }, (_, index) => {
      const source = DEMO_IMAGE_POOL[index % DEMO_IMAGE_POOL.length];
      return {
        id: `demo-${Date.now()}-${index}`,
        url: source.url,
        alt: `${source.alt} (${index + 1}/${count})`,
      };
    });

    return {
      images,
      prompt,
      request: { ...request, prompt, count },
    };
  },
};

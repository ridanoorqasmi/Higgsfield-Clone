import { generateFluxImage } from "@/lib/generation/cloudflare-flux";
import type { GenerationResult } from "@/lib/generation";
import { parseGenerationRequest } from "@/lib/generation/validate";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid generation request.", 400);
  }

  const parsed = parseGenerationRequest(body);
  if (!parsed.ok) {
    return errorResponse(parsed.error, 400);
  }

  try {
    const images = [];
    for (let index = 0; index < parsed.request.count; index += 1) {
      const image = await generateFluxImage(parsed.request.prompt);
      images.push({
        id: image.id,
        url: image.url,
        alt: parsed.request.prompt,
      });
    }

    const result: GenerationResult = {
      images,
      prompt: parsed.request.prompt,
      request: parsed.request,
    };

    return Response.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_CONFIGURED") {
      return errorResponse("Image generation is not configured.", 500);
    }
    return errorResponse("Generation failed. Please try again.", 502);
  }
}

import { FLUX_MODEL_ID, type FluxGenerationParams } from "./flux-mapping";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractBase64Image(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  if (isRecord(payload.result) && typeof payload.result.image === "string") {
    return payload.result.image.trim();
  }
  if (typeof payload.image === "string") {
    return payload.image.trim();
  }
  return null;
}

function createImageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function generateFluxImage(params: FluxGenerationParams): Promise<{
  id: string;
  url: string;
}> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("NOT_CONFIGURED");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${FLUX_MODEL_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: params.prompt,
        steps: params.steps,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("PROVIDER_FAILED");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("PROVIDER_FAILED");
  }

  if (isRecord(payload) && payload.success === false) {
    throw new Error("PROVIDER_FAILED");
  }

  const image = extractBase64Image(payload);
  if (!image || image.length < 32) {
    throw new Error("PROVIDER_FAILED");
  }

  return {
    id: createImageId(),
    url: `data:image/jpeg;base64,${image}`,
  };
}

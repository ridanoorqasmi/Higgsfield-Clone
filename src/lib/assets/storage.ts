import type { GenerationResult } from "@/lib/generation";
import { parseGenerations } from "./parse";
import type { Generation } from "./types";

const STORAGE_KEY = "higgsfield-clone.generations";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createGenerationId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `gen-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generationFromResult(result: GenerationResult): Generation {
  return {
    id: createGenerationId(),
    type: "image",
    prompt: result.prompt,
    model: result.request.model,
    createdAt: new Date().toISOString(),
    settings: {
      aspectRatio: result.request.aspectRatio,
      quality: result.request.quality,
      resolution: result.request.resolution,
      mode: result.request.mode,
    },
    outputs: result.images.map((image) => ({
      id: image.id,
      url: image.url,
    })),
  };
}

export function readGenerations(): Generation[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return parseGenerations(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function writeGenerations(generations: Generation[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(generations));
}

export function appendGeneration(generation: Generation): void {
  const existing = readGenerations();
  writeGenerations([generation, ...existing]);
}

export function saveGenerationFromResult(result: GenerationResult): Generation {
  const generation = generationFromResult(result);
  appendGeneration(generation);
  return generation;
}

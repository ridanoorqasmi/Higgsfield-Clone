"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readGenerations, type Generation } from "@/lib/assets";
import { IMAGE_MODELS } from "@/lib/image-options";

function modelLabel(modelId: string): string {
  return IMAGE_MODELS.find((item) => item.id === modelId)?.label ?? modelId;
}

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function outputGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1 max-w-[220px]";
  if (count === 2) return "grid-cols-2 max-w-[460px]";
  if (count === 3) return "grid-cols-3 max-w-[680px]";
  return "grid-cols-2 sm:grid-cols-4 max-w-[900px]";
}

export function AssetsView() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setGenerations(readGenerations());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm text-hf-muted">Loading assets…</p>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <h1 className="text-2xl font-semibold text-hf-text sm:text-3xl">Assets</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-hf-muted">
          Generated images from your Image sessions will appear here.
        </p>
        <Link
          href="/image"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-hf-accent px-5 text-[14px] font-semibold text-hf-accent-text transition-colors hover:bg-hf-accent-hover"
        >
          Go to Image Generator
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-hf-text sm:text-3xl">Assets</h1>
        <p className="mt-2 text-sm text-hf-muted">
          {generations.length} generation{generations.length === 1 ? "" : "s"} saved locally
        </p>
      </div>

      <ul className="space-y-6">
        {generations.map((generation) => (
          <li
            key={generation.id}
            className="rounded-2xl border border-hf-border bg-hf-surface p-4 sm:p-5"
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="line-clamp-2 text-[15px] font-medium text-hf-text">
                  {generation.prompt}
                </p>
                <p className="mt-1 text-[12px] text-hf-muted">
                  {modelLabel(generation.model)} · {formatCreatedAt(generation.createdAt)} ·{" "}
                  {generation.outputs.length} output
                  {generation.outputs.length === 1 ? "" : "s"}
                </p>
              </div>
              <p className="shrink-0 text-[11px] uppercase tracking-wide text-hf-muted-2">
                {generation.settings.aspectRatio} · {generation.settings.quality} ·{" "}
                {generation.settings.resolution}
              </p>
            </div>

            <div className={`grid gap-2 sm:gap-3 ${outputGridClass(generation.outputs.length)}`}>
              {generation.outputs.map((output) => (
                <figure
                  key={output.id}
                  className="relative aspect-[4/5] overflow-hidden rounded-xl border border-hf-border bg-hf-surface-2"
                >
                  <Image
                    src={output.url}
                    alt={`${generation.prompt} output`}
                    fill
                    sizes="(max-width: 640px) 45vw, 220px"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

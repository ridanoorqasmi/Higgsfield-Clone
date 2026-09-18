import Link from "next/link";
import type { ExploreRoute } from "@/lib/explore";

type SectionHeaderProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: ExploreRoute;
};

export function SectionHeader({ title, description, ctaLabel, ctaHref }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-3xl">
        <h2 className="text-lg font-semibold uppercase tracking-wide text-hf-accent sm:text-xl">
          {title}
        </h2>
        <p className="mt-1.5 text-[13px] leading-5 text-hf-muted sm:text-sm">{description}</p>
      </div>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className="inline-flex h-9 shrink-0 items-center self-start rounded-full bg-hf-accent px-4 text-[13px] font-semibold text-hf-accent-text transition-colors hover:bg-hf-accent-hover sm:self-auto"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

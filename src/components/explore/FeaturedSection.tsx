import Link from "next/link";
import { FEATURED_ITEMS } from "@/lib/explore";
import { MediaPlaceholder } from "./MediaPlaceholder";

export function FeaturedSection() {
  return (
    <section aria-labelledby="featured-heading">
      <h2 id="featured-heading" className="sr-only">
        Featured
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {FEATURED_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group w-[min(78vw,320px)] shrink-0 sm:w-auto"
          >
            <div className="transition-transform duration-200 group-hover:-translate-y-0.5">
              <MediaPlaceholder
                mediaSrc={item.mediaSrc}
                aspectRatio="16/9"
                alt={item.title}
                overlayLabel={item.overlayLabel}
                className="border-hf-border-light transition-colors group-hover:border-hf-muted-2"
              />
              <div className="mt-2.5 px-0.5">
                <h3 className="text-[14px] font-semibold text-hf-text group-hover:text-white">
                  {item.title}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-hf-muted">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

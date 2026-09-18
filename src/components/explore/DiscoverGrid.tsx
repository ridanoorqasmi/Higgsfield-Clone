import Link from "next/link";
import type { ExploreMediaSlot } from "@/lib/explore";
import { MediaPlaceholder } from "./MediaPlaceholder";

type DiscoverGridProps = {
  items: ExploreMediaSlot[];
};

export function DiscoverGrid({ items }: DiscoverGridProps) {
  return (
    <div className="grid auto-rows-[minmax(88px,auto)] grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5 lg:auto-rows-[100px]">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={[
            "group min-h-[88px] overflow-hidden rounded-xl",
            item.gridClass ?? "col-span-1 row-span-1",
          ].join(" ")}
        >
          <MediaPlaceholder
            mediaSrc={item.mediaSrc}
            aspectRatio={item.aspectRatio}
            alt={item.label ?? "Discover item"}
            label={item.label}
            badge={item.badge}
            fill
            className="h-full border-hf-border-light transition-colors group-hover:border-hf-muted-2"
          />
        </Link>
      ))}
    </div>
  );
}

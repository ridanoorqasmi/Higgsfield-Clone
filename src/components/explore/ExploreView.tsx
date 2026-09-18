import { MODELS_SECTION, TRENDING_ITEMS, TRENDING_SECTION } from "@/lib/explore";
import { DiscoverGrid } from "./DiscoverGrid";
import { FeaturedSection } from "./FeaturedSection";
import { ModelsSection } from "./ModelsSection";
import { SectionHeader } from "./SectionHeader";

export function ExploreView() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 py-5 sm:px-5 sm:py-7">
      <FeaturedSection />

      <section className="mt-8 sm:mt-10" aria-labelledby="trending-heading">
        <SectionHeader
          title={TRENDING_SECTION.title}
          description={TRENDING_SECTION.description}
          ctaLabel={TRENDING_SECTION.ctaLabel}
          ctaHref={TRENDING_SECTION.ctaHref}
        />
        <DiscoverGrid items={TRENDING_ITEMS} />
      </section>

      <section className="mt-8 sm:mt-10" aria-labelledby="models-heading">
        <SectionHeader
          title={MODELS_SECTION.title}
          description={MODELS_SECTION.description}
          ctaLabel={MODELS_SECTION.ctaLabel}
          ctaHref={MODELS_SECTION.ctaHref}
        />
        <ModelsSection />
      </section>
    </div>
  );
}

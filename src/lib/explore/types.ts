export type ExploreRoute = "/image" | "/video";

export type ExploreAspectRatio = "16/9" | "4/5" | "9/16" | "1/1" | "21/9" | "3/4";

export type ExploreMediaSlot = {
  id: string;
  mediaSrc: string | null;
  aspectRatio: ExploreAspectRatio;
  href: ExploreRoute;
  label?: string;
  badge?: string;
  /** Tailwind grid placement classes, e.g. "col-span-2 row-span-2" */
  gridClass?: string;
};

export type FeaturedItem = {
  id: string;
  title: string;
  subtitle: string;
  mediaSrc: string | null;
  href: ExploreRoute;
  overlayLabel?: string;
};

export type ModelTool = {
  id: string;
  title: string;
  description: string;
  mediaSrc: string | null;
  href: ExploreRoute;
  badge?: "TOP" | "FREE" | "NEW";
  mediaType: "image" | "video";
};

export type ExploreSection = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: ExploreRoute;
};

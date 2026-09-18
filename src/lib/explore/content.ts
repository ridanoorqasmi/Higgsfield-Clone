import type { ExploreSection, FeaturedItem, ExploreMediaSlot, ModelTool } from "./types";

export const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: "featured-genjutsu",
    title: "Higgsfield Genjutsu",
    subtitle: "One-click object swap for image and video scenes.",
    mediaSrc: null,
    href: "/image",
    overlayLabel: "One-click object swap",
  },
  {
    id: "featured-motion",
    title: "AI Motion Designer",
    subtitle: "Turn prompts into motion graphics and animated layouts.",
    mediaSrc: null,
    href: "/video",
    overlayLabel: "Motion design",
  },
  {
    id: "featured-effects",
    title: "Higgsfield Effects",
    subtitle: "Apply cinematic presets and stylized visual treatments.",
    mediaSrc: null,
    href: "/video",
    overlayLabel: "Wild ride",
  },
];

export const MODELS_SECTION: ExploreSection = {
  id: "models-creative-tools",
  title: "Models & Creative Tools",
  description: "Jump into image and video workflows with featured models and studio tools.",
  ctaLabel: "Open Image",
  ctaHref: "/image",
};

export const MODEL_TOOLS: ModelTool[] = [
  {
    id: "model-nano-banana",
    title: "Nano Banana Pro",
    description: "High-quality image generation with fast iteration.",
    mediaSrc: null,
    href: "/image",
    badge: "TOP",
    mediaType: "image",
  },
  {
    id: "model-gpt-image",
    title: "GPT Image 2",
    description: "Versatile image creation with flexible aspect ratios.",
    mediaSrc: null,
    href: "/image",
    mediaType: "image",
  },
  {
    id: "model-seedance",
    title: "Seedance 2.5",
    description: "Cinematic video generation with motion-aware presets.",
    mediaSrc: null,
    href: "/video",
    badge: "NEW",
    mediaType: "video",
  },
  {
    id: "model-cinema",
    title: "Cinema Studio 4.0",
    description: "Film-grade video looks with controlled camera motion.",
    mediaSrc: null,
    href: "/video",
    mediaType: "video",
  },
  {
    id: "model-effects",
    title: "Higgsfield Effects",
    description: "Stylized presets for bold visual storytelling.",
    mediaSrc: null,
    href: "/video",
    badge: "FREE",
    mediaType: "video",
  },
  {
    id: "model-edit",
    title: "Edit Studio",
    description: "Refine generations with inpaint and object swap tools.",
    mediaSrc: null,
    href: "/image",
    mediaType: "image",
  },
];

export const TRENDING_SECTION: ExploreSection = {
  id: "trending-discover",
  title: "Trending & Discover",
  description:
    "Fresh creative directions, visual effects presets, and popular looks to start your next project.",
  ctaLabel: "Try for free",
  ctaHref: "/image",
};

export const TRENDING_ITEMS: ExploreMediaSlot[] = [
  {
    id: "trending-1",
    mediaSrc: null,
    aspectRatio: "9/16",
    href: "/video",
    label: "Seedance",
    gridClass: "col-span-1 row-span-2",
  },
  {
    id: "trending-2",
    mediaSrc: null,
    aspectRatio: "16/9",
    href: "/image",
    gridClass: "col-span-2 row-span-1",
  },
  {
    id: "trending-3",
    mediaSrc: null,
    aspectRatio: "1/1",
    href: "/image",
    badge: "Trending",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: "trending-4",
    mediaSrc: null,
    aspectRatio: "4/5",
    href: "/image",
    label: "Levitation",
    gridClass: "col-span-1 row-span-2",
  },
  {
    id: "trending-5",
    mediaSrc: null,
    aspectRatio: "16/9",
    href: "/video",
    label: "Cinematic",
    gridClass: "col-span-2 row-span-1",
  },
  {
    id: "trending-6",
    mediaSrc: null,
    aspectRatio: "3/4",
    href: "/image",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: "trending-7",
    mediaSrc: null,
    aspectRatio: "16/9",
    href: "/video",
    gridClass: "col-span-2 row-span-1",
  },
  {
    id: "trending-8",
    mediaSrc: null,
    aspectRatio: "1/1",
    href: "/image",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: "trending-9",
    mediaSrc: null,
    aspectRatio: "4/5",
    href: "/image",
    label: "Portrait",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: "trending-10",
    mediaSrc: null,
    aspectRatio: "16/9",
    href: "/video",
    badge: "Hot",
    gridClass: "col-span-2 row-span-1",
  },
];

import { Template } from "./types";

export type TemplateAspectRatio =
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "3:2"
  | "2:3"
  | "4:5"
  | "5:4";

export type TemplateOrientation = "landscape" | "portrait" | "square";

export const ALL_ASPECT_RATIOS: TemplateAspectRatio[] = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
];

export const ORIENTATION_OPTIONS: { id: "all" | TemplateOrientation; label: string }[] = [
  { id: "all", label: "All" },
  { id: "landscape", label: "Landscape" },
  { id: "portrait", label: "Portrait" },
  { id: "square", label: "Square" },
];

export const LANDSCAPE_RATIOS: TemplateAspectRatio[] = ["16:9", "4:3", "3:2", "5:4"];
export const PORTRAIT_RATIOS: TemplateAspectRatio[] = ["9:16", "3:4", "2:3", "4:5"];
export const SQUARE_RATIOS: TemplateAspectRatio[] = ["1:1"];

/**
 * Curated aspect ratio registry for all AWA templates.
 * Reflects authentic design formats (stories, vertical videos, posters, portraits, squares, landscapes, slides).
 */
export const TEMPLATE_ASPECT_RATIO_REGISTRY: Record<string, TemplateAspectRatio> = {
  // 9:16 (Tall portrait / Stories / Vertical Reels)
  "template-social-media-ad": "9:16",
  "template-amber-editorial": "9:16",
  "template-cyberpunk-portrait": "9:16",
  "template-video-slowmo-coffee": "9:16",
  "template-video-fashion-walk": "9:16",

  // 4:5 (E-commerce / Instagram Feed / Editorial Portrait)
  "template-candle-photo": "4:5",
  "template-luxury-product-shoot": "4:5",
  "template-kyoto-ryokan-travel": "4:5",

  // 3:4 (Portfolios / Vertical Architecture / Posters)
  "template-3d-portfolio": "3:4",
  "template-subway-sanctuary": "3:4",
  "template-web-artisan-portfolio": "3:4",
  "template-poster-synthwave": "3:4",

  // 2:3 (Classic Posters / Magazine Covers)
  "template-nomad-luxe": "2:3",
  "template-poster-swiss-festival": "2:3",
  "template-poster-brutalist-art": "2:3",

  // 1:1 (Square format)
  "template-c-la-jewelry": "1:1",
  "template-aura-mind": "1:1",
  "template-luxury-watch": "1:1",
  "template-poster-brand-identity": "1:1",
  "template-soma-breathwork-wellness": "1:1",

  // 4:3 (Standard display / Studio Interior)
  "template-agent-wave": "4:3",
  "template-nordic-interior": "4:3",

  // 3:2 (Classic 35mm landscape photography / Agency showcase)
  "template-monolith-agency": "3:2",

  // 5:4 (Medium landscape display / Fintech card)
  "template-aether-card-fintech": "5:4",

  // 16:9 (Widescreen landscape / SaaS / Presentations / Videos)
  "template-dark-mode-ai-saas": "16:9",
  "template-consentinel": "16:9",
  "template-anchor-ai": "16:9",
  "template-finpulse-global": "16:9",
  "template-vanguard-agency": "16:9",
  "template-alpine-expedition-travel": "16:9",
  "template-solaria-crypto-fintech": "16:9",
  "template-modern-interior-design": "16:9",
  "template-saas-landing-page": "16:9",
  "template-cinematic-product-video": "16:9",
  "template-video-drone-mountains": "16:9",
  "template-video-cyber-city": "16:9",
  "template-web-saas-dark": "16:9",
  "template-slides-seed-pitch": "16:9",
  "template-slides-qbr": "16:9",
  "template-slides-keynote-launch": "16:9",
  "template-slides-vc-series-a": "16:9",
};

/**
 * Determine orientation from aspect ratio string (e.g. "16:9" -> "landscape")
 */
export function getOrientationFromAspectRatio(aspectRatio: string): TemplateOrientation {
  if (aspectRatio === "1:1") return "square";
  if (LANDSCAPE_RATIOS.includes(aspectRatio as TemplateAspectRatio)) return "landscape";
  if (PORTRAIT_RATIOS.includes(aspectRatio as TemplateAspectRatio)) return "portrait";

  const parts = aspectRatio.split(":").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    const [w, h] = parts;
    if (w === h) return "square";
    return w > h ? "landscape" : "portrait";
  }

  return "landscape";
}

/**
 * Returns the effective aspect ratio for a template.
 */
export function getTemplateAspectRatio(template: Template): TemplateAspectRatio {
  if (template.aspectRatio && ALL_ASPECT_RATIOS.includes(template.aspectRatio as TemplateAspectRatio)) {
    return template.aspectRatio as TemplateAspectRatio;
  }

  if (TEMPLATE_ASPECT_RATIO_REGISTRY[template.id]) {
    return TEMPLATE_ASPECT_RATIO_REGISTRY[template.id];
  }

  // Derive by category/subcategory if not explicitly set
  const cat = (template.categoryName || "").toLowerCase();
  const sub = (template.subcategoryName || "").toLowerCase();
  const tags = (template.tags || []).map((t) => t.toLowerCase()).join(" ");

  if (tags.includes("story") || tags.includes("reel") || tags.includes("9:16")) return "9:16";
  if (tags.includes("poster") || sub.includes("poster")) return "2:3";
  if (tags.includes("square") || tags.includes("1:1") || sub.includes("brand")) return "1:1";
  if (cat.includes("image") || sub.includes("product")) return "4:5";
  if (cat.includes("slides") || cat.includes("video") || cat.includes("website") || cat.includes("saas")) {
    return "16:9";
  }

  return "16:9";
}

/**
 * Returns the effective orientation for a template.
 */
export function getTemplateOrientation(template: Template): TemplateOrientation {
  if (template.orientation) return template.orientation;
  const ratio = getTemplateAspectRatio(template);
  return getOrientationFromAspectRatio(ratio);
}

/**
 * Returns CSS aspect-ratio value string (e.g. "16 / 9" or "9 / 16")
 */
export function getAspectRatioCss(aspectRatio: string): string {
  const parts = aspectRatio.split(":");
  if (parts.length === 2) {
    return `${parts[0]} / ${parts[1]}`;
  }
  return "16 / 9";
}

/**
 * Returns numeric aspect ratio (width / height)
 * 16:9 -> 1.777
 * 9:16 -> 0.5625
 * 1:1  -> 1.0
 * 4:5  -> 0.8
 */
export function getAspectRatioNumeric(aspectRatio: string): number {
  const parts = aspectRatio.split(":").map(Number);
  if (parts.length === 2 && parts[1] > 0) {
    return parts[0] / parts[1];
  }
  return 16 / 9;
}

/**
 * Returns relative height multiplier for masonry layout balance
 * (height relative to column width = 1 / numericRatio)
 */
export function getRelativeCardHeight(aspectRatio: string): number {
  const ratio = getAspectRatioNumeric(aspectRatio);
  // Add a small constant for card metadata (title, category) ~0.2
  return 1 / ratio + 0.22;
}

export interface TemplateFilterOptions {
  searchQuery?: string;
  category?: string;
  orientation?: "all" | TemplateOrientation;
  aspectRatio?: "all" | TemplateAspectRatio;
  sortBy?: "recommended" | "popular" | "most-liked" | "most-saved" | "newest" | "recently-updated";
}

// Screenshot showcase priority order from existing AWA
const SHOWCASE_PRIORITY = [
  "template-consentinel",
  "template-anchor-ai",
  "template-3d-portfolio",
  "template-c-la-jewelry",
  "template-amber-editorial",
  "template-agent-wave",
  "template-subway-sanctuary",
  "template-finpulse-global",
  "template-nomad-luxe",
  "template-aura-mind",
  "template-dark-mode-ai-saas",
];

/**
 * Filters and sorts templates according to combined filter parameters.
 */
export function filterAndSortTemplates(
  templates: Template[],
  options: TemplateFilterOptions
): Template[] {
  const {
    searchQuery = "",
    category = "All",
    orientation = "all",
    aspectRatio = "all",
    sortBy = "recommended",
  } = options;

  let result = [...templates];

  // 1. Orientation filter
  if (orientation !== "all") {
    result = result.filter((t) => {
      const tOrientation = getTemplateOrientation(t);
      return tOrientation === orientation;
    });
  }

  // 2. Aspect Ratio filter (exact ratio match)
  if (aspectRatio !== "all") {
    result = result.filter((t) => {
      const tRatio = getTemplateAspectRatio(t);
      return tRatio === aspectRatio;
    });
  }

  // 3. Category Filter
  if (category !== "All") {
    const lowerCategory = category.toLowerCase();
    result = result.filter((t) => {
      if (category === "Image Generation") {
        return (
          t.categoryId === "cat-image-gen" ||
          t.categoryName.toLowerCase().includes("image") ||
          t.tags.some((tag) => tag.toLowerCase().includes("image"))
        );
      }
      if (category === "Video Generation") {
        return (
          t.categoryId === "cat-video-gen" ||
          t.categoryName.toLowerCase().includes("video") ||
          t.tags.some((tag) => tag.toLowerCase().includes("video"))
        );
      }
      if (category === "Website Making" || category === "Website") {
        return (
          t.categoryId === "cat-website-making" ||
          t.categoryId === "cat-web-code" ||
          t.categoryName.toLowerCase().includes("website") ||
          t.tags.some((tag) => tag.toLowerCase().includes("website") || tag.toLowerCase() === "web") ||
          t.description.toLowerCase().includes("website") ||
          t.description.toLowerCase().includes("landing page") ||
          t.categoryName === "Saas" ||
          t.categoryName === "Portfolio"
        );
      }
      if (category === "Slides & Presentations" || category === "Slides") {
        return (
          t.categoryId === "cat-slides-presentations" ||
          t.categoryName.toLowerCase().includes("slide") ||
          t.tags.some((tag) => tag.toLowerCase().includes("slide"))
        );
      }
      if (category === "Poster & Design" || category === "Poster") {
        return (
          t.categoryId === "cat-poster-design" ||
          t.categoryName.toLowerCase().includes("poster") ||
          t.tags.some((tag) => tag.toLowerCase().includes("poster"))
        );
      }

      return (
        t.categoryName.toLowerCase().includes(lowerCategory) ||
        (t.subcategoryName && t.subcategoryName.toLowerCase().includes(lowerCategory)) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lowerCategory)) ||
        t.name.toLowerCase().includes(lowerCategory)
      );
    });
  }

  // 4. Search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        (t.subcategoryName && t.subcategoryName.toLowerCase().includes(q)) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // 5. Sorting
  if (sortBy === "recommended") {
    result.sort((a, b) => {
      const aIndex = SHOWCASE_PRIORITY.indexOf(a.id);
      const bIndex = SHOWCASE_PRIORITY.indexOf(b.id);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return (b.likesCount + b.savesCount) - (a.likesCount + a.savesCount);
    });
  } else if (sortBy === "popular") {
    result.sort((a, b) => (b.likesCount + b.savesCount) - (a.likesCount + a.savesCount));
  } else if (sortBy === "most-liked") {
    result.sort((a, b) => b.likesCount - a.likesCount);
  } else if (sortBy === "most-saved") {
    result.sort((a, b) => b.savesCount - a.savesCount);
  } else if (sortBy === "newest" || sortBy === "recently-updated") {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}

/**
 * Reusable utility alias: getOrientation(template)
 */
export function getOrientation(template: Template): TemplateOrientation {
  return getTemplateOrientation(template);
}

/**
 * Reusable utility alias: calculateAspectRatio(width, height)
 */
export function calculateAspectRatio(width: number, height: number): TemplateAspectRatio {
  if (!width || !height || width === height) return "1:1";
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.1) return "16:9";
  if (Math.abs(ratio - 9 / 16) < 0.1) return "9:16";
  if (Math.abs(ratio - 4 / 3) < 0.1) return "4:3";
  if (Math.abs(ratio - 3 / 4) < 0.1) return "3:4";
  if (Math.abs(ratio - 3 / 2) < 0.1) return "3:2";
  if (Math.abs(ratio - 2 / 3) < 0.1) return "2:3";
  if (Math.abs(ratio - 4 / 5) < 0.1) return "4:5";
  if (Math.abs(ratio - 5 / 4) < 0.1) return "5:4";
  return ratio > 1 ? "16:9" : "9:16";
}

/**
 * Reusable utility alias: parseAspectRatio(aspectRatioStr)
 */
export function parseAspectRatio(aspectRatio: string): { width: number; height: number; numeric: number } {
  const parts = aspectRatio.split(":").map(Number);
  const width = parts[0] || 16;
  const height = parts[1] || 9;
  return { width, height, numeric: width / height };
}


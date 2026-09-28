import { LOCAL_TEMPLATE_IMAGES } from "./local-template-images";

// High-resolution curated demo images for all AWA templates
// Used across Template Cards, Category Views, Search Results, and the Template Detail Page

export interface TemplateSlide {
  id: number;
  label: string;
  url: string;
  type: string;
  caption?: string;
}

// 1. Primary demo image for every template ID
export const TEMPLATE_IMAGE_REGISTRY: Record<string, string> = {
  // Core Disciplines fallbacks
  "template-candle-photo": "/templates/candle-photo.webp",
  "template-luxury-watch": "/templates/luxury-watch.webp",
  "template-cyberpunk-portrait": "/templates/cyberpunk-portrait.webp",
  "template-nordic-interior": "/templates/nordic-interior.webp",
  // Primary local assets take absolute priority
  ...LOCAL_TEMPLATE_IMAGES,
};

// Fallback images by category name
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "Image Generation": "/images/categories/image-gen.jpg",
  "Video Generation": "/images/categories/video-gen.jpg",
  "Website Making": "/images/categories/website-making.jpg",
  "Website": "/images/categories/website-making.jpg",
  "Slides & Presentations": "/images/categories/slides.jpg",
  "Slides": "/images/categories/slides.jpg",
  "Poster & Design": "/images/categories/poster.jpg",
  "Poster": "/images/categories/poster.jpg",
  "Saas": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "Motion": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "Portfolio": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
  "Creative": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
  "Agency": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
  "Ai": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  "Fintech": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  "Travel": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
  "Wellness": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
};

/**
 * Returns the primary demo image URL for a given template.
 */
export function getTemplatePrimaryImage(template: {
  id: string;
  slug?: string;
  imageUrl?: string;
  image?: string;
  categoryName?: string;
}): string {
  if (template.image && template.image.startsWith("/templates/")) {
    return template.image;
  }
  if (template.imageUrl && template.imageUrl.startsWith("/templates/")) {
    return template.imageUrl;
  }
  if (LOCAL_TEMPLATE_IMAGES[template.id]) {
    return LOCAL_TEMPLATE_IMAGES[template.id];
  }
  const cleanId = template.id.startsWith("template-") ? template.id : `template-${template.id}`;
  if (LOCAL_TEMPLATE_IMAGES[cleanId]) {
    return LOCAL_TEMPLATE_IMAGES[cleanId];
  }
  if (template.slug && LOCAL_TEMPLATE_IMAGES[template.slug]) {
    return LOCAL_TEMPLATE_IMAGES[template.slug];
  }
  if (template.image) return template.image;
  if (template.imageUrl) return template.imageUrl;
  if (TEMPLATE_IMAGE_REGISTRY[template.id]) return TEMPLATE_IMAGE_REGISTRY[template.id];
  if (template.slug && TEMPLATE_IMAGE_REGISTRY[template.slug]) return TEMPLATE_IMAGE_REGISTRY[template.slug];
  if (template.categoryName && CATEGORY_FALLBACK_IMAGES[template.categoryName]) {
    return CATEGORY_FALLBACK_IMAGES[template.categoryName];
  }
  return "/templates/luxury-product-shoot.webp";
}

/**
 * Returns multi-angle / multi-slide preview gallery for the template detail page.
 * NOTE: As per requirements, only "slides" (presentations / pitch decks) have multiple slide images.
 * All other templates (image generation, video generation, website, poster, etc.) have only ONE preview image.
 */
export function getTemplateSlides(template: {
  id: string;
  slug?: string;
  name?: string;
  imageUrl?: string;
  categoryName?: string;
  categoryId?: string;
  category?: string;
  tags?: string[];
  galleryImages?: string[];
}): TemplateSlide[] {
  const primary = getTemplatePrimaryImage(template);

  // Determine whether this template belongs to Slides & Presentations
  const cat = (template.categoryName || "").toLowerCase();
  const catId = (template.categoryId || "").toLowerCase();
  const catRaw = (template.category || "").toLowerCase();
  const slug = (template.slug || "").toLowerCase();
  const tagsStr = (template.tags || []).join(" ").toLowerCase();

  const isSlides =
    cat.includes("slide") ||
    cat.includes("presentation") ||
    cat.includes("pitch deck") ||
    catId === "cat-slides-presentations" ||
    catId === "slides-presentations" ||
    catId === "slides" ||
    catId === "presentations" ||
    catRaw.includes("slide") ||
    catRaw.includes("presentation") ||
    slug.includes("slides") ||
    slug.includes("pitch-deck") ||
    slug.includes("deck") ||
    tagsStr.includes("presentation") ||
    tagsStr.includes("slides");

  // Non-slides templates have strictly ONE preview image
  if (!isSlides) {
    return [
      {
        id: 0,
        label: "Preview",
        url: primary,
        type: "hero",
        caption: template.name || "Template Preview",
      },
    ];
  }

  // If slide template has custom gallery images provided
  if (template.galleryImages && template.galleryImages.length > 0) {
    return template.galleryImages.map((url, idx) => ({
      id: idx,
      label: `Slide ${idx + 1}`,
      url,
      type: idx === 0 ? "hero" : "slide",
      caption: `${template.name || "Template"} — Slide ${idx + 1}`,
    }));
  }

  // Slide Deck curated slides for presentation templates
  const slideVariations = [
    primary,
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  ];

  const slideLabels = [
    "Slide 1 — Title Deck",
    "Slide 2 — Problem & Market",
    "Slide 3 — Solution & Product",
    "Slide 4 — Traction & Financials",
  ];

  return slideVariations.map((url, idx) => ({
    id: idx,
    label: slideLabels[idx] || `Slide ${idx + 1}`,
    url,
    type: idx === 0 ? "hero" : "slide",
    caption: `${template.name || "Template"} — ${slideLabels[idx] || `Slide ${idx + 1}`}`,
  }));
}

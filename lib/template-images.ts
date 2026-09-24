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
  // Official AWA Screenshot Featured
  "template-dark-mode-ai-saas": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "template-consentinel": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "template-anchor-ai": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
  "template-3d-portfolio": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "template-c-la-jewelry": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
  "template-amber-editorial": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  "template-agent-wave": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  "template-subway-sanctuary": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  "template-finpulse-global": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  "template-nomad-luxe": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
  "template-aura-mind": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",

  // Agencies & Portfolios
  "template-vanguard-agency": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
  "template-monolith-agency": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",

  // Travel & Architecture
  "template-kyoto-ryokan-travel": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  "template-alpine-expedition-travel": "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",

  // Fintech & Crypto
  "template-solaria-crypto-fintech": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
  "template-aether-card-fintech": "https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=1200&q=80",

  // Wellness
  "template-soma-breathwork-wellness": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",

  // Core Disciplines — Image Generation
  "template-candle-photo": "/images/categories/image-gen.jpg",
  "template-luxury-watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
  "template-cyberpunk-portrait": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
  "template-nordic-interior": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",

  // Core Disciplines — Video Generation
  "template-video-drone-mountains": "/images/categories/video-gen.jpg",
  "template-video-slowmo-coffee": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
  "template-video-fashion-walk": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
  "template-video-cyber-city": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",

  // Core Disciplines — Website Making
  "template-web-saas-dark": "/images/categories/website-making.jpg",
  "template-web-artisan-portfolio": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",

  // Core Disciplines — Slides & Presentations
  "template-slides-seed-pitch": "/images/categories/slides.jpg",
  "template-slides-qbr": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  "template-slides-keynote-launch": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
  "template-slides-vc-series-a": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",

  // Core Disciplines — Poster & Design
  "template-poster-swiss-festival": "/images/categories/poster.jpg",
  "template-poster-brand-identity": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80",
  "template-poster-synthwave": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80",
  "template-poster-brutalist-art": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
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
  categoryName?: string;
}): string {
  if (template.imageUrl) return template.imageUrl;
  if (TEMPLATE_IMAGE_REGISTRY[template.id]) return TEMPLATE_IMAGE_REGISTRY[template.id];
  if (template.slug && TEMPLATE_IMAGE_REGISTRY[template.slug]) return TEMPLATE_IMAGE_REGISTRY[template.slug];
  if (template.categoryName && CATEGORY_FALLBACK_IMAGES[template.categoryName]) {
    return CATEGORY_FALLBACK_IMAGES[template.categoryName];
  }
  return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";
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

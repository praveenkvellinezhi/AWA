// Guideline Benchmark Images registry for user-side step-by-step guides.
// Ensures every step on the interactive workflow canvas displays a relevant,
// high-resolution visual benchmark rather than an empty text box.

export interface GuidelineImageInfo {
  url: string;
  caption: string;
}

const CATEGORY_BENCHMARKS: Record<string, GuidelineImageInfo[]> = {
  image: [
    { url: "/templates/luxury-product-shoot.webp", caption: "Benchmark: Studio Workspace & Lighting Setup" },
    { url: "/templates/candle-photo.webp", caption: "Benchmark: Compositional Subject Framing" },
    { url: "/templates/cyberpunk-portrait.webp", caption: "Benchmark: Prompt Directives & Lighting Key" },
    { url: "/templates/amber-editorial.webp", caption: "Benchmark: Lens Parameters & Focal Depth" },
    { url: "/templates/c-la-jewelry.webp", caption: "Benchmark: 4-Quadrant Candidate Generation" },
    { url: "/templates/luxury-watch.webp", caption: "Benchmark: Texture Fidelity & Surface Reflection" },
    { url: "/templates/modern-interior-design.webp", caption: "Benchmark: Regional Inpainting & Subtle Variation" },
    { url: "/templates/luxury-product-shoot.webp", caption: "Benchmark: Super-Resolution Final Masterpiece" },
  ],
  video: [
    { url: "/templates/video-drone-mountains.webp", caption: "Benchmark: Establishing Scene & Atmospheric Plate" },
    { url: "/templates/cinematic-product-video.webp", caption: "Benchmark: Keyframe Subject & Motion Initialization" },
    { url: "/templates/video-slowmo-coffee.webp", caption: "Benchmark: Camera Panning & Dynamic Motion Path" },
    { url: "/templates/video-fashion-walk.webp", caption: "Benchmark: Temporal Coherence & Tracking" },
    { url: "/templates/video-sunset-to-night.webp", caption: "Benchmark: Lighting Shift & Environmental Ambience" },
    { url: "/templates/video-espresso-pour.webp", caption: "Benchmark: Fluid Mechanics & Physical Simulation" },
    { url: "/templates/video-aurora-fjord.webp", caption: "Benchmark: Speed Ramping & Cinematic Transition" },
    { url: "/templates/video-cyber-city.webp", caption: "Benchmark: High-Bitrate 4K Master Video Export" },
  ],
  website: [
    { url: "/templates/dark-mode-ai-saas.webp", caption: "Benchmark: Architectural Scaffold & Tech Stack" },
    { url: "/templates/saas-landing-page.webp", caption: "Benchmark: Navigation & Structural Page Layout" },
    { url: "/templates/aura-mind.webp", caption: "Benchmark: Hero Section & Modern Typography" },
    { url: "/templates/finpulse-global.webp", caption: "Benchmark: Interactive Feature Grid & Dashboards" },
    { url: "/templates/nomad-luxe.webp", caption: "Benchmark: Reusable UI Component System" },
    { url: "/templates/3d-portfolio.webp", caption: "Benchmark: Responsive Mobile & Tablet Breakpoints" },
    { url: "/templates/web-saas-dark.webp", caption: "Benchmark: State Handling & API Integration" },
    { url: "/templates/web-stitch-fintech.webp", caption: "Benchmark: Production-Ready Live Deployment" },
  ],
  slides: [
    { url: "/templates/agent-wave.webp", caption: "Benchmark: Executive Narrative & Slide Outline" },
    { url: "/templates/consentinel.webp", caption: "Benchmark: Design System & Color Tokens" },
    { url: "/templates/anchor-ai.webp", caption: "Benchmark: Problem & Solution Layout Architecture" },
    { url: "/templates/aether-card-fintech.webp", caption: "Benchmark: Quantitative Data Visualizations" },
    { url: "/templates/slides-seed-pitch.webp", caption: "Benchmark: Interactive Card Breakdown & Typography" },
    { url: "/templates/slides-qbr.webp", caption: "Benchmark: Financial Projections & Unit Economics" },
    { url: "/templates/slides-keynote-launch.webp", caption: "Benchmark: Milestone Roadmap & Product Reveal" },
    { url: "/templates/slides-vc-series-a.webp", caption: "Benchmark: Pitch-Ready Executive Deck Export" },
  ],
  poster: [
    { url: "/templates/poster-swiss-festival.webp", caption: "Benchmark: Grid Alignment & Margin Structure" },
    { url: "/templates/poster-ideogram-typography.webp", caption: "Benchmark: Typographic Hierarchy & Headlines" },
    { url: "/templates/poster-brand-identity.webp", caption: "Benchmark: Hero Graphic Asset Generation" },
    { url: "/templates/poster-synthwave.webp", caption: "Benchmark: Color Grading & Palette Harmony" },
    { url: "/templates/poster-brutalist-art.webp", caption: "Benchmark: Texture Overlays & Fine Grain" },
    { url: "/templates/poster-product-ad.webp", caption: "Benchmark: Compositional Balance & CTAs" },
    { url: "/templates/poster-social-multisize.webp", caption: "Benchmark: Multi-Ratio Aspect Adaptation" },
    { url: "/templates/poster-brand-marketing.webp", caption: "Benchmark: 300 DPI High-Res Print Export" },
  ],
};

export function getStepGuidelineImage(
  category: string | undefined,
  stepIndex: number,
  totalSteps: number = 8,
  templatePrimaryImage?: string,
  templateGalleryImages?: string[]
): GuidelineImageInfo {
  const normCat = (category || "").toLowerCase();

  let catKey = "image";
  if (normCat.includes("video")) catKey = "video";
  else if (normCat.includes("web") || normCat.includes("code")) catKey = "website";
  else if (normCat.includes("slide") || normCat.includes("presentation")) catKey = "slides";
  else if (normCat.includes("poster") || normCat.includes("design")) catKey = "poster";

  const list = CATEGORY_BENCHMARKS[catKey] || CATEGORY_BENCHMARKS.image;

  // Final step always showcases the template's primary output if available
  const isFinalStep = stepIndex >= totalSteps - 1;
  if (isFinalStep && templatePrimaryImage) {
    return {
      url: templatePrimaryImage,
      caption: "Benchmark: Expected Final Output Masterpiece",
    };
  }

  // If template has gallery images, map intermediate steps to gallery frames
  if (templateGalleryImages && templateGalleryImages.length > 1) {
    const galleryIdx = stepIndex % templateGalleryImages.length;
    const galleryUrl = templateGalleryImages[galleryIdx];
    if (galleryUrl) {
      return {
        url: galleryUrl,
        caption: `Benchmark: Iteration Phase ${stepIndex + 1} Reference`,
      };
    }
  }

  // Normalized index in the 8-benchmark list
  const idx = Math.min(stepIndex, list.length - 1);
  return list[idx];
}

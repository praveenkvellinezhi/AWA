import {
  TemplateCategoryKey,
  CategoryOption,
  BuilderBasicInfo,
  ImageBuilderData,
  VideoBuilderData,
  WebsiteBuilderData,
  SlidesBuilderData,
  PosterBuilderData,
  WorkflowStepItem,
} from "./types";
import { getDefaultWorkflowStepsForCategory } from "@/lib/template-workflow";

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    key: "image",
    id: "cat-image-gen",
    name: "Image Generation",
    slug: "image-generation",
    tagline: "Create photorealistic and artistic AI imagery",
    description: "Prompts for Midjourney, FLUX, Stable Diffusion with lighting, lens, mood, and style controls.",
    iconName: "Camera",
    badge: "Visual AI",
    accentColor: "from-amber-500 to-orange-500",
    defaultSubcategory: "sub-img-product",
  },
  {
    key: "video",
    id: "cat-video-gen",
    name: "Video Generation",
    slug: "video-generation",
    tagline: "Generate cinematic AI video sequences",
    description: "Prompts tailored for Runway Gen-3, Kling, Luma, Sora with camera motions and dynamic pacing.",
    iconName: "Film",
    badge: "Motion AI",
    accentColor: "from-purple-500 to-indigo-500",
    defaultSubcategory: "sub-vid-cinematic",
  },
  {
    key: "website",
    id: "cat-website-making",
    name: "Website Generation",
    slug: "website-generation",
    tagline: "Generate production-grade web applications",
    description: "Full-stack UI prompts, component architectures, and system context for v0, Claude, Lovable, Bolt.",
    iconName: "Globe",
    badge: "Full-Stack AI",
    accentColor: "from-blue-500 to-cyan-500",
    defaultSubcategory: "sub-web-saas",
  },
  {
    key: "slides",
    id: "cat-slides-presentations",
    name: "Slides & Presentations",
    slug: "slides-presentations",
    tagline: "Build pitch decks, keynotes and slide decks",
    description: "Multi-slide deck pipelines with individual slide prompts, visual direction, and narrative arc.",
    iconName: "Presentation",
    badge: "Deck AI",
    accentColor: "from-emerald-500 to-teal-500",
    defaultSubcategory: "sub-pres-pitch",
  },
  {
    key: "poster",
    id: "cat-poster-design",
    name: "Posters & Designs",
    slug: "poster-design",
    tagline: "Generate marketing posters and graphic layouts",
    description: "Typographic hierarchies, canvas aspect ratios, headline copy, and brand styling for print & digital.",
    iconName: "Palette",
    badge: "Design AI",
    accentColor: "from-rose-500 to-pink-500",
    defaultSubcategory: "sub-des-posters",
  },
];

export const INITIAL_BASIC_INFO: BuilderBasicInfo = {
  name: "",
  slug: "",
  description: "",
  categoryKey: "image",
  categoryId: "cat-image-gen",
  categoryName: "Image Generation",
  subcategoryId: "sub-img-product",
  subcategoryName: "Product Photography",
  thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  tags: ["AI Art", "Midjourney", "Editorial"],
  rawTags: "AI Art, Midjourney, Editorial",
  author: "AWA Official Team",
  difficulty: "Beginner",
  featured: false,
  popular: true,
  status: "published",
  seoTitle: "",
  seoDescription: "",
  recommendedModel: "Midjourney v6.1",
  assignedToolId: "tool-midjourney",
  assignedToolName: "Midjourney",
  assignedModelId: "mj-v6-1",
  assignedModelName: "Midjourney v6.1",
};

export const INITIAL_IMAGE_DATA: ImageBuilderData = {
  prompt: `A high-end commercial studio product photograph of [SUBJECT], centered on an organic matte podium, styled in [STYLE] aesthetics. Illuminated by soft [LIGHTING] casting diffused delicate shadows, shot on [CAMERA] with shallow depth of field, minimalist composition, [ASPECT_RATIO] aspect ratio --v 6.1 --style raw --q 2`,
  imageType: "Product Photography",
  visualStyle: "Commercial Minimalist",
  aspectRatio: "1:1",
  orientation: "Square",
  lighting: "Soft Diffused Studio Lighting",
  cameraLens: "85mm f/1.4 Portrait Lens",
  mood: "Clean, Premium, Luxurious",
  colorPalette: "Neutral Warm Alabaster & Sand",
  quality: "Ultra-High 8K Studio",
  negativePrompt: "low quality, blur, noise, plastic skin, distorted proportions, watermark, oversaturated",
  referenceImageUrl: "",
  editingInstructions: "Maintain clean background reflections and preserve authentic product material textures.",
  variationInstructions: "Generate variants with subtle shifts in pedestal rotation and golden hour rim light.",
};

export const INITIAL_VIDEO_DATA: VideoBuilderData = {
  prompt: `Cinematic wide-angle tracking shot of [SUBJECT] moving across [SCENE], [ACTION]. Camera executes a [CAMERA_MOVEMENT] with [MOTION_INTENSITY] pace. Natural atmospheric [LIGHTING], photorealistic 8k render, cinematic film grain, [DURATION] sequence.`,
  videoType: "Text-to-Video",
  duration: "5s",
  aspectRatio: "16:9 Landscape",
  cameraMovement: "Smooth Dolly In & Tracking",
  motionIntensity: "Cinematic Flow",
  frameRate: "24 fps Cinematic",
  visualStyle: "Hyper-realistic Cinema",
  audio: "Ambient Cinematic Drone & Subtle Wind",
  dialogue: "",
  startFrameUrl: "",
  endFrameUrl: "",
  referenceImageUrl: "",
  negativePrompt: "jerky motion, morphing distortions, glitch, jittery frame, unnatural limb bending",
};

export const INITIAL_WEBSITE_DATA: WebsiteBuilderData = {
  projectName: "SaaS Next-Gen Platform",
  businessProduct: "Developer-focused AI creation suite",
  targetAudience: "Design engineers, indie hackers, and SaaS founders",
  purpose: "Convert visitors into trial signups with interactive feature demos",
  industry: "B2B SaaS / Developer Tools",
  pages: ["Landing Page", "Pricing", "Features", "Changelog"],
  sections: ["Hero with Floating Badge", "Interactive Feature Matrix", "Social Proof Grid", "Tiered Pricing", "FAQ Accordion", "Sticky Footer CTA"],
  features: ["Dark/Light Mode Toggle", "Interactive Prompt Copy", "Tier Plan Toggle", "Responsive Mobile Drawer"],
  navigation: "Sticky Glassmorphism Header with Blur",
  forms: "Email Waitlist Capture with Validation",
  integrations: "Stripe Checkout & Supabase Database",
  responsiveRequirements: "Mobile-First fluid typography with touch-optimized card carousels",
  uiPrompt: `Build a cutting-edge SaaS landing page with dark mode aesthetics. Feature an ultra-clean glassmorphic navigation header, a high-converting hero section with an animated badge, a sleek live interactive prompt simulator card, a 3-column feature grid with hover glow borders, an interactive pricing matrix with monthly/annual switch, and an expandable FAQ accordion. Use Tailwind CSS with emerald-500 accent colors and Lucide icons.`,
  contextPrompt: `Project context: A developer-first AI creation tool named AWA. 
Key value props: 10x faster prompt discovery, zero-friction copy-paste workflow, and validated model parameters.
Target audience expects fast load times, semantic HTML5, accessible ARIA attributes, and fluid transitions without layout shifts.`,
  framework: "Next.js 14 App Router",
  styling: "TailwindCSS v3",
  database: "Supabase PostgreSQL",
  authentication: "Supabase Auth",
  api: "REST Route Handlers",
  libraries: "Lucide Icons, Radix UI",
  animation: "CSS Transitions & Keyframe Smooth Spring",
};

export const INITIAL_SLIDES_DATA: SlidesBuilderData = {
  presentationTitle: "Seed Pitch Deck: Next-Gen AI Platform",
  topic: "Raising $2.5M Seed Round for AI Workflow Engine",
  audience: "Early-stage venture capital investors and angels",
  objective: "Secure seed investment by demonstrating viral organic traction and clear market moat",
  presentationType: "Startup Pitch Deck",
  tone: "Persuasive, High-Stakes, Visionary & Data-Backed",
  numberOfSlides: 5,
  language: "English (US)",
  presentationContext: `AWA is an intelligent prompt & template ecosystem designed for modern creators. We are raising a $2.5M Seed Round to expand our category coverage from image and video to web apps and enterprise design pipelines. This deck must convince tier-1 seed investors of our proprietary prompt optimization layer and 400% MoM creator retention.`,
  globalPrompt: `Act as a world-class venture partner and pitch deck strategist. Generate a structured 5-slide pitch deck for AWA that follows the Sequoia Capital pitch framework. Maintain concise bullet points (max 3 per slide), high-contrast slide layouts, and strong data-backed narratives.`,
  slides: [
    {
      id: "slide-1",
      slideNumber: 1,
      title: "Cover & Mission",
      purpose: "Hook investors immediately with a definitive category-defining thesis.",
      layout: "Hero Title & Visual",
      prompt: `Generate Slide 1 (Cover Slide) for AWA Seed Pitch Deck.
Headline: "The Intelligent Workflow Engine for Generative AI"
Sub-headline: "Empowering 100K+ creators to build production-grade assets in seconds."
Visual: Dark minimalist background with emerald ambient aura and clean typography.
Include presenter info: Founders, Date: Q3 2026, Confidential.`,
      visualDirection: "Sleek dark mode canvas with deep emerald radial illumination behind central bold typography.",
      contentRequirements: "Single compelling vision statement, company logo placeholder, contact metadata.",
      speakerNotes: "Welcome everyone. Today we are sharing how AWA solves the prompt friction crisis across creative teams.",
    },
    {
      id: "slide-2",
      slideNumber: 2,
      title: "The Problem: Creation Friction",
      purpose: "Demonstrate the deep pain creators face when using raw generative AI models.",
      layout: "Split 2-Column Problem vs Reality",
      prompt: `Generate Slide 2 (The Problem) for AWA Pitch Deck.
Headline: "Generative AI is Powerful, But Inaccessible and Inconsistent."
Column 1: 85% of creator time is wasted on trial-and-error prompt engineering.
Column 2: Zero cross-tool standardization between image, video, code, and deck generation.
Include metric callout: "$4.2B estimated annual developer hours lost in prompt iteration."`,
      visualDirection: "Split layout comparing messy chaotic prompt attempts vs high failure rates with red accent warning badges.",
      contentRequirements: "3 concise pain points, 1 large impact statistic.",
      speakerNotes: "Every creator has experienced spending 4 hours tweaking negative prompts without reliable output.",
    },
    {
      id: "slide-3",
      slideNumber: 3,
      title: "The Solution: AWA Engine",
      purpose: "Present our standardized template & workflow architecture as the definitive answer.",
      layout: "3-Card Value Pillar",
      prompt: `Generate Slide 3 (Solution) for AWA Pitch Deck.
Headline: "One Unified Pipeline for Every Creative Medium."
Card 1 - Curated Battle-Tested Templates: Verified prompt models for Image, Video, Web, and Slides.
Card 2 - Contextual Dynamic Builders: Dynamic category-aware prompt editors that adapt in real time.
Card 3 - 1-Click Production Handoff: Instant parameter export to Midjourney, Runway, and Next.js.`,
      visualDirection: "Three horizontal glass cards with glowing icons (Camera, Film, Code) showcasing end-to-end integration.",
      contentRequirements: "3 pillar cards with high visual contrast and distinct benefit verbs.",
      speakerNotes: "AWA turns hours of guess-work into a repeatable 1-click execution pipeline.",
    },
    {
      id: "slide-4",
      slideNumber: 4,
      title: "Traction & Market Size",
      purpose: "Validate product-market fit with accelerating exponential metrics.",
      layout: "Big Metric & Data Highlight",
      prompt: `Generate Slide 4 (Market & Traction) for AWA Pitch Deck.
Headline: "Hyper-Growth Powered by Organic Creator Word-of-Mouth."
Stat 1: 120,000+ Active Monthly Creators (14% weekly compounding)
Stat 2: $18.4B Total Addressable Market in GenAI Creator Tools
Stat 3: 4.8 / 5 Community Satisfaction Across 50,000 Prompt Runs`,
      visualDirection: "Large prominent emerald typography for metrics with clean upward trend graph visualization.",
      contentRequirements: "3 bold key figures with descriptive sub-labels and market CAGR validation.",
      speakerNotes: "We have grown entirely through organic community sharing with zero paid marketing spend to date.",
    },
    {
      id: "slide-5",
      slideNumber: 5,
      title: "The Ask & Roadmap",
      purpose: "Present the funding target, deployment breakdown, and next milestones.",
      layout: "Timeline & Closing CTA",
      prompt: `Generate Slide 5 (The Ask) for AWA Pitch Deck.
Headline: "Raising $2.5M Seed to Scale the Global Template Network."
Fund Allocation: 55% Core AI Engineering, 25% Community & Creator Fund, 20% Enterprise Security.
18-Month Target: 1M Active Users & $4M ARR run-rate.
Closing: contact@awa.guide | Join the creation revolution.`,
      visualDirection: "Clean timeline diagram showing 3 progressive milestones leading to Series A readiness.",
      contentRequirements: "Funding amount, round terms, capital allocation pie/bar, leadership contact.",
      speakerNotes: "With this $2.5M round, we will reach cash-flow positive unit economics and 1 million creators within 18 months.",
    },
  ],
};

export const INITIAL_POSTER_DATA: PosterBuilderData = {
  designType: "Event Poster",
  canvasSize: "Instagram Portrait (1080x1350)",
  dimensions: "1080 x 1350 px",
  targetAudience: "Creative technologists, designers, and art enthusiasts",
  mainMessage: "Annual Generative Art & Technology Symposium 2026",
  headline: "THE FUTURE OF DIGITAL FORM",
  supportingText: "A 3-day immersive conference exploring algorithmic design, neural graphics, and synthetic media.",
  cta: "Register at awa.guide/conference • Oct 14-16",
  brandInformation: "Logo in top right corner. Swiss modern grid with 32px safe margins.",
  visualStyle: "Swiss Modern Minimal with Chromatic Holographic Accents",
  colorPalette: "Deep Obsidian Black, Electric Cobalt (#2563EB), Neon Mint (#10B981)",
  typography: "Display Headline: Neue Haas Grotesk Bold 96pt. Body: Inter Medium 16pt.",
  imageDirection: "Central abstract 3D metallic fluid knot floating over a dark grid field.",
  prompt: `Design a museum-grade typographic event poster for [HEADLINE]. 
Layout: Modern Swiss grid system with structured margins and bold vertical typography.
Main Headline: "[HEADLINE]" set in massive condensed sans-serif with high contrast.
Central visual: 3D generative fluid sculpture with iridescent metallic reflections.
Color scheme: High contrast dark background with electric neon accents.
Supporting text: "[SUPPORTING_TEXT]" and prominent call-to-action "[CTA]".`,
};

export function getDefaultWorkflowSteps(categoryKey: TemplateCategoryKey): WorkflowStepItem[] {
  return getDefaultWorkflowStepsForCategory(categoryKey) as WorkflowStepItem[];
}

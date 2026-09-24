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
  switch (categoryKey) {
    case "image":
      return [
        {
          id: "step-1",
          stepNumber: 1,
          title: "Define Concept & Subject",
          description: "Establish the core subject matter, focal composition, and narrative context.",
          prompt: `Create a comprehensive visual concept for [SUBJECT] situated in [ENVIRONMENT]. Emphasize silhouette clarity, focal hierarchy, and unique design accents.`,
          inputVariables: ["[SUBJECT]", "[ENVIRONMENT]"],
          output: "Detailed concept breakdown with defined subject placement and background elements.",
          example: "Minimalist stainless steel water bottle resting on a volcanic basalt rock.",
        },
        {
          id: "step-2",
          stepNumber: 2,
          title: "Build Image Prompt with Technical Modifiers",
          description: "Assemble the master AI prompt incorporating lens focal length, lighting, and camera angle.",
          prompt: `[SUBJECT] in [ENVIRONMENT], styled with [STYLE] aesthetics, illuminated by [LIGHTING], captured on [CAMERA] lens, [ASPECT_RATIO] composition --v 6.1 --style raw`,
          inputVariables: ["[SUBJECT]", "[ENVIRONMENT]", "[STYLE]", "[LIGHTING]", "[CAMERA]", "[ASPECT_RATIO]"],
          output: "Complete single-string generation prompt ready for Midjourney / FLUX.",
          example: "A studio product photograph of a ceramic espresso cup, soft directional lighting...",
        },
        {
          id: "step-3",
          stepNumber: 3,
          title: "Define Visual Direction & Palette",
          description: "Tune color harmonies, saturation levels, and atmospheric mood.",
          prompt: `Refine color palette to [COLOR_PALETTE] with subtle highlights. Ensure skin tones and product textures maintain natural hyper-detailed realism without artificial plastic sheen.`,
          inputVariables: ["[COLOR_PALETTE]"],
          output: "Lighting and material balance directives for secondary generation passes.",
          example: "Monochromatic slate grey with subtle warm brass accents.",
        },
        {
          id: "step-4",
          stepNumber: 4,
          title: "Generate Image & Evaluate Seeds",
          description: "Run high-resolution rendering and select the strongest composition seed.",
          prompt: `Generate 4 initial variations using seed exploration. Filter for sharpest focal sharpness and authentic physical lighting interactions.`,
          inputVariables: [],
          output: "Set of 4 high-resolution candidate images.",
          example: "Midjourney Grid output with 4 candidate render seeds.",
        },
        {
          id: "step-5",
          stepNumber: 5,
          title: "Refine & Upscale Result",
          description: "Perform subtle inpainting and high-fidelity upscaling for commercial distribution.",
          prompt: `Upscale selected seed with subtle detail enhancement. Inpaint any minor edge artifacts and export in uncompressed 4K resolution.`,
          inputVariables: [],
          output: "Final print-ready 4K high-resolution commercial asset.",
          example: "3840 x 3840 uncompressed PNG asset.",
        },
      ];

    case "video":
      return [
        {
          id: "step-1",
          stepNumber: 1,
          title: "Define Scene & Narrative Beat",
          description: "Establish the environmental setting, time of day, and emotional tone.",
          prompt: `Establish the scene: [SCENE] during golden hour. Atmospheric haze with soft dust particles catching the low-angle sunlight.`,
          inputVariables: ["[SCENE]"],
          output: "Scene context definition with lighting and environmental atmosphere.",
          example: "A futuristic alpine research lab overlooking a misty glacier.",
        },
        {
          id: "step-2",
          stepNumber: 2,
          title: "Define Subject & Continuous Action",
          description: "Specify physical movements, character direction, and natural pacing.",
          prompt: `[SUBJECT] performs [ACTION] smoothly across the frame without abrupt turns. Realistic weight physics and cloth simulation.`,
          inputVariables: ["[SUBJECT]", "[ACTION]"],
          output: "Subject movement specification for AI video motion model.",
          example: "An astronaut slowly opens the pressurized airlock door.",
        },
        {
          id: "step-3",
          stepNumber: 3,
          title: "Define Camera Movement & Lens",
          description: "Direct camera translation, focal length changes, and dynamic tracking.",
          prompt: `Camera executes a steady [CAMERA_MOVEMENT] at eye level, tracking the subject while maintaining continuous depth of field.`,
          inputVariables: ["[CAMERA_MOVEMENT]"],
          output: "Cinematic camera path instruction for Runway Gen-3 / Luma Dream Machine.",
          example: "Smooth forward dolly with slow 15-degree clockwise rotation.",
        },
        {
          id: "step-4",
          stepNumber: 4,
          title: "Tune Motion Intensity & Frame Rate",
          description: "Balance motion velocity to prevent warping and unwanted frame distortions.",
          prompt: `Motion parameter: [MOTION_INTENSITY]. Frame rate: [FRAME_RATE]. Prevent background flickering and maintain rigid geometry consistency.`,
          inputVariables: ["[MOTION_INTENSITY]", "[FRAME_RATE]"],
          output: "Motion slider configuration parameters.",
          example: "Motion level 4 out of 10 for cinematic realism.",
        },
        {
          id: "step-5",
          stepNumber: 5,
          title: "Generate Video Sequence",
          description: "Execute generation prompt and produce initial 5-10 second clip.",
          prompt: `Cinematic wide shot: [SUBJECT] in [SCENE], [ACTION], [CAMERA_MOVEMENT], [DURATION] duration, photorealistic 8k render.`,
          inputVariables: ["[SUBJECT]", "[SCENE]", "[ACTION]", "[CAMERA_MOVEMENT]", "[DURATION]"],
          output: "Generated MP4 video clip.",
          example: "5-second 1080p 24fps motion video.",
        },
        {
          id: "step-6",
          stepNumber: 6,
          title: "Refine & Frame Interpolation",
          description: "Apply motion smoothing, color grading, and upscale to 4K resolution.",
          prompt: `Apply optical flow interpolation for ultra-smooth 60fps playback. Grade colors to match cinematic film emulation curves.`,
          inputVariables: [],
          output: "Production-ready video export with synchronized audio.",
          example: "4K 60fps master render.",
        },
      ];

    case "website":
      return [
        {
          id: "step-1",
          stepNumber: 1,
          title: "Project Context & Requirements",
          description: "Define the application goals, primary user persona, and business conversion objectives.",
          prompt: `Project: [PROJECT_NAME] for [BUSINESS_PRODUCT].
Target Audience: [TARGET_AUDIENCE].
Primary Objective: [PURPOSE].
Define the key user journeys, essential page hierarchy, and required functional capabilities.`,
          inputVariables: ["[PROJECT_NAME]", "[BUSINESS_PRODUCT]", "[TARGET_AUDIENCE]", "[PURPOSE]"],
          output: "Structured product specification with feature roadmap.",
          example: "SaaS landing page with auth, pricing, and interactive playground.",
        },
        {
          id: "step-2",
          stepNumber: 2,
          title: "Website Architecture & Sections",
          description: "Layout the navigational hierarchy and page section breakdown.",
          prompt: `Construct the website wireframe architecture including: Hero Section, Live Interactive Showcase, 3-Tier Value Proposition, Interactive Pricing Table, Customer Testimonial Carousel, and Sticky Bottom Call to Action.`,
          inputVariables: [],
          output: "Section breakdown with component tree hierarchy.",
          example: "Header -> Hero -> FeaturesGrid -> PricingMatrix -> FAQ -> Footer.",
        },
        {
          id: "step-3",
          stepNumber: 3,
          title: "UI Prompt: Design System & Styling",
          description: "Craft the visual aesthetics, glassmorphism effects, typography, and responsive grid.",
          prompt: `[UI PROMPT]
Build a responsive Next.js landing page with Tailwind CSS. Incorporate dark mode slate-950 surfaces, emerald-500 accent gradients, backdrop blur cards, and fluid grid layouts. All buttons must feature subtle hover transitions and active press feedback.`,
          inputVariables: [],
          output: "Tailwind CSS utility tokens and component layout rules.",
          example: "Complete UI aesthetic prompt for v0 or Lovable.",
        },
        {
          id: "step-4",
          stepNumber: 4,
          title: "Context Prompt: Functional Logic & State",
          description: "Specify interactive handlers, form validations, and data structures.",
          prompt: `[CONTEXT PROMPT]
Implement client-side state for theme toggling, interactive pricing frequency switcher (Monthly vs Annual with 20% discount badge), and email newsletter subscription with instant validation feedback.`,
          inputVariables: [],
          output: "React state management and form handler specifications.",
          example: "TypeScript interfaces and React hooks configuration.",
        },
        {
          id: "step-5",
          stepNumber: 5,
          title: "Component Implementation & Integration",
          description: "Assemble reusable components with Lucide icons and accessible HTML markup.",
          prompt: `Generate clean modular components: Navbar.tsx, HeroSection.tsx, PricingCard.tsx, and FaqAccordion.tsx. Use semantic HTML5 landmarks and accessible ARIA attributes.`,
          inputVariables: [],
          output: "Modular TSX components ready for Next.js 14 App Router.",
          example: "React component code files.",
        },
        {
          id: "step-6",
          stepNumber: 6,
          title: "Responsive Polish & Performance",
          description: "Verify mobile hamburger menus, touch targets, and fast lighthouse scores.",
          prompt: `Ensure 100% mobile responsiveness across iPhone and iPad viewports. Eliminate horizontal overflow and optimize image loading with Next.js next/image.`,
          inputVariables: [],
          output: "Fluid responsive application with 95+ PageSpeed score.",
          example: "Responsive layout adjustments.",
        },
        {
          id: "step-7",
          stepNumber: 7,
          title: "Deployment & Production Export",
          description: "Prepare build scripts and deploy to Vercel or Netlify.",
          prompt: `Configure next.config.mjs, verify clean TypeScript compilation with zero lint errors, and prepare one-click Vercel deployment bundle.`,
          inputVariables: [],
          output: "Live deployed production URL and GitHub repository.",
          example: "Production release commit.",
        },
      ];

    case "slides":
      return [
        {
          id: "step-1",
          stepNumber: 1,
          title: "Presentation Strategy & Objective",
          description: "Define the presentation thesis, audience incentives, and key narrative payoff.",
          prompt: `Analyze the core presentation goal: [OBJECTIVE] for [AUDIENCE]. Determine the 3 indispensable takeaways that must stick with the decision-makers after 10 minutes.`,
          inputVariables: ["[OBJECTIVE]", "[AUDIENCE]"],
          output: "Strategic narrative outline and audience expectation checklist.",
          example: "High-conviction investor memo outlining market timing and defensibility.",
        },
        {
          id: "step-2",
          stepNumber: 2,
          title: "Deck Architecture & Slide Count",
          description: "Structure the slide-by-slide sequence using proven storytelling models.",
          prompt: `Build a sequential [NUMBER_OF_SLIDES]-slide narrative arc: 
1. The Unignorable Shift
2. The Urgent Problem
3. The Scalable Solution
4. The Market Validation
5. The Investment Ask and Forward Milestones.`,
          inputVariables: ["[NUMBER_OF_SLIDES]"],
          output: "Slide index with title, target duration, and purpose per slide.",
          example: "5-slide pitch deck structure.",
        },
        {
          id: "step-3",
          stepNumber: 3,
          title: "Slide-by-Slide Content Generation",
          description: "Generate copy, bullet points, and data metrics for each individual slide.",
          prompt: `Write punchy, high-impact slide copy for each slide. Limit body content to maximum 3 bullets per slide. Lead every slide with an active conclusion verb rather than a passive category title.`,
          inputVariables: [],
          output: "Draft content cards for all deck slides.",
          example: "Complete slide text formatted for presentation slides.",
        },
        {
          id: "step-4",
          stepNumber: 4,
          title: "Visual Direction & Layout Styling",
          description: "Establish slide typography, background ambiance, and visual element placement.",
          prompt: `Design visual rules: Modern dark mode presentation with emerald brand accents. High typographic contrast between 48pt headers and 18pt body text. Incorporate clean glassmorphic container cards for data metrics.`,
          inputVariables: [],
          output: "Slide design guidelines and color palette rules.",
          example: "Slide theme styling specification.",
        },
        {
          id: "step-5",
          stepNumber: 5,
          title: "Data Visualization & Metrics Review",
          description: "Structure metric highlights and growth charts for instant comprehension.",
          prompt: `Format all financial numbers and traction metrics into bold single-stat cards with clear percentage growth indicators. Ensure total clarity within 3 seconds of viewing.`,
          inputVariables: [],
          output: "Data highlight cards and metric callout designs.",
          example: "120K MAU, $18.4B TAM callouts.",
        },
        {
          id: "step-6",
          stepNumber: 6,
          title: "Speaker Notes & Rehearsal Script",
          description: "Generate natural conversational talking points for each slide.",
          prompt: `Draft conversational 45-second speaker notes for every slide. Include smooth verbal transitions connecting Slide N to Slide N+1.`,
          inputVariables: [],
          output: "Complete teleprompter / speaker notes script.",
          example: "Presenter script for pitch delivery.",
        },
      ];

    case "poster":
      return [
        {
          id: "step-1",
          stepNumber: 1,
          title: "Define Design Concept & Impact",
          description: "Establish the visual metaphor, emotional resonance, and poster theme.",
          prompt: `Establish the central visual concept for [HEADLINE]. Create a high-energy juxtaposition between [VISUAL_STYLE] and modern typographic layout.`,
          inputVariables: ["[HEADLINE]", "[VISUAL_STYLE]"],
          output: "Design concept brief with key visual elements.",
          example: "Futuristic digital art symposium poster.",
        },
        {
          id: "step-2",
          stepNumber: 2,
          title: "Define Content & Text Hierarchy",
          description: "Structure primary headline, subheadline, dates, location, and call to action.",
          prompt: `Structure poster typography hierarchy:
1. Primary Headline: "[HEADLINE]" (dominant scale)
2. Subheading: "[SUPPORTING_TEXT]"
3. Action details: "[CTA]"
4. Metadata: Date, venue, sponsor logos.`,
          inputVariables: ["[HEADLINE]", "[SUPPORTING_TEXT]", "[CTA]"],
          output: "Ranked typographic hierarchy breakdown.",
          example: "Headline -> Subhead -> Date -> Ticket link.",
        },
        {
          id: "step-3",
          stepNumber: 3,
          title: "Define Canvas & Compositional Grid",
          description: "Set aspect ratio, margins, column grid, and focal anchor points.",
          prompt: `Set canvas to [CANVAS_SIZE] ([DIMENSIONS]). Implement a 12-column Swiss grid with 40px outer safe margins. Anchor the headline in the upper third.`,
          inputVariables: ["[CANVAS_SIZE]", "[DIMENSIONS]"],
          output: "Grid structure and bounding box blueprint.",
          example: "1080x1350px vertical grid with 40px margins.",
        },
        {
          id: "step-4",
          stepNumber: 4,
          title: "Define Visual Direction & Color Palette",
          description: "Select harmonious colors, contrast ratios, and textures.",
          prompt: `Apply color palette: [COLOR_PALETTE]. Utilize high-contrast values to guarantee readability from 10 feet away. Add subtle paper grain or chrome metallic finish.`,
          inputVariables: ["[COLOR_PALETTE]"],
          output: "Color and texture specification.",
          example: "Deep black background with electric cyan and mint accents.",
        },
        {
          id: "step-5",
          stepNumber: 5,
          title: "Generate Design Asset",
          description: "Render the full graphic design composition using generative AI prompt.",
          prompt: `[DESIGN PROMPT]
Full layout graphic poster for [HEADLINE]. Striking typography, Swiss grid alignment, [COLOR_PALETTE] color palette, [VISUAL_STYLE] aesthetics, 8k resolution graphic design.`,
          inputVariables: ["[HEADLINE]", "[COLOR_PALETTE]", "[VISUAL_STYLE]"],
          output: "Rendered high-resolution graphic design file.",
          example: "Print-ready high-resolution poster artwork.",
        },
        {
          id: "step-6",
          stepNumber: 6,
          title: "Refine Typography & Export Formats",
          description: "Sharpen vector text, verify bleed margins, and export for digital and print.",
          prompt: `Inspect typographic alignment and contrast compliance. Export multi-format variants for Instagram Story (9:16), Square Post (1:1), and Vector PDF Print.`,
          inputVariables: [],
          output: "Packaged multi-format design bundle.",
          example: "Web PNG + Print PDF package.",
        },
      ];
  }
}

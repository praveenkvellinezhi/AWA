// AI Tool brand logos and icon registry with self-contained crisp SVGs
// Guaranteed 100% offline, zero external latency, zero CORS or adblocker failure.

function toSvgUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export interface ToolPreset {
  name: string;
  vendor: string;
  category: "Image" | "Video" | "Code / Web" | "Design / Slides" | "Poster & Design";
  defaultModel: string;
  externalUrl: string;
  logoUrl: string;
  description: string;
}

export const AI_TOOL_LOGOS: Record<string, string> = {
  midjourney: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#0A0B0E" rx="0"/>
      <path d="M22 75 L38 28 L50 55 L62 28 L78 75 Z" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="50" cy="38" r="5" fill="#38BDF8"/>
    </svg>
  `),

  runway: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#0F172A" rx="0"/>
      <path d="M25 75 L25 25 L45 25 C62 25 68 35 68 45 C68 55 58 63 45 63 L25 63 M45 63 L75 75" fill="none" stroke="#A855F7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),

  sora: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#000000" rx="0"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#10B981" stroke-width="7"/>
      <circle cx="50" cy="50" r="14" fill="#10B981"/>
      <line x1="18" y1="50" x2="82" y2="50" stroke="#10B981" stroke-width="4"/>
    </svg>
  `),

  pika: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#18181B" rx="0"/>
      <polygon points="32,22 78,50 32,78" fill="#F43F5E"/>
      <circle cx="42" cy="50" r="8" fill="#FFFFFF"/>
    </svg>
  `),

  kling: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#1E1B4B" rx="0"/>
      <path d="M26 24 L26 76 M74 24 L42 50 L74 76" fill="none" stroke="#818CF8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),

  luma: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#030712" rx="0"/>
      <circle cx="50" cy="50" r="28" fill="none" stroke="#F59E0B" stroke-width="8"/>
      <path d="M50 22 A 28 28 0 0 1 78 50" fill="none" stroke="#EC4899" stroke-width="8"/>
    </svg>
  `),

  flux: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#171717" rx="0"/>
      <rect x="25" y="25" width="22" height="22" fill="#F97316"/>
      <rect x="53" y="25" width="22" height="22" fill="#FBBF24"/>
      <rect x="25" y="53" width="22" height="22" fill="#FB923C"/>
      <rect x="53" y="53" width="22" height="22" fill="#EA580C"/>
    </svg>
  `),

  sdxl: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#1E293B" rx="0"/>
      <path d="M30 65 C 20 40, 50 20, 68 36 C 85 52, 60 78, 42 70" fill="none" stroke="#E2E8F0" stroke-width="7" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="7" fill="#6366F1"/>
    </svg>
  `),

  v0: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#000000" rx="0"/>
      <text x="50" y="64" font-family="monospace, sans-serif" font-size="38" font-weight="900" fill="#FFFFFF" text-anchor="middle">v0</text>
    </svg>
  `),

  lovable: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#FFF1F2" rx="0"/>
      <path d="M50 78 C25 60 16 42 22 28 C28 16 42 18 50 30 C58 18 72 16 78 28 C84 42 75 60 50 78 Z" fill="#E11D48"/>
    </svg>
  `),

  bolt: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#18181B" rx="0"/>
      <polygon points="56,18 26,54 48,54 44,82 74,46 52,46" fill="#FBBF24"/>
    </svg>
  `),

  stitch: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#202124" rx="0"/>
      <path d="M30 30 L70 70 M70 30 L30 70" stroke="#4285F4" stroke-width="8" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="10" fill="#EA4335"/>
    </svg>
  `),

  framer: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#000000" rx="0"/>
      <path d="M26 22 L74 22 L50 48 L74 48 L26 78 L26 48 L50 48 Z" fill="#0055FF"/>
    </svg>
  `),

  cursor: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#09090B" rx="0"/>
      <path d="M30 22 L72 48 L48 54 L38 78 Z" fill="#22C55E"/>
    </svg>
  `),

  antigravity: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#0B132B" rx="0"/>
      <circle cx="50" cy="50" r="28" fill="none" stroke="#38BDF8" stroke-width="6"/>
      <circle cx="50" cy="22" r="6" fill="#38BDF8"/>
      <path d="M50 35 L50 65 M38 48 L50 35 L62 48" fill="none" stroke="#F43F5E" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),

  replit: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#0E1525" rx="0"/>
      <path d="M26 26 L54 26 L54 44 L26 44 Z M54 44 L82 44 L82 62 L54 62 Z M26 62 L54 62 L54 80 L26 80 Z" fill="#F26207"/>
    </svg>
  `),

  webflow: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#146EF5" rx="0"/>
      <text x="50" y="65" font-family="sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" text-anchor="middle">W</text>
    </svg>
  `),

  wix: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#111111" rx="0"/>
      <text x="50" y="64" font-family="sans-serif" font-size="34" font-weight="900" fill="#FBBF24" text-anchor="middle">WIX</text>
    </svg>
  `),

  claude: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#FAF5F0" rx="0"/>
      <path d="M50 20 L58 40 L80 42 L64 56 L68 78 L50 66 L32 78 L36 56 L20 42 L42 40 Z" fill="#D97706"/>
    </svg>
  `),

  gamma: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#2E1065" rx="0"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="#C084FC" stroke-width="8"/>
      <path d="M50 24 L50 50 L68 68" fill="none" stroke="#F472B6" stroke-width="7" stroke-linecap="round"/>
    </svg>
  `),

  canva: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#00C4CC" rx="0"/>
      <text x="50" y="66" font-family="'Brush Script MT', cursive, sans-serif" font-size="44" font-weight="bold" fill="#FFFFFF" text-anchor="middle">C</text>
    </svg>
  `),

  beautifulai: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#0F172A" rx="0"/>
      <polygon points="50,22 80,78 20,78" fill="none" stroke="#38BDF8" stroke-width="8"/>
      <circle cx="50" cy="60" r="6" fill="#F43F5E"/>
    </svg>
  `),

  copilot: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#0F172A" rx="0"/>
      <path d="M28 45 C 28 30, 45 24, 60 30 C 72 35, 74 48, 70 58 C 66 68, 50 74, 38 72" fill="none" stroke="#2563EB" stroke-width="8" stroke-linecap="round"/>
      <circle cx="45" cy="48" r="6" fill="#38BDF8"/>
    </svg>
  `),

  gemini: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#1E293B" rx="0"/>
      <path d="M50 18 C50 35, 65 50, 82 50 C65 50, 50 65, 50 82 C50 65, 35 50, 18 50 C35 50, 50 35, 50 18 Z" fill="#60A5FA"/>
    </svg>
  `),

  tome: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#18181B" rx="0"/>
      <rect x="28" y="24" width="44" height="52" rx="4" fill="none" stroke="#E4E4E7" stroke-width="6"/>
      <line x1="38" y1="40" x2="62" y2="40" stroke="#F43F5E" stroke-width="4"/>
      <line x1="38" y1="52" x2="56" y2="52" stroke="#A1A1AA" stroke-width="4"/>
    </svg>
  `),

  pitch: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#000000" rx="0"/>
      <polygon points="30,22 74,50 30,78" fill="#F43F5E"/>
    </svg>
  `),

  adobe: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#FA0F00" rx="0"/>
      <polygon points="38,26 22,74 46,74" fill="#FFFFFF"/>
      <polygon points="62,26 78,74 54,74" fill="#FFFFFF"/>
      <polygon points="50,46 59,74 41,74" fill="#FFFFFF"/>
    </svg>
  `),

  ideogram: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#18181B" rx="0"/>
      <circle cx="50" cy="50" r="28" fill="none" stroke="#F59E0B" stroke-width="8"/>
      <line x1="50" y1="30" x2="50" y2="70" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `),

  kittl: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#27272A" rx="0"/>
      <text x="50" y="65" font-family="serif" font-size="44" font-weight="900" fill="#EAB308" text-anchor="middle">K</text>
    </svg>
  `),

  figma: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#1E1E1E" rx="0"/>
      <path d="M38 22 C46 22 50 26 50 31 L50 49 L38 49 C30 49 26 45 26 38 C26 30 30 22 38 22 Z" fill="#F24E1E"/>
      <path d="M50 22 L62 22 C70 22 74 30 74 38 C74 45 70 49 62 49 L50 49 Z" fill="#FF7262"/>
      <path d="M50 49 L62 49 C70 49 74 53 74 61 C74 69 70 73 62 73 C54 73 50 69 50 61 Z" fill="#1ABCFE"/>
      <path d="M38 49 C46 49 50 53 50 61 C50 69 46 73 38 73 C30 73 26 69 26 61 C26 53 30 49 38 49 Z" fill="#A259FF"/>
      <path d="M38 73 C46 73 50 77 50 82 C50 87 46 91 38 91 C30 91 26 87 26 82 C26 77 30 73 38 73 Z" fill="#0ACF83"/>
    </svg>
  `),
};

export const AI_TOOL_PRESETS: ToolPreset[] = [
  {
    name: "Midjourney",
    vendor: "Midjourney Inc.",
    category: "Image",
    defaultModel: "Midjourney v6.1",
    externalUrl: "https://midjourney.com",
    logoUrl: AI_TOOL_LOGOS.midjourney,
    description: "Industry-leading image generation with unmatched lighting nuance, photorealism, and artistic aesthetic.",
  },
  {
    name: "Runway",
    vendor: "Runway AI, Inc.",
    category: "Video",
    defaultModel: "Runway Gen-3 Alpha Turbo",
    externalUrl: "https://runwayml.com",
    logoUrl: AI_TOOL_LOGOS.runway,
    description: "Pioneering generative video system with advanced motion brush, camera control, and multi-second coherence.",
  },
  {
    name: "OpenAI Sora",
    vendor: "OpenAI",
    category: "Video",
    defaultModel: "Sora 1.0",
    externalUrl: "https://openai.com/sora",
    logoUrl: AI_TOOL_LOGOS.sora,
    description: "High-fidelity video generation capable of complex physical simulation and photorealistic motion.",
  },
  {
    name: "Pika",
    vendor: "Pika Labs",
    category: "Video",
    defaultModel: "Pika 1.5",
    externalUrl: "https://pika.art",
    logoUrl: AI_TOOL_LOGOS.pika,
    description: "Dynamic video tool with intuitive physics effects, camera pans, and speed ramps.",
  },
  {
    name: "Kling AI",
    vendor: "Kuaishou Technology",
    category: "Video",
    defaultModel: "Kling 1.5 Pro",
    externalUrl: "https://klingai.com",
    logoUrl: AI_TOOL_LOGOS.kling,
    description: "Advanced cinematic video generator with physics simulation and natural camera motions.",
  },
  {
    name: "Luma Dream Machine",
    vendor: "Luma AI",
    category: "Video",
    defaultModel: "Dream Machine 1.5",
    externalUrl: "https://lumalabs.ai/dream-machine",
    logoUrl: AI_TOOL_LOGOS.luma,
    description: "High-speed camera path and scene motion video generation engine.",
  },
  {
    name: "Flux.1",
    vendor: "Black Forest Labs",
    category: "Image",
    defaultModel: "FLUX.1 [dev]",
    externalUrl: "https://blackforestlabs.ai",
    logoUrl: AI_TOOL_LOGOS.flux,
    description: "Open-weight state-of-the-art image generator with crisp typography rendering and anatomical precision.",
  },
  {
    name: "Stable Diffusion",
    vendor: "Stability AI",
    category: "Image",
    defaultModel: "SDXL 1.0",
    externalUrl: "https://stability.ai",
    logoUrl: AI_TOOL_LOGOS.sdxl,
    description: "Highly customizable open model with deep ControlNet ecosystem and LoRA fine-tuning flexibility.",
  },
  {
    name: "v0 by Vercel",
    vendor: "Vercel",
    category: "Code / Web",
    defaultModel: "v0 React / Tailwind",
    externalUrl: "https://v0.dev",
    logoUrl: AI_TOOL_LOGOS.v0,
    description: "Generative UI system producing production-ready React, Tailwind CSS, and shadcn/ui components.",
  },
  {
    name: "Lovable",
    vendor: "Lovable",
    category: "Code / Web",
    defaultModel: "Lovable Fullstack",
    externalUrl: "https://lovable.dev",
    logoUrl: AI_TOOL_LOGOS.lovable,
    description: "Full-stack AI web app builder with instant Supabase backend, live previews, and one-click deployment.",
  },
  {
    name: "Bolt.new",
    vendor: "StackBlitz",
    category: "Code / Web",
    defaultModel: "Bolt WebContainer 2.0",
    externalUrl: "https://bolt.new",
    logoUrl: AI_TOOL_LOGOS.bolt,
    description: "In-browser WebContainer development environment capable of full-stack Node/Vite app scaffolding.",
  },
  {
    name: "Google Stitch",
    vendor: "Google",
    category: "Code / Web",
    defaultModel: "Stitch Screen Generator",
    externalUrl: "https://stitch.withgoogle.com",
    logoUrl: AI_TOOL_LOGOS.stitch,
    description: "AI-assisted design-to-code and screen synthesis tool for creating coherent design system tokens and screens.",
  },
  {
    name: "Framer AI",
    vendor: "Framer B.V.",
    category: "Code / Web",
    defaultModel: "Framer AI 2.0",
    externalUrl: "https://framer.com",
    logoUrl: AI_TOOL_LOGOS.framer,
    description: "Visual web design generator that produces responsive, animated websites ready to publish with one click.",
  },
  {
    name: "Cursor",
    vendor: "Anysphere",
    category: "Code / Web",
    defaultModel: "Claude 3.7 Sonnet",
    externalUrl: "https://cursor.com",
    logoUrl: AI_TOOL_LOGOS.cursor,
    description: "AI-first code editor with Composer multi-file generation, terminal execution, and deep codebase indexing.",
  },
  {
    name: "Antigravity",
    vendor: "Google DeepMind",
    category: "Code / Web",
    defaultModel: "Antigravity 2.0 Agent",
    externalUrl: "https://antigravity.google",
    logoUrl: AI_TOOL_LOGOS.antigravity,
    description: "Agentic AI coding assistant with autonomous planning, multi-file code editing, and dev server verification.",
  },
  {
    name: "Replit Agent",
    vendor: "Replit",
    category: "Code / Web",
    defaultModel: "Replit Agent v1.0",
    externalUrl: "https://replit.com",
    logoUrl: AI_TOOL_LOGOS.replit,
    description: "Autonomous software development agent that builds, tests, and deploys full-stack web applications.",
  },
  {
    name: "Webflow AI",
    vendor: "Webflow",
    category: "Code / Web",
    defaultModel: "Webflow Site Generator",
    externalUrl: "https://webflow.com",
    logoUrl: AI_TOOL_LOGOS.webflow,
    description: "Visual web development platform with AI-generated layouts, CMS collections, and enterprise hosting.",
  },
  {
    name: "Claude",
    vendor: "Anthropic",
    category: "Code / Web",
    defaultModel: "Claude 3.7 Sonnet",
    externalUrl: "https://claude.ai",
    logoUrl: AI_TOOL_LOGOS.claude,
    description: "State-of-the-art reasoning model for architectural planning, clean React code generation, and debugging.",
  },
  {
    name: "Gamma",
    vendor: "Gamma App",
    category: "Design / Slides",
    defaultModel: "Gamma Presentation AI",
    externalUrl: "https://gamma.app",
    logoUrl: AI_TOOL_LOGOS.gamma,
    description: "AI-powered presentation creator that generates formatted cards, visual layouts, and pitch decks.",
  },
  {
    name: "Canva Magic Studio",
    vendor: "Canva",
    category: "Design / Slides",
    defaultModel: "Magic Design 2026",
    externalUrl: "https://canva.com",
    logoUrl: AI_TOOL_LOGOS.canva,
    description: "Accessible design suite with AI layout generation for marketing banners, posters, and social graphics.",
  },
  {
    name: "Figma AI",
    vendor: "Figma",
    category: "Poster & Design",
    defaultModel: "Figma AI First Draft",
    externalUrl: "https://figma.com",
    logoUrl: AI_TOOL_LOGOS.figma,
    description: "Collaborative design environment with AI first drafts, auto-layout scaffolding, and production design system tokens.",
  },
  {
    name: "Ideogram",
    vendor: "Ideogram AI",
    category: "Poster & Design",
    defaultModel: "Ideogram 2.0",
    externalUrl: "https://ideogram.ai",
    logoUrl: AI_TOOL_LOGOS.ideogram,
    description: "State-of-the-art AI design engine renowned for reliable typographic spelling, typography style tags, and poster aesthetics.",
  },
  {
    name: "Kittl",
    vendor: "Kittl",
    category: "Poster & Design",
    defaultModel: "Kittl AI Design Engine",
    externalUrl: "https://www.kittl.com",
    logoUrl: AI_TOOL_LOGOS.kittl,
    description: "Intuitive graphic design platform with AI layout generation, advanced vector text warping, and vintage/modern textures.",
  },
  {
    name: "Adobe Firefly",
    vendor: "Adobe",
    category: "Poster & Design",
    defaultModel: "Firefly Image 3",
    externalUrl: "https://firefly.adobe.com",
    logoUrl: AI_TOOL_LOGOS.adobe,
    description: "Commercially safe generative AI engine specialized in text effects, generative match, and high-fidelity poster composition.",
  },
];

export function getToolLogo(toolName: string, category?: string): string {
  const norm = (toolName || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const [key, logo] of Object.entries(AI_TOOL_LOGOS)) {
    if (norm.includes(key)) return logo;
  }

  // Fallback category SVGs
  const cat = (category || "").toLowerCase();
  if (cat.includes("video")) return AI_TOOL_LOGOS.runway;
  if (cat.includes("image")) return AI_TOOL_LOGOS.midjourney;
  if (cat.includes("code") || cat.includes("web")) return AI_TOOL_LOGOS.cursor;
  if (cat.includes("slide") || cat.includes("presentation")) return AI_TOOL_LOGOS.gamma;
  if (cat.includes("poster") || cat.includes("design")) return AI_TOOL_LOGOS.figma;

  return toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#334155" rx="0"/>
      <text x="50" y="62" font-family="sans-serif" font-size="36" font-weight="900" fill="#F8FAFC" text-anchor="middle">AI</text>
    </svg>
  `);
}

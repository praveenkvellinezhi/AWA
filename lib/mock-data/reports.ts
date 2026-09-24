// Mock data and analytical models for AWA Platform Reports & Analytics

export interface TemplatePerformanceData {
  id: string;
  name: string;
  category: string;
  primaryTool: string;
  views: number;
  promptCopies: number;
  inspections: number;
  unlocks: number;
  conversionRate: number; // percentage
  satisfactionScore: number; // percentage
  status: "trending" | "stable" | "needs-attention";
}

export interface ModelAdoptionData {
  toolId: string;
  toolName: string;
  modelName: string;
  category: string;
  assignedTemplatesCount: number;
  marketShare: number; // percentage
  compatibilityScore: number; // percentage
  userRating: number; // 0 - 5
  status: "recommended" | "active" | "legacy";
  websiteUrl: string;
}

export interface GuideStepFunnelData {
  stepNumber: number;
  title: string;
  avgCompletionRate: number; // percentage
  dropOffRate: number; // percentage
  avgTimeSpentSec: number;
  commonFrictionPoint?: string;
}

export interface CategorySatisfactionData {
  categoryName: string;
  thumbsUp: number;
  thumbsDown: number;
  satisfactionRate: number; // percentage
  totalReviews: number;
}

// 1. Template Performance Data
export const mockTemplatePerformance: TemplatePerformanceData[] = [
  {
    id: "template-candle-photo",
    name: "Handmade Candle Product Photography",
    category: "Image Generation",
    primaryTool: "Midjourney v6.1",
    views: 18450,
    promptCopies: 6240,
    inspections: 3910,
    unlocks: 1420,
    conversionRate: 22.7,
    satisfactionScore: 97.4,
    status: "trending",
  },
  {
    id: "template-web-saas-dark",
    name: "Dark Mode AI SaaS Landing Page",
    category: "Website Making",
    primaryTool: "v0 Generative UI",
    views: 16200,
    promptCopies: 5890,
    inspections: 4100,
    unlocks: 1180,
    conversionRate: 20.0,
    satisfactionScore: 96.1,
    status: "trending",
  },
  {
    id: "template-video-drone-mountains",
    name: "Cinematic Misty Mountain Drone Sweep",
    category: "Video Generation",
    primaryTool: "Runway Gen-3",
    views: 14100,
    promptCopies: 4920,
    inspections: 3250,
    unlocks: 980,
    conversionRate: 19.9,
    satisfactionScore: 94.8,
    status: "trending",
  },
  {
    id: "template-cyberpunk-portrait",
    name: "Cyberpunk Neon Rain Portrait",
    category: "Image Generation",
    primaryTool: "Flux.1 Pro",
    views: 12800,
    promptCopies: 4310,
    inspections: 2890,
    unlocks: 820,
    conversionRate: 19.0,
    satisfactionScore: 95.2,
    status: "stable",
  },
  {
    id: "template-slides-seed-pitch",
    name: "Minimalist YC Seed Pitch Deck",
    category: "Slides & Presentations",
    primaryTool: "Gamma App",
    views: 9400,
    promptCopies: 3120,
    inspections: 1940,
    unlocks: 650,
    conversionRate: 20.8,
    satisfactionScore: 93.9,
    status: "stable",
  },
  {
    id: "template-poster-swiss-festival",
    name: "Swiss International Style Typography Poster",
    category: "Poster & Design",
    primaryTool: "Midjourney v6.1",
    views: 8900,
    promptCopies: 2840,
    inspections: 1720,
    unlocks: 510,
    conversionRate: 17.9,
    satisfactionScore: 96.5,
    status: "stable",
  },
  {
    id: "template-nordic-interior",
    name: "Nordic Minimalist Living Room Interior",
    category: "Image Generation",
    primaryTool: "Midjourney v6.1",
    views: 7400,
    promptCopies: 2180,
    inspections: 1410,
    unlocks: 390,
    conversionRate: 17.8,
    satisfactionScore: 92.1,
    status: "stable",
  },
  {
    id: "template-video-slowmo-coffee",
    name: "Slow Motion Espresso Extraction",
    category: "Video Generation",
    primaryTool: "Luma Dream Machine",
    views: 5200,
    promptCopies: 1420,
    inspections: 980,
    unlocks: 210,
    conversionRate: 14.7,
    satisfactionScore: 88.4,
    status: "needs-attention",
  },
  {
    id: "template-slides-qbr",
    name: "Quarterly Executive Business Review Deck",
    category: "Slides & Presentations",
    primaryTool: "Gamma App",
    views: 4800,
    promptCopies: 1190,
    inspections: 820,
    unlocks: 180,
    conversionRate: 15.1,
    satisfactionScore: 89.2,
    status: "needs-attention",
  },
];

// 2. AI Model Adoption Data
export const mockModelAdoption: ModelAdoptionData[] = [
  {
    toolId: "tool-midjourney",
    toolName: "Midjourney",
    modelName: "Midjourney v6.1",
    category: "Image Generation",
    assignedTemplatesCount: 22,
    marketShare: 38.5,
    compatibilityScore: 98.4,
    userRating: 4.9,
    status: "recommended",
    websiteUrl: "https://midjourney.com",
  },
  {
    toolId: "tool-runway",
    toolName: "Runway",
    modelName: "Runway Gen-3 Alpha",
    category: "Video Generation",
    assignedTemplatesCount: 14,
    marketShare: 24.2,
    compatibilityScore: 95.8,
    userRating: 4.8,
    status: "recommended",
    websiteUrl: "https://runwayml.com",
  },
  {
    toolId: "tool-flux",
    toolName: "Flux.1",
    modelName: "Flux.1 Pro",
    category: "Image Generation",
    assignedTemplatesCount: 10,
    marketShare: 16.8,
    compatibilityScore: 96.2,
    userRating: 4.8,
    status: "recommended",
    websiteUrl: "https://blackforestlabs.ai",
  },
  {
    toolId: "tool-sora",
    toolName: "OpenAI Sora",
    modelName: "Sora Video Engine",
    category: "Video Generation",
    assignedTemplatesCount: 6,
    marketShare: 10.4,
    compatibilityScore: 94.0,
    userRating: 4.7,
    status: "active",
    websiteUrl: "https://openai.com/sora",
  },
  {
    toolId: "tool-v0",
    toolName: "v0 by Vercel",
    modelName: "v0 Generative UI",
    category: "Website Making",
    assignedTemplatesCount: 8,
    marketShare: 13.6,
    compatibilityScore: 97.1,
    userRating: 4.9,
    status: "recommended",
    websiteUrl: "https://v0.dev",
  },
  {
    toolId: "tool-gamma",
    toolName: "Gamma App",
    modelName: "Gamma Presentation AI",
    category: "Slides & Presentations",
    assignedTemplatesCount: 6,
    marketShare: 9.8,
    compatibilityScore: 93.5,
    userRating: 4.6,
    status: "active",
    websiteUrl: "https://gamma.app",
  },
  {
    toolId: "tool-claude",
    toolName: "Anthropic Claude",
    modelName: "Claude 3.7 Sonnet",
    category: "Website Making",
    assignedTemplatesCount: 7,
    marketShare: 11.2,
    compatibilityScore: 98.9,
    userRating: 4.9,
    status: "recommended",
    websiteUrl: "https://claude.ai",
  },
];

// 3. Workflow Step Completion Funnel (8-Step Guide)
export const mockGuideFunnel: GuideStepFunnelData[] = [
  {
    stepNumber: 1,
    title: "Access Prompt Command / Copy Directive",
    avgCompletionRate: 98.4,
    dropOffRate: 1.6,
    avgTimeSpentSec: 24,
  },
  {
    stepNumber: 2,
    title: "Launch AI Tool & Open Canvas",
    avgCompletionRate: 92.1,
    dropOffRate: 6.3,
    avgTimeSpentSec: 42,
  },
  {
    stepNumber: 3,
    title: "Paste Raw Prompt Verbatim",
    avgCompletionRate: 86.8,
    dropOffRate: 5.3,
    avgTimeSpentSec: 36,
  },
  {
    stepNumber: 4,
    title: "Apply Aspect Ratio & Core Flags",
    avgCompletionRate: 81.2,
    dropOffRate: 5.6,
    avgTimeSpentSec: 58,
    commonFrictionPoint: "User parameter typos in --ar or --stylize flags",
  },
  {
    stepNumber: 5,
    title: "Inspect First Output & Benchmark",
    avgCompletionRate: 75.4,
    dropOffRate: 5.8,
    avgTimeSpentSec: 64,
  },
  {
    stepNumber: 6,
    title: "Lighting & Texture Variation Refinement",
    avgCompletionRate: 71.0,
    dropOffRate: 4.4,
    avgTimeSpentSec: 78,
  },
  {
    stepNumber: 7,
    title: "Execute HD Upscale / Resolution Boost",
    avgCompletionRate: 66.8,
    dropOffRate: 4.2,
    avgTimeSpentSec: 52,
  },
  {
    stepNumber: 8,
    title: "Export & Production Deployment",
    avgCompletionRate: 63.5,
    dropOffRate: 3.3,
    avgTimeSpentSec: 45,
  },
];

// 4. Category Satisfaction Data
export const mockCategorySatisfaction: CategorySatisfactionData[] = [
  {
    categoryName: "Image Generation",
    thumbsUp: 428,
    thumbsDown: 14,
    satisfactionRate: 96.8,
    totalReviews: 442,
  },
  {
    categoryName: "Video Generation",
    thumbsUp: 265,
    thumbsDown: 18,
    satisfactionRate: 93.6,
    totalReviews: 283,
  },
  {
    categoryName: "Website Making",
    thumbsUp: 212,
    thumbsDown: 10,
    satisfactionRate: 95.5,
    totalReviews: 222,
  },
  {
    categoryName: "Slides & Presentations",
    thumbsUp: 142,
    thumbsDown: 9,
    satisfactionRate: 94.0,
    totalReviews: 151,
  },
  {
    categoryName: "Poster & Design",
    thumbsUp: 98,
    thumbsDown: 4,
    satisfactionRate: 96.1,
    totalReviews: 102,
  },
];

// 5. Recent User Feedback Log
export interface UserReviewLog {
  id: string;
  templateName: string;
  category: string;
  userName: string;
  userRole: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  helpfulCount: number;
}

export const mockUserReviewLogs: UserReviewLog[] = [
  {
    id: "rev-1",
    templateName: "Handmade Candle Product Photography",
    category: "Image Generation",
    userName: "Elena Vance",
    userRole: "Product Designer",
    rating: 5,
    comment: "The lighting directives in this prompt matched our e-commerce brand aesthetics on the very first generation. Massive time saver!",
    date: "Today at 10:24 AM",
    helpfulCount: 18,
  },
  {
    id: "rev-2",
    templateName: "Dark Mode AI SaaS Landing Page",
    category: "Website Making",
    userName: "Marcus Thorne",
    userRole: "Founding Engineer",
    rating: 5,
    comment: "Pasted into v0 and had a complete responsive React + Tailwind hero and pricing table running in 3 minutes.",
    date: "Yesterday",
    helpfulCount: 24,
  },
  {
    id: "rev-3",
    templateName: "Cinematic Misty Mountain Drone Sweep",
    category: "Video Generation",
    userName: "Sophia Lin",
    userRole: "Creative Director",
    rating: 5,
    comment: "Runway Gen-3 camera movement was silky smooth. The speed bracket setting in step 4 was crucial.",
    date: "2 days ago",
    helpfulCount: 12,
  },
  {
    id: "rev-4",
    templateName: "Minimalist YC Seed Pitch Deck",
    category: "Slides & Presentations",
    userName: "David Kim",
    userRole: "Startup Founder",
    rating: 4,
    comment: "Great slide structure. Would love if step 3 had a dedicated note on market sizing slide layout.",
    date: "3 days ago",
    helpfulCount: 9,
  },
  {
    id: "rev-5",
    templateName: "Slow Motion Espresso Extraction",
    category: "Video Generation",
    userName: "Lucas Rossi",
    userRole: "Content Creator",
    rating: 4,
    comment: "Good results with Luma. Had to adjust the motion intensity flag slightly to prevent liquid artifacts.",
    date: "5 days ago",
    helpfulCount: 7,
  },
];

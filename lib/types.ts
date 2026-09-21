export type UserRole = "public" | "authenticated" | "subscriber" | "admin";

export type SubscriptionPlan = "yearly" | "lifetime" | null;

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  deviceLimit: number;
  activeDevicesCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  parentId?: string | null;
  templateCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string; // Lucide icon name
  accentColor: string;
  templateCount: number;
  subcategories: Subcategory[];
  imageUrl?: string;
}

export interface RecommendedTool {
  toolId: string;
  toolName: string;
  modelName: string;
  reason: string;
  badge?: string;
}

export interface UsageStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  description: string;
  promptText: string; // Subscriber-only in UI!
  safePreviewText?: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  style: string;
  mood: string;
  recommendedTools: RecommendedTool[];
  usageSteps: UsageStep[];
  videoUrl?: string;
  thumbnailGradient: string;
  imageUrl?: string;
  galleryImages?: string[];
  likesCount: number;
  savesCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface AIToolModel {
  id: string;
  name: string;
  isDefault?: boolean;
}

export interface AITool {
  id: string;
  name: string;
  vendor: string;
  description: string;
  category: string; // e.g. "Image", "Video", "Code / Web", "Design / Slides"
  models: AIToolModel[];
  isRetired: boolean;
  externalUrl?: string;
}

export interface FeedbackEntry {
  id: string;
  templateId: string;
  templateName: string;
  userId: string;
  userEmail: string;
  rating: "up" | "down";
  comment?: string;
  toolUsed?: string;
  promptType: "base" | "customized";
  customizationRequestText?: string;
  createdAt: string;
}

export interface CustomizationVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  requestText: string;
  resultPrompt: string;
  createdAt: string;
}

export interface CreditPack {
  id: string;
  credits: number;
  priceInr: number;
  label: string;
  popular?: boolean;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
  completeness: number; // 0 - 100%
}

export interface AdminConfig {
  voiceCustomizationEnabled: boolean;
  monthlySpendCap: number; // in USD
  currentMonthlySpend: number; // in USD
  freeCreditsAllotment: number;
  creditPacks: CreditPack[];
  nonSubscriberVisibility: "hard_lock" | "safe_preview";
  standingSystemInstruction: string;
  categoryCustomizationOverrides: Record<string, boolean>; // categoryId -> boolean
  razorpayConfig: {
    enabled: boolean;
    keyId: string;
    webhookUrl: string;
    mode: "test" | "live";
  };
  stripeConfig: {
    enabled: boolean;
    publishableKey: string;
    webhookUrl: string;
    mode: "test" | "live";
  };
  supportedLanguages: SupportedLanguage[];
}

export interface CustomizationInsight {
  templateId: string;
  templateName: string;
  categoryName: string;
  totalCustomizations: number;
  recurringPatterns: {
    patternText: string;
    count: number;
    actionSuggestion: string;
  }[];
}

export interface AnimatedBackground {
  id: string;
  title: string;
  category: string;
  gradientClass: string;
  codeSnippet: string;
  previewType: "gradient" | "canvas" | "mesh";
}


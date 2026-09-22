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
  asset?: VideoAsset | WebsiteAsset | PresentationAsset | DesignAsset;
  examplePrompt?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export type VideoGenerationType =
  | "text-to-video"
  | "image-to-video"
  | "multiple-images"
  | "image-text-to-video"
  | "start-end-frame"
  | "reference-image-to-video"
  | "character-reference"
  | "product-image-to-video"
  | "video-to-video"
  | "multiple-references";

export type VideoAssetType =
  | "none"
  | "single-image"
  | "multiple-images"
  | "reference-image"
  | "start-frame"
  | "end-frame"
  | "character-reference"
  | "product-image"
  | "source-video"
  | "multiple-references";

export interface VideoAsset {
  id: string;
  type: VideoAssetType;
  label: string;
  description?: string;
  url?: string;
  previewUrl?: string;
  required: boolean;
  role?: string;
  dimensions?: string;
}

export interface VideoWorkflowConfig {
  generationType: VideoGenerationType;
  assets?: VideoAsset[];
  motionPrompt?: string;
  settings?: {
    aspectRatio?: string;
    durationSeconds?: number | string;
    motionIntensity?: number | string;
    resolution?: string;
    cameraMovement?: string;
    fps?: number;
  };
}

export type WebsiteGenerationType =
  | "prompt-to-website"
  | "prompt-to-landing-page"
  | "prompt-to-web-app"
  | "screenshot-to-website"
  | "image-to-website"
  | "figma-to-website"
  | "existing-website-redesign"
  | "existing-code-modification"
  | "multi-page-website"
  | "functional-web-app";

export type WebsiteAssetType =
  | "none"
  | "screenshot"
  | "multiple-screenshots"
  | "figma-design"
  | "logo"
  | "product-images"
  | "reference-images"
  | "brand-assets"
  | "existing-code"
  | "existing-website";

export interface WebsiteAsset {
  id: string;
  type: WebsiteAssetType;
  label: string;
  description?: string;
  url?: string;
  previewUrl?: string;
  required: boolean;
  role?: string;
  dimensions?: string;
}

export interface WebsiteWorkflowConfig {
  tool?: string;
  generationType: WebsiteGenerationType;
  assets?: WebsiteAsset[];
  projectType?: string;
  techStack?: string[];
  pages?: string[];
  features?: string[];
  prompt?: string;
  steps?: UsageStep[];
  requiresCodeExport?: boolean;
  requiresDeployment?: boolean;
  targetAudience?: string;
}

export type PresentationGenerationType =
  | "prompt-to-presentation"
  | "topic-to-presentation"
  | "outline-to-slides"
  | "document-to-presentation"
  | "pdf-to-presentation"
  | "data-to-presentation"
  | "reference-to-presentation"
  | "template-to-presentation"
  | "existing-presentation-redesign"
  | "image-to-slides"
  | "branded-presentation";

export type PresentationAssetType =
  | "none"
  | "document"
  | "pdf"
  | "existing-presentation"
  | "reference-presentation"
  | "slide-screenshot"
  | "multiple-slide-screenshots"
  | "logo"
  | "brand-assets"
  | "product-images"
  | "data-file"
  | "template";

export interface PresentationAsset {
  id: string;
  type: PresentationAssetType;
  label: string;
  description?: string;
  url?: string;
  previewUrl?: string;
  required: boolean;
  role?: string;
  fileFormat?: string;
  format?: string;
}

export interface PresentationWorkflowConfig {
  tool?: string;
  generationType: PresentationGenerationType;
  presentationType?: string;
  assets?: PresentationAsset[];
  slideCount?: number;
  prompt?: string;
  topic?: string;
  outline?: string[];
  slideOutline?: string[];
  theme?: string;
  brandAssets?:
    | boolean
    | {
        logo?: string;
        colors?: string[];
        fonts?: string[];
        guidelines?: string;
      };
  hasDataVerification?: boolean;
  requiresDataVerification?: boolean;
  requiresSpeakerNotes?: boolean;
  requiresAnimations?: boolean;
  steps?: UsageStep[];
  exportFormats?: string[];
  supportedExportFormats?: string[];
}

export type DesignGenerationType =
  | "prompt-to-poster"
  | "prompt-to-social-post"
  | "prompt-to-banner"
  | "prompt-to-flyer"
  | "prompt-to-ad"
  | "product-to-poster"
  | "image-to-design"
  | "reference-to-design"
  | "screenshot-to-design"
  | "template-to-design"
  | "existing-design-redesign"
  | "brand-design"
  | "multi-format-design";

export type DesignAssetType =
  | "none"
  | "single-image"
  | "multiple-images"
  | "product-image"
  | "logo"
  | "brand-assets"
  | "reference-design"
  | "screenshot"
  | "template"
  | "ai-generated-image"
  | "existing-design";

export interface DesignAsset {
  id: string;
  type: DesignAssetType;
  label: string;
  description?: string;
  url?: string;
  previewUrl?: string;
  required: boolean;
  role?: string;
  dimensions?: string;
  format?: string;
  fileFormat?: string;
}

export interface DesignDimensions {
  width?: number | string;
  height?: number | string;
  unit?: string;
  aspectRatio?: string;
  platform?: string;
  safeArea?: string;
}

export interface DesignWorkflowConfig {
  tool?: string;
  generationType: DesignGenerationType;
  designType?: string;
  assets?: DesignAsset[];
  format?: string;
  dimensions?: DesignDimensions;
  prompt?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  brandAssets?:
    | boolean
    | {
        logo?: string;
        colors?: string[];
        fonts?: string[];
        guidelines?: string;
      };
  requiresTextVerification?: boolean;
  requiresProductAccuracyCheck?: boolean;
  requiresBrandCheck?: boolean;
  requiresMultiFormatResize?: boolean;
  multiFormats?: string[];
  supportedExportFormats?: string[];
  steps?: UsageStep[];
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
  promptText?: string; // Subscriber-only in UI! (Maintained for backward compatibility)
  uiPrompt?: string; // Visual UI, layout, styling, components, colors, typography, responsiveness
  contextPrompt?: string; // Project context, business requirements, target users, features, technical context
  safePreviewText?: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  style: string;
  mood: string;
  recommendedTools: RecommendedTool[];
  usageSteps?: UsageStep[];
  videoUrl?: string;
  videoWorkflow?: VideoWorkflowConfig;
  websiteWorkflow?: WebsiteWorkflowConfig;
  presentationWorkflow?: PresentationWorkflowConfig;
  designWorkflow?: DesignWorkflowConfig;
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


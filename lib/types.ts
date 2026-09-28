export type UserRole = "public" | "authenticated" | "subscriber" | "admin";

export type SubscriptionPlan = "monthly" | "yearly" | "lifetime" | null;

export type PlanStatus = "active" | "inactive" | "draft";
export type BillingPeriod = "monthly" | "lifetime" | "yearly" | "quarterly" | "custom";

export interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  value?: string; // e.g. "100 / month", "Unlimited", "Included", "5 Seats", "10 GB"
  enabled: boolean;
}

export interface CountryPricing {
  id: string;
  country: string; // e.g. "India", "UAE", "Saudi Arabia"
  countryCode: string; // e.g. "IN", "AE", "SA"
  currency: string; // e.g. "INR", "AED", "SAR"
  currencySymbol: string; // e.g. "₹", "AED ", "SAR "
  price: number;
  discountedPrice?: number;
  tax?: string; // e.g. "18% GST Included", "5% VAT Included"
  billingPeriod?: BillingPeriod;
  status: "active" | "inactive";
}

export interface SubscriptionPlanItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge?: string; // e.g. "Most Popular", "Enterprise", "Save 20%"
  billingPeriod: BillingPeriod;
  status: PlanStatus;
  features: PlanFeature[];
  countryPricing: CountryPricing[];
  subscribersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  defaultTax?: string;
  region: "gcc" | "asia" | "americas" | "europe" | "other";
}

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

export interface TemplateVariable {
  name: string;
  description?: string;
  defaultValue?: string;
}

export interface TemplateStepImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface TemplateStepExample {
  input?: string;
  output?: string;
}

/**
 * CANONICAL SINGLE SOURCE OF TRUTH STEP MODEL
 * Used identically across Admin Template Builder, Guide Creation,
 * Workflow Canvas, Template Preview, and User Template Detail Page.
 */
export interface TemplateStep {
  id: string;
  order: number;

  title: string;
  shortTitle?: string;

  description?: string;

  prompt?: string;

  purpose?: string;

  instructions?: string[];

  variables?: TemplateVariable[];

  image?: TemplateStepImage;

  example?: TemplateStepExample | string;

  tips?: string[];

  metadata?: Record<string, unknown>;

  // Backward compatibility aliases
  stepNumber: number;
  step?: number;
  instruction?: string;
  tip?: string;
  imageUrl?: string;
  imageCaption?: string;
  videoUrl?: string;
  mediaType?: "image" | "video";
  promptCategory?: string;
  promptVariables?: { name: string; description?: string; defaultValue?: string }[];
  slideNumber?: number;
  slideTitle?: string;
  visualDirection?: string;
  layout?: string;
  output?: string;
  notes?: string;
  asset?: VideoAsset | WebsiteAsset | PresentationAsset | DesignAsset;
  examplePrompt?: string;
  aiWorkflow?: StepAiWorkflowConfig;
  [key: string]: any;
}

export interface TemplateWorkflow {
  steps: TemplateStep[];
  layout?: string;
  config?: Record<string, unknown>;
}

export interface UsageStep {
  stepNumber: number;
  title: string;
  instruction?: string;
  tip?: string;
  asset?: VideoAsset | WebsiteAsset | PresentationAsset | DesignAsset;
  examplePrompt?: string;
  prompt?: string;
  promptCategory?: string;
  promptVariables?: { name: string; description?: string; defaultValue?: string }[];
  slideNumber?: number;
  slideTitle?: string;
  imageUrl?: string;
  imageCaption?: string;
  aiWorkflow?: StepAiWorkflowConfig;
  [key: string]: any;
}

export interface GuideStep {
  id: string;
  step: number;
  title: string;
  description: string;
  tip?: string;
  image?: string;
  imageCaption?: string;
  videoUrl?: string;
  mediaType?: "image" | "video";
  prompt?: string;
  promptCategory?: string;
  promptVariables?: { name: string; description?: string; defaultValue?: string }[];
  slideNumber?: number;
  slideTitle?: string;
  aiWorkflow?: StepAiWorkflowConfig;
  [key: string]: any;
}

// ============================================================================
// DYNAMIC AI WORKFLOW SPECIFICATIONS
// ============================================================================
export type StepGenerationType = "normal" | "image" | "video";

export type VideoGenerationMethod =
  | "text-to-video"
  | "image-to-video"
  | "reference-image-to-video"
  | "multiple-images-to-video"
  | "video-to-video"
  | "text-image-to-video"
  | "text-reference-images-to-video";

export type ImageGenerationMethod =
  | "text-to-image"
  | "image-to-image"
  | "reference-image-to-image"
  | "multiple-reference-images"
  | "text-reference-image";

export type AssetSourceType =
  | "upload"
  | "previous-step"
  | "specific-step"
  | "library"
  | "user-provided";

export type ReferencePurpose =
  | "character"
  | "environment"
  | "style"
  | "product"
  | "composition"
  | "pose"
  | "color"
  | "lighting"
  | "other";

export type ImageUsageType =
  | "starting-frame"
  | "ending-frame"
  | "character-reference"
  | "scene-reference"
  | "composition-reference"
  | "source-video"
  | "style-reference"
  | "other";

export interface StepReferenceImage {
  id: string;
  url?: string;
  label?: string;
  purpose: ReferencePurpose | string;
  instruction: string;
}

export interface StepStoryboardImage {
  id: string;
  url?: string;
  order: number;
  label?: string;
  purpose: string;
  durationSeconds?: string | number;
  transitionInstruction?: string;
  motionInstruction?: string;
}

export interface StepInputAsset {
  sourceType: AssetSourceType;
  sourceStepId?: string;
  sourceStepNumber?: number;
  sourceStepTitle?: string;
  assetName?: string;
  url?: string;
  usage?: ImageUsageType | string;
  notes?: string;
}

export interface StepMotionInstructions {
  cameraMovement?: string;
  subjectMovement?: string;
  objectMovement?: string;
  environmentalMovement?: string;
}

export interface StepSettings {
  duration?: string;
  aspectRatio?: string;
  resolution?: string;
  cameraMovement?: string;
  motionStrength?: string;
  style?: string;
  transformationStrength?: string;
  quality?: string;
}

export interface StepOutputConfig {
  type: "image" | "video";
  format: "PNG" | "JPG" | "WEBP" | "MP4" | "GIF";
  name: string;
  usage: string;
  nextStepId?: string;
  nextStepNumber?: number;
  nextStepTitle?: string;
}

export interface StepAiWorkflowConfig {
  generationType: StepGenerationType;
  videoMethod?: VideoGenerationMethod;
  imageMethod?: ImageGenerationMethod;
  aiTool?: string;
  prompt?: string;
  negativePrompt?: string;
  transformationInstructions?: string;
  inputAsset?: StepInputAsset;
  styleReferenceImage?: {
    url?: string;
    description?: string;
  };
  referenceImages?: StepReferenceImage[];
  storyboardImages?: StepStoryboardImage[];
  motion?: StepMotionInstructions;
  settings?: StepSettings;
  generationInstructions?: string[];
  output?: StepOutputConfig;
  expectedOutput?: string;
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

export interface SlidePrompt {
  slideNumber: number;
  title: string;
  purpose?: string;
  prompt: string;
  visualDirection?: string;
  layout?: string;
}

export interface PresentationWorkflowPrompts {
  strategy?: string;
  structure?: string;
  slidePlanning?: string;
  contentGeneration?: string;
  visualDirection?: string;
  slideGeneration?: string;
  dataVisualization?: string;
  consistency?: string;
  finalReview?: string;
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
  prompts?: PresentationWorkflowPrompts;
  slides?: SlidePrompt[];
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
  workflow?: TemplateWorkflow;
  usageSteps?: UsageStep[];
  videoUrl?: string;
  videoWorkflow?: VideoWorkflowConfig;
  websiteWorkflow?: WebsiteWorkflowConfig;
  presentationWorkflow?: PresentationWorkflowConfig;
  designWorkflow?: DesignWorkflowConfig;
  thumbnailGradient: string;
  imageUrl?: string;
  galleryImages?: string[];
  presentationPrompts?: PresentationWorkflowPrompts;
  slidePrompts?: SlidePrompt[];
  likesCount: number;
  savesCount: number;
  aspectRatio?: string;
  orientation?: "landscape" | "portrait" | "square";
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

/* ==========================================================================
   SUPPORT & CONTACT MANAGEMENT (SECTION 32)
   ========================================================================== */

export type SupportStatus = "open" | "pending" | "in-progress" | "resolved" | "closed";

export type SupportPriority = "low" | "medium" | "high" | "urgent";

export type SupportCategory =
  | "General"
  | "Technical"
  | "Account"
  | "Billing"
  | "Subscription"
  | "AI Generation"
  | "Template / Guide"
  | "Bug Report"
  | "Feature Request"
  | "Other";

export interface SupportAttachment {
  id: string;
  name: string;
  url: string;
  type: string; // e.g. "image/png", "application/pdf"
  sizeFormatted?: string;
  sizeBytes?: number;
}

export interface SupportMessage {
  id: string;
  sender: string;
  senderType: "user" | "admin" | "system";
  message: string;
  attachments?: SupportAttachment[];
  createdAt: string;
}

export interface SupportInternalNote {
  id: string;
  author: string;
  note: string;
  createdAt: string;
}

export interface SupportRequest {
  id: string; // Format: SUP-000124
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportStatus;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    plan?: string;
    country?: string;
    deviceLimit?: number;
  };
  assignedTo?: string; // Admin ID or "unassigned" or "team"
  assignedAdminName?: string; // Display name
  messages: SupportMessage[];
  internalNotes: SupportInternalNote[]; // Strictly admin-only (not visible to users)
  attachments?: SupportAttachment[];
  resolutionSummary?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export * from "./types/collection";
export * from "./types/template-engagement";



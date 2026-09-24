import {
  UsageStep,
  SlidePrompt,
  VideoWorkflowConfig,
  WebsiteWorkflowConfig,
  PresentationWorkflowConfig,
  DesignWorkflowConfig,
  TemplateStep,
} from "@/lib/types";

export type TemplateCategoryKey = "image" | "video" | "website" | "slides" | "poster";

export interface CategoryOption {
  key: TemplateCategoryKey;
  id: string; // e.g. "cat-image-gen"
  name: string;
  slug: string;
  tagline: string;
  description: string;
  iconName: string;
  badge: string;
  accentColor: string;
  defaultSubcategory: string;
}

export interface PromptVariable {
  name: string;
  label?: string;
  defaultValue?: string;
  description?: string;
}

export interface BuilderBasicInfo {
  name: string;
  slug: string;
  description: string;
  categoryKey: TemplateCategoryKey;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  thumbnailUrl: string;
  tags: string[];
  rawTags: string;
  // Optional / Advanced
  author: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  featured: boolean;
  popular: boolean;
  status: "draft" | "published" | "archived";
  seoTitle: string;
  seoDescription: string;
  recommendedModel: string;
  assignedToolId?: string;
  assignedToolName?: string;
  assignedModelId?: string;
  assignedModelName?: string;
}

export interface ImageBuilderData {
  prompt: string;
  imageType: string;
  visualStyle: string;
  aspectRatio: string;
  orientation: string;
  lighting: string;
  cameraLens: string;
  mood: string;
  colorPalette: string;
  quality: string;
  negativePrompt: string;
  referenceImageUrl: string;
  editingInstructions: string;
  variationInstructions: string;
}

export interface VideoBuilderData {
  prompt: string;
  videoType: string;
  duration: string;
  aspectRatio: string;
  cameraMovement: string;
  motionIntensity: string;
  frameRate: string;
  visualStyle: string;
  audio: string;
  dialogue: string;
  startFrameUrl: string;
  endFrameUrl: string;
  referenceImageUrl: string;
  negativePrompt: string;
}

export interface WebsiteBuilderData {
  projectName: string;
  businessProduct: string;
  targetAudience: string;
  purpose: string;
  industry: string;
  pages: string[];
  sections: string[];
  features: string[];
  navigation: string;
  forms: string;
  integrations: string;
  responsiveRequirements: string;
  uiPrompt: string;
  contextPrompt: string;
  // Technical requirements
  framework: string;
  styling: string;
  database: string;
  authentication: string;
  api: string;
  libraries: string;
  animation: string;
}

export interface BuilderSlideItem {
  id: string;
  slideNumber: number;
  title: string;
  purpose: string;
  layout: string;
  prompt: string;
  visualDirection: string;
  contentRequirements: string;
  speakerNotes: string;
}

export interface SlidesBuilderData {
  presentationTitle: string;
  topic: string;
  audience: string;
  objective: string;
  presentationType: string;
  tone: string;
  numberOfSlides: number;
  language: string;
  presentationContext: string;
  globalPrompt: string;
  slides: BuilderSlideItem[];
}

export interface PosterBuilderData {
  designType: string;
  canvasSize: string;
  dimensions: string;
  targetAudience: string;
  mainMessage: string;
  headline: string;
  supportingText: string;
  cta: string;
  brandInformation: string;
  visualStyle: string;
  colorPalette: string;
  typography: string;
  imageDirection: string;
  prompt: string;
}

export interface WorkflowStepItem extends TemplateStep {
  inputVariables?: string[];
}

export interface ValidationErrors {
  name?: string;
  category?: string;
  mainPrompt?: string;
  uiPrompt?: string;
  contextPrompt?: string;
  presentationContext?: string;
  slides?: string;
  general?: string;
}

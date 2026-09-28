export type LanguageStatus = "default" | "enabled" | "disabled";

export interface ConfiguredLanguage {
  code: string;
  name: string;
  nativeName?: string;
  flag: string;
  status: LanguageStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TranslationStatus =
  | "pending"
  | "translating"
  | "completed"
  | "failed"
  | "needs_update"
  | "published";

export type PromptType = "ui" | "context";

export interface TemplatePromptVersion {
  id: string;
  version: number;
  versionLabel: string;
  uiPrompt: string;
  contextPrompt: string;
  createdAt: string;
}

export interface TemplateTranslation {
  id: string;
  templateId: string;
  templateName: string;
  promptVersionId: string;
  promptVersionNumber: number;
  languageCode: string;
  uiPrompt: string;
  contextPrompt: string;
  status: TranslationStatus;
  published: boolean;
  errorMessage?: string;
  lastRetriedAt?: string;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface LanguageProgress {
  languageCode: string;
  languageName: string;
  totalTemplates: number;
  completed: number;
  pending: number;
  failed: number;
  percentage: number;
  isComplete: boolean;
}

export interface TranslationUsageRecord {
  id: string;
  languageCode: string;
  templateId: string;
  promptType: PromptType;
  estimatedTokens: number;
  estimatedCost: number;
  status: "simulated" | "success" | "failed";
  timestamp: string;
}

export interface TranslationFilterOptions {
  searchQuery?: string;
  languageCode?: string;
  status?: "all" | TranslationStatus;
  templateId?: string;
}

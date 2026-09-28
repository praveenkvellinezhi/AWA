import {
  ConfiguredLanguage,
  TemplateTranslation,
  LanguageProgress,
  TranslationFilterOptions,
  TranslationStatus,
} from "../types/translation";
import {
  initialConfiguredLanguages,
  initialTemplateTranslations,
} from "../mock-data/translations";
import { aiTranslationService } from "./ai-translation-service";
import { translationUsageService } from "./translation-usage-service";
import { initialTemplates } from "../mock-data/templates";
import { Template } from "../types";

const STORAGE_KEY_LANGUAGES = "awa_configured_languages_v2";
const STORAGE_KEY_TRANSLATIONS = "awa_template_translations_v2";

type TranslationListener = () => void;

class TranslationService {
  private languages: ConfiguredLanguage[] = [];
  private translations: TemplateTranslation[] = [];
  private listeners: TranslationListener[] = [];
  private activeJobs: Set<string> = new Set(); // tracks active language jobs

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== "undefined") {
      try {
        const savedLangs = localStorage.getItem(STORAGE_KEY_LANGUAGES);
        const savedTrans = localStorage.getItem(STORAGE_KEY_TRANSLATIONS);

        if (savedLangs) {
          this.languages = JSON.parse(savedLangs);
        } else {
          this.languages = [...initialConfiguredLanguages];
          this.persistLanguages();
        }

        if (savedTrans) {
          this.translations = JSON.parse(savedTrans);
        } else {
          this.translations = [...initialTemplateTranslations];
          this.persistTranslations();
        }
      } catch {
        this.languages = [...initialConfiguredLanguages];
        this.translations = [...initialTemplateTranslations];
      }
    } else {
      this.languages = [...initialConfiguredLanguages];
      this.translations = [...initialTemplateTranslations];
    }
  }

  private persistLanguages() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_LANGUAGES, JSON.stringify(this.languages));
      } catch {
        // Ignore storage write issues
      }
    }
  }

  private persistTranslations() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_TRANSLATIONS, JSON.stringify(this.translations));
      } catch {
        // Ignore storage write issues
      }
    }
  }

  private notify() {
    this.persistLanguages();
    this.persistTranslations();
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error("TranslationService listener error:", err);
      }
    });
  }

  public subscribe(listener: TranslationListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // ==========================================
  // LANGUAGE MANAGEMENT
  // ==========================================

  public getLanguages(): ConfiguredLanguage[] {
    return [...this.languages];
  }

  public getEnabledLanguages(): ConfiguredLanguage[] {
    return this.languages.filter((l) => l.status === "enabled" || l.status === "default");
  }

  public getLanguage(code: string): ConfiguredLanguage | undefined {
    return this.languages.find((l) => l.code.toLowerCase() === code.toLowerCase());
  }

  public addLanguage(
    name: string,
    code: string,
    enabled: boolean = true,
    flag: string = "🌐"
  ): { success: boolean; error?: string; language?: ConfiguredLanguage } {
    const cleanCode = code.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanCode || !cleanName) {
      return { success: false, error: "Language name and code are required." };
    }

    const existing = this.languages.find((l) => l.code.toLowerCase() === cleanCode);
    if (existing) {
      return { success: false, error: "This language is already configured." };
    }

    const newLang: ConfiguredLanguage = {
      code: cleanCode,
      name: cleanName,
      flag: flag.trim() || "🌐",
      status: enabled ? "enabled" : "disabled",
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.languages.push(newLang);
    this.notify();

    if (enabled) {
      // Initiate background translation job automatically
      this.startLanguageTranslationJob(cleanCode);
    }

    return { success: true, language: newLang };
  }

  public enableLanguage(code: string): void {
    const cleanCode = code.trim().toLowerCase();
    const lang = this.languages.find((l) => l.code.toLowerCase() === cleanCode);
    if (!lang) return;

    if (lang.status !== "default") {
      lang.status = "enabled";
      lang.updatedAt = new Date().toISOString();
      this.notify();
      // Start translation pipeline for any missing/pending templates
      this.startLanguageTranslationJob(cleanCode);
    }
  }

  public disableLanguage(code: string): void {
    const cleanCode = code.trim().toLowerCase();
    const lang = this.languages.find((l) => l.code.toLowerCase() === cleanCode);
    if (!lang || lang.isDefault) return;

    lang.status = "disabled";
    lang.updatedAt = new Date().toISOString();
    this.notify();
  }

  // ==========================================
  // PROGRESS COMPUTATION
  // ==========================================

  public getPublishedTemplatesCount(): number {
    return initialTemplates.filter((t) => t.isPublished !== false).length || 10;
  }

  public getTranslationProgress(languageCode: string): LanguageProgress {
    const lang = this.getLanguage(languageCode);
    const langName = lang?.name || languageCode;
    const totalTemplates = this.getPublishedTemplatesCount();

    if (lang?.isDefault || languageCode === "en") {
      return {
        languageCode: "en",
        languageName: "English",
        totalTemplates,
        completed: totalTemplates,
        pending: 0,
        failed: 0,
        percentage: 100,
        isComplete: true,
      };
    }

    const langTranslations = this.translations.filter(
      (t) => t.languageCode.toLowerCase() === languageCode.toLowerCase()
    );

    const completed = langTranslations.filter(
      (t) => t.status === "completed" || t.status === "published"
    ).length;

    const failed = langTranslations.filter((t) => t.status === "failed").length;

    // Remaining published templates not translated yet or pending
    const pending = Math.max(0, totalTemplates - completed - failed);

    const percentage = totalTemplates > 0 ? Math.floor((completed / totalTemplates) * 100) : 0;
    const isComplete = completed === totalTemplates && pending === 0 && failed === 0;

    return {
      languageCode,
      languageName: langName,
      totalTemplates,
      completed,
      pending,
      failed,
      percentage,
      isComplete,
    };
  }

  // ==========================================
  // TRANSLATION RETRIEVAL & FILTERING
  // ==========================================

  public getAllTranslations(filters?: TranslationFilterOptions): TemplateTranslation[] {
    let result = [...this.translations];

    if (filters?.languageCode) {
      result = result.filter(
        (t) => t.languageCode.toLowerCase() === filters.languageCode!.toLowerCase()
      );
    }

    if (filters?.templateId) {
      result = result.filter((t) => t.templateId === filters.templateId);
    }

    if (filters?.status && filters.status !== "all") {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.templateName.toLowerCase().includes(q) ||
          t.uiPrompt.toLowerCase().includes(q) ||
          t.contextPrompt.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getTemplateTranslations(
    templateId: string,
    languageCode?: string
  ): TemplateTranslation[] {
    return this.translations.filter(
      (t) =>
        t.templateId === templateId &&
        (!languageCode || t.languageCode.toLowerCase() === languageCode.toLowerCase())
    );
  }

  public getTranslation(id: string): TemplateTranslation | undefined {
    return this.translations.find((t) => t.id === id);
  }

  // ==========================================
  // TRANSLATION ACTIONS: EDIT, RETRY, PUBLISH
  // ==========================================

  public updateTranslation(
    translationId: string,
    data: { uiPrompt?: string; contextPrompt?: string }
  ): TemplateTranslation | null {
    const item = this.translations.find((t) => t.id === translationId);
    if (!item) return null;

    if (data.uiPrompt !== undefined) item.uiPrompt = data.uiPrompt;
    if (data.contextPrompt !== undefined) item.contextPrompt = data.contextPrompt;
    item.updatedAt = new Date().toISOString();

    // If it was failed, editing it moves it to completed
    if (item.status === "failed" || item.status === "needs_update") {
      item.status = "completed";
      delete item.errorMessage;
    }

    this.notify();
    return item;
  }

  public publishTranslation(
    translationId: string,
    reviewedBy: string = "Admin"
  ): TemplateTranslation | null {
    const item = this.translations.find((t) => t.id === translationId);
    if (!item) return null;

    item.status = "published";
    item.published = true;
    item.reviewedBy = reviewedBy;
    item.reviewedAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();

    this.notify();
    return item;
  }

  public async retryTranslation(translationId: string): Promise<TemplateTranslation | null> {
    const item = this.translations.find((t) => t.id === translationId);
    if (!item) return null;

    // Idempotent retry: update existing record in place, never duplicate!
    item.status = "translating";
    item.lastRetriedAt = new Date().toISOString();
    delete item.errorMessage;
    this.notify();

    const template = initialTemplates.find((t) => t.id === item.templateId);
    const sourceUi = template?.uiPrompt || template?.promptText || "Generate luxury visual render";
    const sourceContext = template?.contextPrompt || "Preserve aspect ratio and color fidelity";

    try {
      // Simulate asynchronous AI translation
      await new Promise((r) => setTimeout(r, 650));

      const [resUi, resCtx] = await Promise.all([
        aiTranslationService.translatePrompt(sourceUi, item.languageCode, "ui"),
        aiTranslationService.translatePrompt(sourceContext, item.languageCode, "context"),
      ]);

      item.uiPrompt = resUi.translatedText;
      item.contextPrompt = resCtx.translatedText;
      item.status = "completed";
      item.published = false;
      item.updatedAt = new Date().toISOString();

      translationUsageService.recordUsage({
        languageCode: item.languageCode,
        templateId: item.templateId,
        promptType: "ui",
        estimatedTokens: resUi.estimatedTokens,
        estimatedCost: resUi.estimatedCost,
        status: "success",
      });
    } catch {
      item.status = "failed";
      item.errorMessage = "Simulated API retry failed due to transient gateway interruption.";
    }

    this.notify();
    return item;
  }

  // ==========================================
  // BACKGROUND JOB PROCESSOR SIMULATION
  // ==========================================

  public isJobActive(languageCode: string): boolean {
    return this.activeJobs.has(languageCode.toLowerCase());
  }

  public async startLanguageTranslationJob(languageCode: string): Promise<void> {
    const code = languageCode.toLowerCase();
    if (code === "en" || this.activeJobs.has(code)) return;

    this.activeJobs.add(code);
    this.notify();

    const publishedTemplates = initialTemplates.filter((t) => t.isPublished !== false);

    // Process templates sequentially in the background
    (async () => {
      try {
        for (const tmpl of publishedTemplates) {
          // Check if language was disabled while running
          const lang = this.getLanguage(code);
          if (!lang || lang.status === "disabled") {
            break;
          }

          // Check if translation already exists for templateId + version + languageCode (Idempotent)
          const existing = this.translations.find(
            (t) => t.templateId === tmpl.id && t.languageCode.toLowerCase() === code
          );

          if (existing && (existing.status === "completed" || existing.status === "published")) {
            // Already translated and valid
            continue;
          }

          let record = existing;
          if (!record) {
            record = {
              id: `trans-${code}-${tmpl.id.replace("template-", "")}-${Date.now().toString(36)}`,
              templateId: tmpl.id,
              templateName: tmpl.name,
              promptVersionId: `pv-${tmpl.id}-v1`,
              promptVersionNumber: 1,
              languageCode: code,
              uiPrompt: "",
              contextPrompt: "",
              status: "translating",
              published: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            this.translations.push(record);
          } else {
            record.status = "translating";
          }
          this.notify();

          // Realistic simulated processing delay (350ms - 600ms)
          await new Promise((resolve) => setTimeout(resolve, 450));

          // Simulate 4% intentional failure rate to demonstrate failure & retry UI
          const shouldFail = Math.random() < 0.05 && tmpl.id === "template-dark-mode-ai-saas";

          if (shouldFail) {
            record.status = "failed";
            record.errorMessage = "Simulated context parsing error: Connection dropped during inference.";
            record.updatedAt = new Date().toISOString();
            translationUsageService.recordUsage({
              languageCode: code,
              templateId: tmpl.id,
              promptType: "ui",
              estimatedTokens: 80,
              estimatedCost: 0.0001,
              status: "failed",
            });
          } else {
            const sourceUi = tmpl.uiPrompt || tmpl.promptText || "";
            const sourceCtx = tmpl.contextPrompt || "";

            const [uiRes, ctxRes] = await Promise.all([
              aiTranslationService.translatePrompt(sourceUi, code, "ui"),
              aiTranslationService.translatePrompt(sourceCtx, code, "context"),
            ]);

            record.uiPrompt = uiRes.translatedText;
            record.contextPrompt = ctxRes.translatedText;
            record.status = "completed";
            record.published = false;
            record.updatedAt = new Date().toISOString();

            translationUsageService.recordUsage({
              languageCode: code,
              templateId: tmpl.id,
              promptType: "ui",
              estimatedTokens: uiRes.estimatedTokens,
              estimatedCost: uiRes.estimatedCost,
              status: "success",
            });
          }

          this.notify();
        }
      } finally {
        this.activeJobs.delete(code);
        this.notify();
      }
    })();
  }

  // ==========================================
  // SOURCE VERSION BUMP / UPDATE PROPAGATION
  // ==========================================

  public handleTemplateVersionBump(
    templateId: string,
    newVersionNumber: number,
    newUiPrompt: string,
    newContextPrompt: string
  ): void {
    // When a template's source prompt changes:
    // Existing published translations are marked as 'needs_update'
    const relatedTranslations = this.translations.filter((t) => t.templateId === templateId);

    relatedTranslations.forEach((t) => {
      t.status = "needs_update";
      t.updatedAt = new Date().toISOString();
    });

    this.notify();
  }

  public handleNewTemplatePublished(template: Template): void {
    // For each currently enabled language, automatically queue translation
    const enabledLangs = this.getEnabledLanguages().filter((l) => !l.isDefault);
    enabledLangs.forEach((lang) => {
      const existing = this.translations.find(
        (t) => t.templateId === template.id && t.languageCode === lang.code
      );
      if (!existing) {
        this.translations.push({
          id: `trans-${lang.code}-${template.id.replace("template-", "")}-${Date.now().toString(36)}`,
          templateId: template.id,
          templateName: template.name,
          promptVersionId: `pv-${template.id}-v1`,
          promptVersionNumber: 1,
          languageCode: lang.code,
          uiPrompt: "",
          contextPrompt: "",
          status: "pending",
          published: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    this.notify();
  }

  // ==========================================
  // USER-FACING RESOLVER & DEFAULT FALLBACK
  // ==========================================

  public getResolvedTemplatePrompts(
    template: Template,
    languageCode: string = "en"
  ): {
    uiPrompt: string;
    contextPrompt: string;
    isFallback: boolean;
    languageCode: string;
  } {
    const defaultUi = template.uiPrompt || template.promptText || "";
    const defaultCtx = template.contextPrompt || "";

    if (!languageCode || languageCode === "en") {
      return {
        uiPrompt: defaultUi,
        contextPrompt: defaultCtx,
        isFallback: false,
        languageCode: "en",
      };
    }

    // Check if language is enabled
    const lang = this.getLanguage(languageCode);
    if (!lang || lang.status === "disabled") {
      return {
        uiPrompt: defaultUi,
        contextPrompt: defaultCtx,
        isFallback: true,
        languageCode: "en",
      };
    }

    // Find published translation
    const translation = this.translations.find(
      (t) =>
        t.templateId === template.id &&
        t.languageCode.toLowerCase() === languageCode.toLowerCase() &&
        (t.status === "published" || (t.status === "completed" && t.published))
    );

    if (translation && (translation.uiPrompt || translation.contextPrompt)) {
      return {
        uiPrompt: translation.uiPrompt || defaultUi,
        contextPrompt: translation.contextPrompt || defaultCtx,
        isFallback: false,
        languageCode,
      };
    }

    // Default fallback to English without broken or empty prompts
    return {
      uiPrompt: defaultUi,
      contextPrompt: defaultCtx,
      isFallback: true,
      languageCode: "en",
    };
  }
}

export const translationService = new TranslationService();

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ConfiguredLanguage,
  TemplateTranslation,
  LanguageProgress,
  TranslationFilterOptions,
} from "../types/translation";
import { translationService } from "../services/translation-service";

export function useLanguages() {
  const [languages, setLanguages] = useState<ConfiguredLanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      const langs = translationService.getLanguages();
      setLanguages(langs);
    } catch {
      setError("Unable to load translation data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsub = translationService.subscribe(refresh);
    return unsub;
  }, [refresh]);

  const enabledLanguages = useMemo(
    () => languages.filter((l) => l.status === "enabled" || l.status === "default"),
    [languages]
  );

  const defaultLanguage = useMemo(
    () => languages.find((l) => l.isDefault) || languages[0],
    [languages]
  );

  const addLanguage = useCallback(
    (name: string, code: string, enabled: boolean = true, flag?: string) => {
      return translationService.addLanguage(name, code, enabled, flag);
    },
    []
  );

  const enableLanguage = useCallback((code: string) => {
    translationService.enableLanguage(code);
  }, []);

  const disableLanguage = useCallback((code: string) => {
    translationService.disableLanguage(code);
  }, []);

  const isJobActive = useCallback((code: string) => {
    return translationService.isJobActive(code);
  }, []);

  return {
    languages,
    enabledLanguages,
    defaultLanguage,
    isLoading,
    error,
    refresh,
    addLanguage,
    enableLanguage,
    disableLanguage,
    isJobActive,
  };
}

export function useLanguageProgress(code: string) {
  const [progress, setProgress] = useState<LanguageProgress>(() =>
    translationService.getTranslationProgress(code)
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(() =>
    translationService.isJobActive(code)
  );

  const refresh = useCallback(() => {
    setProgress(translationService.getTranslationProgress(code));
    setIsProcessing(translationService.isJobActive(code));
  }, [code]);

  useEffect(() => {
    refresh();
    const unsub = translationService.subscribe(refresh);
    return unsub;
  }, [refresh]);

  return { progress, isProcessing, refresh };
}

export function useAllTranslations(filters?: TranslationFilterOptions) {
  const [translations, setTranslations] = useState<TemplateTranslation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    const data = translationService.getAllTranslations(filters);
    setTranslations(data);
    setIsLoading(false);
  }, [filters?.languageCode, filters?.status, filters?.searchQuery, filters?.templateId]);

  useEffect(() => {
    refresh();
    const unsub = translationService.subscribe(refresh);
    return unsub;
  }, [refresh]);

  const updateTranslation = useCallback(
    (id: string, data: { uiPrompt?: string; contextPrompt?: string }) => {
      return translationService.updateTranslation(id, data);
    },
    []
  );

  const publishTranslation = useCallback((id: string) => {
    return translationService.publishTranslation(id);
  }, []);

  const retryTranslation = useCallback(async (id: string) => {
    return await translationService.retryTranslation(id);
  }, []);

  return {
    translations,
    isLoading,
    refresh,
    updateTranslation,
    publishTranslation,
    retryTranslation,
  };
}

export function useTemplateTranslations(templateId: string, languageCode?: string) {
  const [translations, setTranslations] = useState<TemplateTranslation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    const data = translationService.getTemplateTranslations(templateId, languageCode);
    setTranslations(data);
    setIsLoading(false);
  }, [templateId, languageCode]);

  useEffect(() => {
    refresh();
    const unsub = translationService.subscribe(refresh);
    return unsub;
  }, [refresh]);

  const updateTranslation = useCallback(
    (id: string, data: { uiPrompt?: string; contextPrompt?: string }) => {
      return translationService.updateTranslation(id, data);
    },
    []
  );

  const publishTranslation = useCallback((id: string) => {
    return translationService.publishTranslation(id);
  }, []);

  const retryTranslation = useCallback(async (id: string) => {
    return await translationService.retryTranslation(id);
  }, []);

  return {
    translations,
    isLoading,
    refresh,
    updateTranslation,
    publishTranslation,
    retryTranslation,
  };
}

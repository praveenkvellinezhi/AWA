"use client";

import React, { useState, useEffect } from "react";
import { Template } from "@/lib/types";
import {
  ConfiguredLanguage,
  TemplateTranslation,
  TranslationStatus,
} from "@/lib/types/translation";
import { useLanguages, useTemplateTranslations } from "@/lib/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Pencil,
  Save,
  X,
  Send,
  RefreshCw,
  Clock,
  Layers,
  Info,
} from "lucide-react";
import { translationService } from "@/lib/services/translation-service";

interface TemplateTranslateTabProps {
  template: Template;
  initialLanguageCode?: string;
  onSavedNotice?: (msg: string) => void;
}

export function TemplateTranslateTab({
  template,
  initialLanguageCode = "es",
  onSavedNotice,
}: TemplateTranslateTabProps) {
  const { languages } = useLanguages();
  const { translations, updateTranslation, publishTranslation, retryTranslation } =
    useTemplateTranslations(template.id);

  // Selected language in Translate tab
  const [selectedLangCode, setSelectedLangCode] = useState<string>(initialLanguageCode);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editUiPrompt, setEditUiPrompt] = useState("");
  const [editContextPrompt, setEditContextPrompt] = useState("");

  // Publish confirmation modal state
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Active translation record for the selected language
  const activeTranslation = translations.find(
    (t) => t.languageCode.toLowerCase() === selectedLangCode.toLowerCase()
  );

  const selectedLanguage = languages.find(
    (l) => l.code.toLowerCase() === selectedLangCode.toLowerCase()
  );

  const isDefaultLang = selectedLangCode === "en";

  // Source English prompts
  const sourceUiPrompt = template.uiPrompt || template.promptText || "";
  const sourceContextPrompt =
    template.contextPrompt || "Preserve aspect ratio, color temperature, and brand consistency.";

  // Sync edit fields when selection changes or editing toggles
  useEffect(() => {
    if (activeTranslation) {
      setEditUiPrompt(activeTranslation.uiPrompt);
      setEditContextPrompt(activeTranslation.contextPrompt);
    } else {
      setEditUiPrompt("");
      setEditContextPrompt("");
    }
    setIsEditing(false);
  }, [selectedLangCode, activeTranslation?.id]);

  const handleStartEditing = () => {
    if (activeTranslation) {
      setEditUiPrompt(activeTranslation.uiPrompt || "");
      setEditContextPrompt(activeTranslation.contextPrompt || "");
    }
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (activeTranslation) {
      setEditUiPrompt(activeTranslation.uiPrompt);
      setEditContextPrompt(activeTranslation.contextPrompt);
    }
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!activeTranslation) return;
    updateTranslation(activeTranslation.id, {
      uiPrompt: editUiPrompt.trim(),
      contextPrompt: editContextPrompt.trim(),
    });
    setIsEditing(false);
    onSavedNotice?.("Translation changes saved successfully.");
  };

  const handlePublishConfirm = () => {
    if (!activeTranslation) return;
    publishTranslation(activeTranslation.id);
    setIsPublishDialogOpen(false);
    onSavedNotice?.(
      `Translation for ${selectedLanguage?.name || selectedLangCode} published to live catalog!`
    );
  };

  const handleRetry = async () => {
    if (!activeTranslation) {
      // Create translation task and trigger
      setIsProcessingAction(true);
      await translationService.startLanguageTranslationJob(selectedLangCode);
      setIsProcessingAction(false);
      return;
    }

    setIsProcessingAction(true);
    await retryTranslation(activeTranslation.id);
    setIsProcessingAction(false);
    onSavedNotice?.("Translation successfully refreshed with AI pipeline.");
  };

  const renderStatusBadge = (status?: TranslationStatus, isPublished?: boolean) => {
    if (isDefaultLang) {
      return (
        <Badge className="bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-mono text-[10px]">
          Source Language (Default)
        </Badge>
      );
    }

    if (!status) {
      return (
        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-mono text-[10px]">
          Not Translated
        </Badge>
      );
    }

    switch (status) {
      case "published":
        return (
          <Badge className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-mono text-[10px] gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Published
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-mono text-[10px] gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Completed (Unpublished)
          </Badge>
        );
      case "translating":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-mono text-[10px] gap-1 animate-pulse">
            <RotateCw className="w-3 h-3 animate-spin text-amber-600" />
            Translating...
          </Badge>
        );
      case "needs_update":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-mono text-[10px] gap-1">
            <RefreshCw className="w-3 h-3 text-amber-600" />
            Needs Update
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-mono text-[10px] gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Failed
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-mono text-[10px] gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Tab Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200/90 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Template Localization Hub
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Translate: {template.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review, edit, and publish target-language prompts. UI Prompt and Context Prompt are maintained as independent fields to preserve technical parameters.
          </p>
        </div>

        {/* Source Version Indicator */}
        <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Active Source: <strong>Version 3 (v3)</strong>
          </span>
        </div>
      </div>

      {/* Main Split Layout: Language Selector Pills/Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-[#0E1422] border border-slate-200 dark:border-zinc-800">
        {languages.map((lang) => {
          const isSelected = lang.code.toLowerCase() === selectedLangCode.toLowerCase();
          const tr = translations.find(
            (t) => t.languageCode.toLowerCase() === lang.code.toLowerCase()
          );

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLangCode(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.isDefault ? (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                  Default
                </span>
              ) : tr?.status === "published" ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Published" />
              ) : tr?.status === "completed" ? (
                <span className="w-2 h-2 rounded-full bg-blue-500" title="Completed" />
              ) : tr?.status === "failed" ? (
                <span className="w-2 h-2 rounded-full bg-rose-500" title="Failed" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Language Detail Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/90 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-zinc-700">
            {selectedLanguage?.flag || "🌐"}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {selectedLanguage?.name} ({selectedLangCode.toUpperCase()})
              </h3>
              {renderStatusBadge(activeTranslation?.status, activeTranslation?.published)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Source Version:{" "}
              <code className="font-mono font-semibold">
                v{activeTranslation?.promptVersionNumber || 3}
              </code>
              {activeTranslation?.reviewedBy && (
                <span className="ml-2 text-slate-400">
                  • Reviewed by {activeTranslation.reviewedBy}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Translation Action Toolbar */}
        {!isDefaultLang && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEditing}
                  className="text-xs gap-1.5 rounded-xl"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </Button>
                <Button
                  size="sm"
                  variant="forest"
                  onClick={handleSaveEdit}
                  className="text-xs font-bold gap-1.5 rounded-xl shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </Button>
              </>
            ) : (
              <>
                {/* Retry action if failed, needs update, or translating */}
                {(activeTranslation?.status === "failed" ||
                  activeTranslation?.status === "needs_update" ||
                  !activeTranslation) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetry}
                    disabled={isProcessingAction}
                    className="text-xs font-semibold gap-1.5 rounded-xl text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                  >
                    <RotateCw
                      className={`w-3.5 h-3.5 ${isProcessingAction ? "animate-spin" : ""}`}
                    />
                    <span>
                      {!activeTranslation
                        ? "Generate AI Translation"
                        : activeTranslation.status === "failed"
                        ? "Retry Translation"
                        : "Update Translation"}
                    </span>
                  </Button>
                )}

                {/* Edit Translation Button */}
                {activeTranslation && activeTranslation.status !== "translating" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleStartEditing}
                    className="text-xs font-semibold gap-1.5 rounded-xl"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Translation</span>
                  </Button>
                )}

                {/* Publish Button (Available when completed and unpublished) */}
                {activeTranslation &&
                  activeTranslation.status === "completed" &&
                  !activeTranslation.published && (
                    <Button
                      size="sm"
                      variant="forest"
                      onClick={() => setIsPublishDialogOpen(true)}
                      className="text-xs font-bold gap-1.5 rounded-xl shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Translation</span>
                    </Button>
                  )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Failure Alert Banner if failed */}
      {activeTranslation?.status === "failed" && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-100">
                Translation Processing Interrupted
              </h4>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 font-mono mt-0.5">
                {activeTranslation.errorMessage ||
                  "Connection timeout during token processing. Ready for safe idempotent retry."}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRetry}
            disabled={isProcessingAction}
            className="text-xs font-bold gap-1.5 rounded-xl text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isProcessingAction ? "animate-spin" : ""}`} />
            <span>Retry Now</span>
          </Button>
        </div>
      )}

      {/* Default English View (No translation needed) */}
      {isDefaultLang ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-purple-600" />
            <span>
              English is the canonical source language for AWA templates. Other languages are translated and reviewed relative to this version.
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                Primary UI Prompt (English)
              </Label>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                {sourceUiPrompt}
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                System Context Prompt (English)
              </Label>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                {sourceContextPrompt}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Translation Comparison Sections: Two-column on desktop, stacked on mobile */
        <div className="space-y-6">
          {/* SECTION 1: UI PROMPT */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  01
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  UI Prompt Translation
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Visual prompt generation instruction
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
              {/* Left Column: English Source */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Source (English)
                  </Label>
                  <span className="text-[10px] font-mono text-slate-400">Original • Read-only</span>
                </div>
                <div className="flex-1 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  {sourceUiPrompt || <span className="italic text-slate-400">No UI prompt specified.</span>}
                </div>
              </div>

              {/* Right Column: Target Translated Prompt */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                    Translated ({selectedLanguage?.name})
                  </Label>
                  {isEditing && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Editing
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <Textarea
                    rows={6}
                    value={editUiPrompt}
                    onChange={(e) => setEditUiPrompt(e.target.value)}
                    placeholder={`Enter ${selectedLanguage?.name} translation...`}
                    className="flex-1 text-xs font-mono leading-relaxed"
                  />
                ) : (
                  <div className="flex-1 p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-mono">
                    {activeTranslation?.uiPrompt ? (
                      activeTranslation.uiPrompt
                    ) : (
                      <div className="py-6 text-center text-slate-400 italic">
                        No translated UI prompt available yet. Click "Generate AI Translation" above.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTEXT PROMPT */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  02
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Context Prompt Translation
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                System instructions and boundary rules
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
              {/* Left Column: English Source */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Source Context (English)
                  </Label>
                  <span className="text-[10px] font-mono text-slate-400">Original • Read-only</span>
                </div>
                <div className="flex-1 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  {sourceContextPrompt}
                </div>
              </div>

              {/* Right Column: Target Translated Context Prompt */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                    Translated Context ({selectedLanguage?.name})
                  </Label>
                  {isEditing && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Editing
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <Textarea
                    rows={6}
                    value={editContextPrompt}
                    onChange={(e) => setEditContextPrompt(e.target.value)}
                    placeholder={`Enter ${selectedLanguage?.name} context translation...`}
                    className="flex-1 text-xs font-mono leading-relaxed"
                  />
                ) : (
                  <div className="flex-1 p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-mono">
                    {activeTranslation?.contextPrompt ? (
                      activeTranslation.contextPrompt
                    ) : (
                      <div className="py-6 text-center text-slate-400 italic">
                        No translated context prompt available yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Publishing Translation */}
      <AlertDialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#131B2A] border-slate-200 dark:border-zinc-800">
          <AlertDialogHeader>
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-2">
              <Send className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Publish Translation to Catalog?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This translation will become live and available immediately for users who select{" "}
              <strong>{selectedLanguage?.name}</strong> in the AWA catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              Publish Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

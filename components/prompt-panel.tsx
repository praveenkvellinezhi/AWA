"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layout,
  FileText,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  combinePrompts,
  splitCombinedPrompt,
  getTemplatePrompts,
} from "@/lib/prompt-utils";

interface PromptPanelProps {
  templateId: string;
  uiPrompt?: string;
  contextPrompt?: string;
  originalPrompt?: string; // Maintained for backward compatibility
  isCustomizeOpen?: boolean;
  onCustomizeClick: () => void;
  onCopySuccess: () => void;
}

export function PromptPanel({
  templateId,
  uiPrompt,
  contextPrompt,
  originalPrompt,
  isCustomizeOpen = false,
  onCustomizeClick,
  onCopySuccess,
}: PromptPanelProps) {
  const { activeCustomizedPrompts, customizationHistory, revertToOriginal } = useDemo();

  const [copiedCombined, setCopiedCombined] = useState(false);
  const [copiedUi, setCopiedUi] = useState(false);
  const [copiedContext, setCopiedContext] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const [isUiExpanded, setIsUiExpanded] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);

  // When isCustomizeOpen changes, reset manual expansion state
  useEffect(() => {
    setIsManuallyExpanded(false);
  }, [isCustomizeOpen]);

  // 1. Resolve base prompts gracefully
  const basePrompts = useMemo(() => {
    if (uiPrompt && contextPrompt) {
      return { uiPrompt, contextPrompt };
    }
    return getTemplatePrompts({
      uiPrompt,
      contextPrompt,
      promptText: originalPrompt,
    });
  }, [uiPrompt, contextPrompt, originalPrompt]);

  // 2. Resolve active prompts (original vs customized)
  const customizedPrompt = activeCustomizedPrompts[templateId];
  const isCustomized = !!customizedPrompt;
  const history = customizationHistory[templateId] || [];

  const { currentUiPrompt, currentContextPrompt, combinedPrompt } = useMemo(() => {
    if (customizedPrompt) {
      const split = splitCombinedPrompt(customizedPrompt);
      const activeUi = split.uiPrompt || basePrompts.uiPrompt;
      const activeCtx = split.contextPrompt || basePrompts.contextPrompt;
      return {
        currentUiPrompt: activeUi,
        currentContextPrompt: activeCtx,
        combinedPrompt: customizedPrompt,
      };
    }
    return {
      currentUiPrompt: basePrompts.uiPrompt,
      currentContextPrompt: basePrompts.contextPrompt,
      combinedPrompt: combinePrompts(basePrompts.uiPrompt, basePrompts.contextPrompt),
    };
  }, [customizedPrompt, basePrompts]);

  const isShrunk = isCustomizeOpen && !isManuallyExpanded;

  // Primary Copy Combined action
  const handleCopyCombined = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(combinedPrompt);
      }
    } catch (e) {
      console.warn("Clipboard write failed, using fallback:", e);
    }
    setCopiedCombined(true);
    onCopySuccess();
    setTimeout(() => setCopiedCombined(false), 2500);
  };

  // Individual UI Prompt Copy
  const handleCopyUi = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUiPrompt);
      }
    } catch (e) {
      console.warn("Clipboard write failed:", e);
    }
    setCopiedUi(true);
    setTimeout(() => setCopiedUi(false), 2000);
  };

  // Individual Context Prompt Copy
  const handleCopyContext = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentContextPrompt);
      }
    } catch (e) {
      console.warn("Clipboard write failed:", e);
    }
    setCopiedContext(true);
    setTimeout(() => setCopiedContext(false), 2000);
  };

  const isUiLong = currentUiPrompt.length > 220;
  const isContextLong = currentContextPrompt.length > 220;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] transition-all duration-300 overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          {isCustomized ? (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 font-semibold uppercase tracking-wider text-[11px]"
            >
              <span>{isShrunk ? "Customized Prompts" : "Your Customized Prompts"}</span>
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 font-semibold uppercase tracking-wider text-[11px]"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
              <span>{isShrunk ? "Base Prompts" : "Original Expert Prompts"}</span>
            </Badge>
          )}

          {isShrunk && (
            <Badge
              variant="outline"
              className="text-[10px] font-mono font-medium hidden sm:inline-flex"
            >
              Shrunk for Customizer
            </Badge>
          )}

          {history.length > 0 && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
              (v{history.length + 1})
            </span>
          )}
        </div>

        {/* Actions right */}
        <div className="flex items-center gap-2">
          {isCustomized && (
            <Button
              onClick={() => revertToOriginal(templateId)}
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              title="Revert to unmodified admin expert prompts (0 credits charged)"
            >
              <RefreshCw className="h-3 w-3 text-amber-500" />
              <span>Revert</span>
            </Button>
          )}

          <Button
            onClick={onCustomizeClick}
            variant="secondary"
            size="sm"
            className={`gap-1.5 font-semibold text-xs border ${
              isCustomizeOpen
                ? "bg-slate-200 hover:bg-slate-300 text-slate-900 border-slate-300 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700 shadow-sm"
            }`}
          >
            <span>{isCustomizeOpen ? "Close Customizer" : "Customize with AI"}</span>
          </Button>
        </div>
      </div>

      {/* Shrunk vs Full Prompt Body */}
      {isShrunk ? (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950/80 space-y-2.5 text-xs border-b border-slate-200 dark:border-slate-800">
          {/* UI Prompt Quick Row */}
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                UI Prompt
              </span>
              <p className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
                {currentUiPrompt}
              </p>
            </div>
            <Button
              onClick={handleCopyUi}
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-[11px] gap-1 shrink-0"
              title="Copy UI Prompt"
            >
              {copiedUi ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              <span>{copiedUi ? "Copied" : "Copy UI"}</span>
            </Button>
          </div>

          {/* Context Prompt Quick Row */}
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                Context Prompt
              </span>
              <p className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
                {currentContextPrompt}
              </p>
            </div>
            <Button
              onClick={handleCopyContext}
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-[11px] gap-1 shrink-0"
              title="Copy Context Prompt"
            >
              {copiedContext ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              <span>{copiedContext ? "Copied" : "Copy Context"}</span>
            </Button>
          </div>

          {/* Shrunk Actions Bar */}
          <div className="flex items-center justify-between pt-1">
            <Button
              onClick={() => setIsManuallyExpanded(true)}
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-slate-600 dark:text-slate-400 h-7"
            >
              <span>Expand Prompts</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>

            <Button
              onClick={handleCopyCombined}
              variant="default"
              size="sm"
              className={copiedCombined ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7" : "bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-7"}
              title="Copy combined UI + Context prompt"
            >
              {copiedCombined ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Copied Full!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Full Prompt</span>
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* Full Dual Prompt Body */
        <div className="p-4 sm:p-5 space-y-4 bg-white dark:bg-transparent">
          {/* 1. UI PROMPT SECTION */}
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800/90 bg-slate-50/70 dark:bg-zinc-950/60 p-4 space-y-2.5 transition-colors">
            {/* UI Prompt Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Layout className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    UI Prompt
                  </h4>
                </div>
              </div>

              {/* Copy UI Prompt Button */}
              <Button
                onClick={handleCopyUi}
                variant="outline"
                size="sm"
                className={`h-7 px-2.5 text-xs font-semibold gap-1.5 transition-all ${
                  copiedUi
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white"
                }`}
                title="Copy UI Prompt only"
              >
                {copiedUi ? (
                  <>
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    <span>Copied UI!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-400" />
                    <span>Copy UI Prompt</span>
                  </>
                )}
              </Button>
            </div>

            {/* Short Description */}
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
              Instructions for visual UI, layout, styling tokens, typography, component structures, and responsive design.
            </p>

            {/* Readable Preview without inner border */}
            <div className="relative rounded-lg bg-white dark:bg-[#0a0b0e] p-3 font-mono text-xs text-slate-900 dark:text-slate-200 leading-relaxed">
              <p
                className={`whitespace-pre-wrap break-words ${
                  !isUiExpanded && isUiLong ? "line-clamp-4" : ""
                }`}
              >
                {currentUiPrompt}
              </p>

              {isUiLong && (
                <div className="pt-2 mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsUiExpanded(!isUiExpanded)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isUiExpanded ? "Show less" : "Show full UI prompt"}</span>
                    {isUiExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. CONTEXT PROMPT SECTION */}
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800/90 bg-slate-50/70 dark:bg-zinc-950/60 p-4 space-y-2.5 transition-colors">
            {/* Context Prompt Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Context Prompt
                  </h4>
                </div>
              </div>

              {/* Copy Context Prompt Button */}
              <Button
                onClick={handleCopyContext}
                variant="outline"
                size="sm"
                className={`h-7 px-2.5 text-xs font-semibold gap-1.5 transition-all ${
                  copiedContext
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white"
                }`}
                title="Copy Context Prompt only"
              >
                {copiedContext ? (
                  <>
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    <span>Copied Context!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-400" />
                    <span>Copy Context Prompt</span>
                  </>
                )}
              </Button>
            </div>

            {/* Short Description */}
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
              Project background, target audience, core functionality, business requirements, and technical specifications.
            </p>

            {/* Readable Preview without inner border */}
            <div className="relative rounded-lg bg-white dark:bg-[#0a0b0e] p-3 font-mono text-xs text-slate-900 dark:text-slate-200 leading-relaxed">
              <p
                className={`whitespace-pre-wrap break-words ${
                  !isContextExpanded && isContextLong ? "line-clamp-4" : ""
                }`}
              >
                {currentContextPrompt}
              </p>

              {isContextLong && (
                <div className="pt-2 mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsContextExpanded(!isContextExpanded)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isContextExpanded ? "Show less" : "Show full Context prompt"}</span>
                    {isContextExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer / Primary Copy Combined Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Combined prompt ready for LLM generation</span>
              <span>•</span>
              <span>UI + Context structured</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {isCustomizeOpen && (
                <Button
                  onClick={() => setIsManuallyExpanded(false)}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  title="Shrink prompt panel"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Shrink Panel</span>
                </Button>
              )}

              {/* Primary Copy Prompt Button (Combines Both Prompts) */}
              <Button
                onClick={handleCopyCombined}
                variant="default"
                size="default"
                className={`gap-2 font-semibold shadow-md min-w-[160px] transition-all ${
                  copiedCombined
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
                aria-live="polite"
              >
                {copiedCombined ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Copied Full Prompt!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

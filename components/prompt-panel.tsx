"use client";

import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PromptPanelProps {
  templateId: string;
  originalPrompt: string;
  isCustomizeOpen?: boolean;
  onCustomizeClick: () => void;
  onCopySuccess: () => void;
}

export function PromptPanel({
  templateId,
  originalPrompt,
  isCustomizeOpen = false,
  onCustomizeClick,
  onCopySuccess,
}: PromptPanelProps) {
  const { activeCustomizedPrompts, customizationHistory, revertToOriginal } = useDemo();
  const [copied, setCopied] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);

  // When isCustomizeOpen changes, reset manual expansion state
  useEffect(() => {
    setIsManuallyExpanded(false);
  }, [isCustomizeOpen]);

  // Active prompt is either the customized one or the original
  const customizedPrompt = activeCustomizedPrompts[templateId];
  const activePromptText = customizedPrompt || originalPrompt;
  const isCustomized = !!customizedPrompt;
  const history = customizationHistory[templateId] || [];

  const isShrunk = isCustomizeOpen && !isManuallyExpanded;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activePromptText);
      }
    } catch (e) {
      console.warn("Clipboard write failed, using fallback:", e);
    }
    setCopied(true);
    onCopySuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] transition-all duration-300 overflow-hidden shadow-xl"
    >
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          {isCustomized ? (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 font-semibold uppercase tracking-wider text-[11px]"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>{isShrunk ? "Customized Prompt" : "Your Customized Prompt"}</span>
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 font-semibold uppercase tracking-wider text-[11px]"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
              <span>{isShrunk ? "Base Prompt" : "Original Expert Prompt"}</span>
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
              title="Revert to unmodified admin expert prompt (0 credits charged)"
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
            <Sparkles className={`h-3.5 w-3.5 ${isCustomizeOpen ? "text-amber-500" : "text-slate-500 dark:text-zinc-400"}`} />
            <span>{isCustomizeOpen ? "Close Customizer" : "Customize with AI"}</span>
          </Button>
        </div>
      </div>

      {/* Shrunk vs Full Prompt Body */}
      {isShrunk ? (
        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between gap-3 text-xs border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase font-bold shrink-0">
              Prompt:
            </span>
            <p className="font-mono text-xs text-slate-800 dark:text-slate-200 line-clamp-1 truncate selection:bg-slate-200 selection:text-slate-900 dark:selection:bg-zinc-700 dark:selection:text-white">
              {activePromptText}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleCopy}
              variant={copied ? "default" : "default"}
              size="sm"
              className={copied ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold" : "bg-indigo-600 hover:bg-indigo-700 text-white font-bold"}
              title="Copy base prompt"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsManuallyExpanded(true)}
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              title="Expand prompt to full view"
            >
              <span>Expand</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 bg-white dark:bg-transparent">
          <div className="relative rounded-xl bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 border border-slate-200 dark:border-slate-800/90 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed break-words selection:bg-slate-200 selection:text-slate-900 dark:selection:bg-zinc-700 dark:selection:text-white shadow-inner">
            <p className="whitespace-pre-wrap">{activePromptText}</p>
          </div>

          {/* Footer / Copy button row */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Finished ready-to-use prompt</span>
              <span>•</span>
              <span>Zero placeholders</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {isCustomizeOpen && (
                <Button
                  onClick={() => setIsManuallyExpanded(false)}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  title="Shrink base prompt"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Shrink Prompt</span>
                </Button>
              )}

              <Button
                onClick={handleCopy}
                variant="default"
                size="default"
                className={`gap-2 font-semibold shadow-md ${
                  copied
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
                aria-live="polite"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Copied to Clipboard!</span>
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

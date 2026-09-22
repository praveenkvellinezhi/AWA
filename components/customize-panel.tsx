"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Coins,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  History,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  Layout,
  FileText,
  Sliders,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { simulateVoiceTranscription } from "@/lib/ai-simulation";
import {
  refinePromptsWithAI,
  splitCombinedPrompt,
  getTemplatePrompts,
} from "@/lib/prompt-utils";

interface CustomizePanelProps {
  templateId: string;
  uiPrompt?: string;
  contextPrompt?: string;
  originalPrompt?: string; // Maintained for backward compatibility
  onClose?: () => void;
}

export function CustomizePanel({
  templateId,
  uiPrompt,
  contextPrompt,
  originalPrompt,
  onClose,
}: CustomizePanelProps) {
  const {
    credits,
    consumeCredit,
    recordCustomization,
    activeCustomizedPrompts,
    customizationHistory,
    revertToOriginal,
    switchCustomizationVersion,
    simulateAIFailure,
    adminConfig,
  } = useDemo();

  const [requestText, setRequestText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCustom, setCopiedCustom] = useState(false);
  const [copiedRefinedUi, setCopiedRefinedUi] = useState(false);
  const [copiedRefinedContext, setCopiedRefinedContext] = useState(false);

  // Resolve base prompts from props or fallback
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

  const activeCustomized = activeCustomizedPrompts[templateId];
  const versions = customizationHistory[templateId] || [];

  // Parse active customized prompt into UI and Context sections if available
  const parsedActiveCustomized = useMemo(() => {
    if (!activeCustomized) return null;
    return splitCombinedPrompt(activeCustomized);
  }, [activeCustomized]);

  // Voice recording simulation
  const handleVoiceInput = async () => {
    if (!adminConfig.voiceCustomizationEnabled) return;
    setIsListening(true);
    setErrorMessage(null);
    try {
      const transcription = await simulateVoiceTranscription(templateId);
      setRequestText(transcription);
    } catch (e) {
      setErrorMessage("Could not transcribe voice. Please type your request.");
    } finally {
      setIsListening(false);
    }
  };

  // Submit AI rewrite request targeting both UI Prompt and Context Prompt
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!requestText.trim()) return;

    // Check credits boundary (FEAT-016)
    if (credits <= 0) {
      setErrorMessage("You have 0 customization credits remaining. Please top up credits.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      // Refine both UI Prompt and Context Prompt using the reusable mechanism
      const result = await refinePromptsWithAI(
        basePrompts.uiPrompt,
        basePrompts.contextPrompt,
        requestText,
        { simulateError: simulateAIFailure }
      );

      if (!result.success || !result.customizedPrompt) {
        setErrorMessage(result.error || "We couldn't customize the prompts. Please try again.");
        return;
      }

      // Deduct exactly 1 credit on confirmed success (FEAT-015)
      consumeCredit();

      // Record in session version history (FEAT-014)
      recordCustomization(templateId, requestText, result.customizedPrompt);
    } catch (err) {
      setErrorMessage("An unexpected error occurred while refining the prompts.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCustomized = async () => {
    if (!activeCustomized) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeCustomized);
      }
    } catch (e) {
      console.warn("Clipboard failed:", e);
    }
    setCopiedCustom(true);
    setTimeout(() => setCopiedCustom(false), 2000);
  };

  const handleCopyRefinedUi = async () => {
    if (!parsedActiveCustomized?.uiPrompt) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(parsedActiveCustomized.uiPrompt);
      }
    } catch (e) {
      console.warn("Clipboard failed:", e);
    }
    setCopiedRefinedUi(true);
    setTimeout(() => setCopiedRefinedUi(false), 2000);
  };

  const handleCopyRefinedContext = async () => {
    if (!parsedActiveCustomized?.contextPrompt) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(parsedActiveCustomized.contextPrompt);
      }
    } catch (e) {
      console.warn("Clipboard failed:", e);
    }
    setCopiedRefinedContext(true);
    setTimeout(() => setCopiedRefinedContext(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-awa-card dark:to-slate-950 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Prompt Customizer
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                1 CREDIT PER RUN
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Refines both the UI Prompt and Context Prompt using your natural language directions.
            </p>
          </div>
        </div>

        {/* Credit Meter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold">
            <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>{credits} Credits Remaining</span>
          </div>

          {credits <= 0 && (
            <Link
              href="/credits"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Get More Credits
            </Link>
          )}
        </div>
      </div>

      {/* Credit Exhaustion Guard */}
      {credits <= 0 ? (
        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
          <Coins className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200">
            No Customization Credits Remaining
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            You can still read, copy, and use both original prompts without restriction. To generate refined AI prompt versions, please top up credits.
          </p>
          <div className="pt-2">
            <Link
              href="/credits"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>Buy 10 Credits (₹49)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Active Customization Form */
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              How would you like to modify the UI and Context?
            </label>
            <div className="relative">
              <textarea
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="e.g. Switch theme to deep cyber neon with holographic cards, and add Stripe enterprise billing with annual discount switcher..."
                rows={3}
                disabled={isGenerating || isListening}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 p-3.5 pr-14 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-slate-400 dark:focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-500 transition-all resize-none"
              />

              {/* Voice Input Button */}
              {adminConfig.voiceCustomizationEnabled && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={isGenerating || isListening}
                  title="Speak your change request (Voice Input)"
                  className={`absolute right-3 top-3 p-2 rounded-lg border transition-all ${
                    isListening
                      ? "bg-rose-600 text-white border-rose-500 animate-voice-pulse"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  )}
                </button>
              )}
            </div>

            {/* Voice listening status */}
            {isListening && (
              <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1.5 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Listening to speech... Transcribing request...
              </p>
            )}
          </div>

          {/* Error Message with Try Again button */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shrink-0"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>UI specifics update in UI Prompt; business &amp; tech logic update in Context Prompt.</span>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !requestText.trim() || isListening}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Customizing both prompts...</span>
                </>
              ) : (
                <span>Generate Customized Prompts</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Generated Result Area */}
      {activeCustomized && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Active Refined Prompts
            </span>

            {/* Version History Selector */}
            {versions.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <History className="h-3.5 w-3.5 text-slate-400" />
                <span>Version History:</span>
                <select
                  onChange={(e) => switchCustomizationVersion(templateId, e.target.value)}
                  className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 rounded px-2 py-1 focus:outline-none"
                  defaultValue={versions[0]?.id}
                >
                  {versions.map((ver) => (
                    <option key={ver.id} value={ver.id}>
                      v{ver.versionNumber} ({ver.requestText.slice(0, 24)}...)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Structured Result Display */}
          {parsedActiveCustomized && parsedActiveCustomized.uiPrompt && parsedActiveCustomized.contextPrompt ? (
            <div className="space-y-3">
              {/* Refined UI Prompt Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Layout className="h-3 w-3" />
                    [REFINED UI PROMPT]
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRefinedUi}
                    className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  >
                    {copiedRefinedUi ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedRefinedUi ? "Copied UI" : "Copy UI"}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-900 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                  {parsedActiveCustomized.uiPrompt}
                </p>
              </div>

              {/* Refined Context Prompt Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <FileText className="h-3 w-3" />
                    [REFINED CONTEXT PROMPT]
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRefinedContext}
                    className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  >
                    {copiedRefinedContext ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedRefinedContext ? "Copied Context" : "Copy Context"}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-900 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                  {parsedActiveCustomized.contextPrompt}
                </p>
              </div>
            </div>
          ) : (
            /* Fallback single card if unstructured */
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed break-words shadow-inner">
              <p className="whitespace-pre-wrap">{activeCustomized}</p>
            </div>
          )}

          {/* Result Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 text-xs">
            <button
              type="button"
              onClick={() => revertToOriginal(templateId)}
              className="flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors py-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
              <span>Revert to original prompts</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCustomized}
              className={`px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                copiedCustom
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              }`}
            >
              {copiedCustom ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Copied Refined Prompt!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Refined Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

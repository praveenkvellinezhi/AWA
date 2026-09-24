"use client";

import React, { useEffect, useCallback, useState } from "react";
import {
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Lightbulb,
  Sparkles,
  BookOpen,
  Copy,
  Terminal,
  Sliders,
} from "lucide-react";
import { GuideStep } from "@/lib/types";

export interface StepDetailModalProps {
  step: GuideStep | null;
  stepIndex: number;
  totalSteps: number;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete?: (stepNumber: number) => void;
  onDoneAndConnect?: (stepIndex: number) => void;
  onPrevStep?: () => void;
  onNextStep?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  toolName?: string;
  onImageClick?: (img: { url: string; title: string; caption?: string }) => void;
}

/**
 * Helper to render text with formatted code snippets inside backticks (`code`)
 */
function FormattedStepText({ text }: { text?: string }) {
  if (!text) return null;

  // Split by backticks to highlight inline code/parameters
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          const codeContent = part.slice(1, -1);
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-cyan-300 font-mono text-[11px] sm:text-xs border border-slate-200 dark:border-slate-700/80 shadow-xs font-semibold"
            >
              {codeContent}
            </code>
          );
        }
        return (
          <span key={i} className="text-slate-800 dark:text-slate-200">
            {part}
          </span>
        );
      })}
    </p>
  );
}

/**
 * Formats AI prompt template text with highlighted bracketed variable tokens [VARIABLE]
 */
function FormattedPromptText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(\[[A-Z0-9\s/_\-–—]+\])/g);

  return (
    <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text break-words font-normal">
      {parts.map((part, i) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <span
              key={i}
              className="px-1.5 py-0.5 mx-0.5 rounded-md bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 font-semibold text-[11px] inline-block my-0.5"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </pre>
  );
}

export function StepDetailModal({
  step,
  stepIndex,
  totalSteps,
  isOpen,
  onClose,
  isCompleted,
  onToggleComplete,
  onDoneAndConnect,
  onPrevStep,
  onNextStep,
  hasPrev = false,
  hasNext = false,
  toolName = "AI Tool",
  onImageClick,
}: StepDetailModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPrompt = () => {
    if (!step?.prompt) return;
    navigator.clipboard.writeText(step.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle keyboard shortcuts (Escape to close, Left/Right arrows to navigate)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev && onPrevStep) {
        onPrevStep();
      } else if (e.key === "ArrowRight" && hasNext && onNextStep) {
        onNextStep();
      }
    },
    [onClose, hasPrev, hasNext, onPrevStep, onNextStep]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !step) return null;

  const stepNumberFormatted = step.step < 10 ? `0${step.step}` : `${step.step}`;

  const handleDoneClick = () => {
    if (onDoneAndConnect) {
      onDoneAndConnect(stepIndex);
      onClose();
    } else if (onToggleComplete) {
      onToggleComplete(step.step);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-dialog-surface relative w-full max-w-2xl bg-white dark:bg-[#0d121c] border border-slate-200 dark:border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/90 bg-slate-50 dark:bg-[#0f1422] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Step Number Badge */}
            <div
              className={`w-9 h-9 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-all ${
                isCompleted
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400/50"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepNumberFormatted}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate leading-tight">
                {step.title}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  Step {step.step} of {totalSteps}
                </span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 font-semibold">
                  {toolName} Pipeline
                </span>
                {step.promptCategory && (
                  <>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {step.promptCategory}
                    </span>
                  </>
                )}
                {isCompleted && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                    DONE ✓
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700/80 shrink-0"
            title="Close dialog (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* USABLE AI PROMPT SECTION (When prompt is available) */}
          {step.prompt && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white">
                  <Terminal className="h-4 w-4 text-cyan-500" />
                  <span>USABLE AI PROMPT</span>
                  {step.promptCategory && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                      {step.promptCategory}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm ${
                    isCopied
                      ? "bg-emerald-600 text-white shadow-emerald-600/30"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20 ring-1 ring-cyan-500/30 active:scale-95"
                  }`}
                  title="Copy prompt to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3] text-emerald-100" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-cyan-100" />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code block with syntax styling */}
              <div className="relative rounded-xl bg-slate-950 p-4 border border-slate-800 dark:border-cyan-500/30 shadow-inner group/code">
                <FormattedPromptText text={step.prompt} />
              </div>

              {/* Variables breakdown list */}
              {step.promptVariables && step.promptVariables.length > 0 && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    <Sliders className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Prompt Variables & Parameters ({step.promptVariables.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {step.promptVariables.map((v, vIdx) => (
                      <div
                        key={`var-${v.name}-${vIdx}`}
                        className="p-2 rounded-lg bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <code className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono text-[11px] font-bold">
                            {v.name}
                          </code>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                            {v.description}
                          </span>
                        </div>
                        {v.defaultValue && (
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 italic truncate max-w-[260px]">
                            Default: {v.defaultValue}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Detailed Instruction Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <BookOpen className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Directive & Workflow Objective</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 shadow-xs">
              <FormattedStepText
                text={
                  step.description ||
                  (step as any).instruction ||
                  (step as any).promptExcerpt ||
                  ""
                }
              />
            </div>
          </div>

          {/* Visual Guideline Benchmark Image (if available) */}
          {step.image && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Visual Reference Benchmark</span>
                </span>
                {step.imageCaption && (
                  <span className="text-[10px] text-slate-600 dark:text-zinc-400 truncate max-w-[200px] font-medium">
                    {step.imageCaption}
                  </span>
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 group/modalimg">
                <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/modalimg:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                  {onImageClick && (
                    <button
                      type="button"
                      data-overlay-badge
                      onClick={() =>
                        onImageClick({
                          url: step.image!,
                          title: step.title,
                          caption: step.imageCaption,
                        })
                      }
                      className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-mono flex items-center gap-1.5 border border-white/20 shadow-lg transition-colors"
                      title="Inspect reference in full size"
                    >
                      <Maximize2 className="h-3 w-3 text-cyan-300" />
                      <span className="text-white font-medium">Full View</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Helpful Tip Box (if available) */}
          {step.tip && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300/80 dark:border-amber-500/25 text-amber-950 dark:text-amber-200/95 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-amber-900 dark:text-amber-300 font-bold">Pro Tip & Best Practices</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-950 dark:text-amber-200/90 pl-6 font-medium">
                {step.tip}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800/90 bg-slate-50 dark:bg-[#0a0d15] flex items-center justify-between gap-3">
          {/* Previous / Next Step Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrevStep}
              disabled={!hasPrev}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-950 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white disabled:opacity-35 disabled:pointer-events-none border border-slate-300 dark:border-slate-700/80 transition-colors flex items-center gap-1 shadow-xs"
              title="Previous step"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              type="button"
              onClick={onNextStep}
              disabled={!hasNext}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-950 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white disabled:opacity-35 disabled:pointer-events-none border border-slate-300 dark:border-slate-700/80 transition-colors flex items-center gap-1 shadow-xs"
              title="Next step"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Complete / Done Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleDoneClick}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                isCompleted
                  ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400 shadow-sm dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 dark:text-emerald-300 dark:border-emerald-500/40"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/25 ring-1 ring-cyan-500/30"
              }`}
            >
              <Check className={`h-3.5 w-3.5 stroke-[2.5] ${isCompleted ? "text-emerald-800 dark:text-emerald-300" : "text-white"}`} />
              <span className={isCompleted ? "text-emerald-900 dark:text-emerald-300 font-bold" : "text-white font-bold"}>
                {isCompleted ? "Done ✓" : "Done"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

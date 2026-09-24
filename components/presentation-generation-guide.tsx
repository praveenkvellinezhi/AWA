"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Presentation,
  Layers,
  Lock,
  CheckCircle2,
  Check,
  ArrowRight,
  Copy,
  FileText,
  FileSpreadsheet,
  CheckCheck,
  Sliders,
  BarChart3,
  Lightbulb,
  Sparkles,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PresentationAsset,
  PresentationGenerationType,
  UsageStep,
  SlidePrompt,
  TemplateStep,
} from "@/lib/types";
import {
  getPresentationWorkflowTitle,
  getPresentationWorkflowDescription,
  defaultSlidePrompts,
} from "@/lib/presentation-guide-generator";
import { VisualStepGuide } from "@/components/visual-step-guide";

interface PresentationGenerationGuideProps {
  tool: string;
  generationType: PresentationGenerationType;
  presentationType?: string;
  assets?: PresentationAsset[];
  slideCount?: number;
  prompt?: string;
  outline?: string[];
  slides?: SlidePrompt[];
  steps: (UsageStep | TemplateStep)[];
  isSubscriber: boolean;
  completedSteps: number[];
  onToggleStep: (stepNumber: number) => void;
}

function FormattedSlidePrompt({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(\[[A-Z0-9\s/_\-–—]+\])/g);

  return (
    <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text break-words font-normal">
      {parts.map((part, i) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <span
              key={i}
              className="px-1.5 py-0.5 mx-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 font-semibold text-[11px]"
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

export function PresentationGenerationGuide({
  tool,
  generationType,
  presentationType,
  assets,
  slideCount,
  prompt,
  outline,
  slides,
  steps,
  isSubscriber,
  completedSteps,
  onToggleStep,
}: PresentationGenerationGuideProps) {
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [expandedSlideIndex, setExpandedSlideIndex] = useState<number | null>(0);
  const [copiedSlideIndex, setCopiedSlideIndex] = useState<number | null>(null);
  const [copiedAllSlides, setCopiedAllSlides] = useState(false);

  const effectiveSlides = slides && slides.length > 0 ? slides : defaultSlidePrompts;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const handleCopySlide = (promptText: string, idx: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedSlideIndex(idx);
    setTimeout(() => setCopiedSlideIndex(null), 2000);
  };

  const handleCopyAllSlides = () => {
    const combined = effectiveSlides
      .map(
        (s) =>
          `=== Slide ${String(s.slideNumber).padStart(2, "0")}: ${s.title} ===\n${s.prompt}\n`
      )
      .join("\n\n");
    navigator.clipboard.writeText(combined);
    setCopiedAllSlides(true);
    setTimeout(() => setCopiedAllSlides(false), 2000);
  };

  const workflowTitle = getPresentationWorkflowTitle(generationType);
  const workflowDescription = getPresentationWorkflowDescription(generationType, tool);
  const hasOutline = outline && outline.length > 0;

  return (
    <div className="space-y-6">
      {/* 1. Header & Workflow Meta */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Presentation className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Step-by-Step Guide for {tool}</span>
            </h2>

            {/* Workflow Type Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-mono tracking-wider uppercase">
              <Sliders className="h-3 w-3" />
              <span>{workflowTitle}</span>
            </span>

            {/* Presentation Type Badge */}
            {presentationType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-[10px] font-bold text-teal-700 dark:text-teal-300 font-mono tracking-wider uppercase">
                {presentationType}
              </span>
            )}

            {/* Slide Count Badge */}
            {slideCount && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono font-bold text-slate-700 dark:text-zinc-300">
                📄 {slideCount} Slides
              </span>
            )}

            {/* Subscriber Status Badge */}
            {!isSubscriber ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-700 dark:text-amber-300 font-mono tracking-wider uppercase">
                <Lock className="h-3 w-3" />
                <span>Subscribers Only</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-mono tracking-wider uppercase">
                <CheckCircle2 className="h-3 w-3" />
                <span>
                  Checklist ({completedSteps.filter((id) => steps.some((s) => s.stepNumber === id)).length}/{steps.length})
                </span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed max-w-3xl">
            {isSubscriber
              ? workflowDescription
              : `Tailored ${tool} slide-by-slide instructions and layout refinements are protected for active subscribers.`}
          </p>
        </div>
      </div>

      {/* 2. Dynamic Required Assets Section (When Assets Exist) */}
      {assets && assets.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Required Source Materials & Assets ({assets.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
              Prepare or upload these source files in {tool} before generating slides
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assets.map((asset, aIdx) => (
              <div
                key={`pres-asset-${asset.id || aIdx}-${aIdx}`}
                className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#121316] border border-slate-200 dark:border-zinc-800 shadow-sm"
              >
                <div className="relative w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center justify-center">
                  {asset.fileFormat?.includes("CSV") || asset.fileFormat?.includes("Excel") ? (
                    <FileSpreadsheet className="h-6 w-6" />
                  ) : asset.type === "logo" ? (
                    <Layers className="h-6 w-6" />
                  ) : (
                    <FileText className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {asset.label}
                    </h4>
                    {asset.required ? (
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        REQUIRED
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                        OPTIONAL
                      </span>
                    )}
                  </div>
                  {asset.fileFormat && (
                    <span className="inline-block text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Format: {asset.fileFormat}
                    </span>
                  )}
                  {asset.description && (
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {asset.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Slide Outline Structure Blueprint (When Outline Exists) */}
      {hasOutline && (
        <div className="rounded-2xl border border-emerald-200/60 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/10 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Slide Outline Sequence ({outline.length} Slides)
              </h3>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
              Verify that {tool} maintains this exact narrative order
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {outline.map((slideTitle, idx) => (
              <div
                key={`pres-outline-${idx}-${slideTitle}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#121316] border border-emerald-200 dark:border-emerald-900/50 shadow-sm text-xs font-semibold text-slate-800 dark:text-zinc-200"
              >
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="truncate max-w-[200px]">{slideTitle}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Step-by-Step Instructions (Visual Workflow Canvas) */}
      <VisualStepGuide
        category="presentation"
        tool={tool}
        steps={steps}
        prompt={prompt}
        isSubscriber={isSubscriber}
        completedSteps={completedSteps}
        onToggleStep={onToggleStep}
      />

      {/* 5. Individual Slide Prompts (Dedicated Slide-by-Slide Generator) */}
      {effectiveSlides.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Dedicated Slide-by-Slide Prompts ({effectiveSlides.length} Slides)
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                Every individual slide has its own copyable, production-ready AI prompt tailored for {tool}.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyAllSlides}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0 self-start sm:self-auto"
              title="Copy all individual slide prompts as a sequenced bundle"
            >
              {copiedAllSlides ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3] text-emerald-100" />
                  <span>Copied All {effectiveSlides.length} Slides!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-emerald-100" />
                  <span>Copy All Slide Prompts</span>
                </>
              )}
            </button>
          </div>

          {/* Slide List Accordion */}
          <div className="space-y-2.5">
            {effectiveSlides.map((slide, sIdx) => {
              const isExpanded = expandedSlideIndex === sIdx;
              const isCopied = copiedSlideIndex === sIdx;
              const slideNumFormatted = String(slide.slideNumber || sIdx + 1).padStart(2, "0");

              return (
                <div
                  key={`slide-prompt-${slide.slideNumber}-${sIdx}`}
                  className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] overflow-hidden transition-all shadow-sm hover:border-slate-300 dark:hover:border-zinc-700"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => setExpandedSlideIndex(isExpanded ? null : sIdx)}
                    className="px-4 py-3 flex items-center justify-between gap-3 cursor-pointer select-none bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                        {slideNumFormatted}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {slide.title}
                      </span>
                      {slide.layout && (
                        <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 shrink-0">
                          {slide.layout}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopySlide(slide.prompt, sIdx);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono flex items-center gap-1 transition-all ${
                          isCopied
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700"
                        }`}
                        title="Copy this slide prompt"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 stroke-[3]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>

                      <div className="p-1 text-slate-400 dark:text-zinc-500">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-200 dark:border-zinc-800 space-y-3 bg-white dark:bg-[#0f1013] animate-in fade-in duration-150">
                      {slide.purpose && (
                        <div className="text-xs text-slate-600 dark:text-zinc-400 flex items-start gap-2">
                          <span className="font-semibold text-slate-800 dark:text-zinc-300 font-mono text-[11px] shrink-0">
                            Objective:
                          </span>
                          <span className="leading-relaxed">{slide.purpose}</span>
                        </div>
                      )}

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 dark:border-emerald-500/20 shadow-inner">
                        <FormattedSlidePrompt text={slide.prompt} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

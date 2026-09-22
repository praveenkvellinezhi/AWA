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
} from "lucide-react";
import {
  PresentationAsset,
  PresentationGenerationType,
  UsageStep,
} from "@/lib/types";
import {
  getPresentationWorkflowTitle,
  getPresentationWorkflowDescription,
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
  steps: UsageStep[];
  isSubscriber: boolean;
  completedSteps: number[];
  onToggleStep: (stepNumber: number) => void;
}

export function PresentationGenerationGuide({
  tool,
  generationType,
  presentationType,
  assets,
  slideCount,
  prompt,
  outline,
  steps,
  isSubscriber,
  completedSteps,
  onToggleStep,
}: PresentationGenerationGuideProps) {
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
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

      {/* 4. Step-by-Step Instructions (Visual 4-Column Grid) */}
      <VisualStepGuide
        category="presentation"
        tool={tool}
        steps={steps}
        prompt={prompt}
        isSubscriber={isSubscriber}
        completedSteps={completedSteps}
        onToggleStep={onToggleStep}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Layers,
  Lock,
  CheckCircle2,
  Check,
  ArrowRight,
  Copy,
  Monitor,
  Smartphone,
  Tablet,
  FileCode,
  ExternalLink,
  Code2,
  CheckCheck,
} from "lucide-react";
import {
  WebsiteAsset,
  WebsiteGenerationType,
  UsageStep,
  TemplateStep,
} from "@/lib/types";
import {
  getWebsiteWorkflowTitle,
  getWebsiteWorkflowDescription,
} from "@/lib/website-guide-generator";
import { VisualStepGuide } from "@/components/visual-step-guide";

interface WebsiteGenerationGuideProps {
  tool: string;
  generationType: WebsiteGenerationType;
  assets?: WebsiteAsset[];
  projectType?: string;
  techStack?: string[];
  pages?: string[];
  features?: string[];
  prompt?: string;
  steps: (UsageStep | TemplateStep)[];
  isSubscriber: boolean;
  completedSteps: number[];
  onToggleStep: (stepNumber: number) => void;
}

export function WebsiteGenerationGuide({
  tool,
  generationType,
  assets,
  projectType,
  techStack,
  pages,
  features,
  prompt,
  steps,
  isSubscriber,
  completedSteps,
  onToggleStep,
}: WebsiteGenerationGuideProps) {
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const workflowTitle = getWebsiteWorkflowTitle(generationType);
  const workflowDescription = getWebsiteWorkflowDescription(generationType, tool);
  const hasMultiplePages = pages && pages.length > 1;

  return (
    <div className="space-y-6">
      {/* 1. Header & Workflow Meta */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Step-by-Step Guide for {tool}</span>
            </h2>

            {/* Workflow Type Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-bold text-blue-700 dark:text-blue-300 font-mono tracking-wider uppercase">
              <Code2 className="h-3 w-3" />
              <span>{workflowTitle}</span>
            </span>

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
              : `Tailored ${tool} step-by-step instructions and prompt refinements are protected for active subscribers.`}
          </p>
        </div>

        {/* Tech Stack Pills */}
        {techStack && techStack.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Stack:</span>
            {techStack.map((tech, idx) => (
              <span
                key={`tech-${idx}-${tech}`}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. Dynamic Required Assets Section (When Assets Exist) */}
      {assets && assets.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Required Tutorial Assets ({assets.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
              Prepare or upload these inputs in {tool} before starting generation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assets.map((asset, aIdx) => (
              <div
                key={`web-asset-${asset.id || aIdx}-${aIdx}`}
                className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#121316] border border-slate-200 dark:border-zinc-800 shadow-sm"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shrink-0 flex items-center justify-center">
                  {asset.url ? (
                    <img
                      src={asset.url}
                      alt={asset.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileCode className="h-6 w-6 text-slate-400 dark:text-zinc-500" />
                  )}
                  {asset.role && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white font-mono text-center truncate py-0.5 px-1">
                      {asset.role}
                    </span>
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
                  {asset.description && (
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {asset.description}
                    </p>
                  )}
                  {asset.dimensions && (
                    <span className="inline-block text-[10px] font-mono text-slate-500 dark:text-zinc-500">
                      📐 {asset.dimensions}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Multi-Page Architecture Blueprint (When Project has Multiple Pages) */}
      {hasMultiplePages && (
        <div className="rounded-2xl border border-blue-200/60 dark:border-blue-950/60 bg-blue-50/40 dark:bg-blue-950/10 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Page Structure Architecture ({pages.length} Pages)
              </h3>
            </div>
            <span className="text-[11px] text-blue-700 dark:text-blue-300">
              Ensure consistent navigation & design system tokens across all pages
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {pages.map((page, idx) => (
              <div
                key={`page-${idx}-${page}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#121316] border border-blue-200 dark:border-blue-900/50 shadow-sm text-xs font-semibold text-slate-800 dark:text-zinc-200"
              >
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                  0{idx + 1}
                </span>
                <span>{page}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Step-by-Step Instructions (Visual 4-Column Grid) */}
      <VisualStepGuide
        category="website"
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

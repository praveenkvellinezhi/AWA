"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Palette,
  Layers,
  Lock,
  CheckCircle2,
  Check,
  ArrowRight,
  Copy,
  FileImage,
  Sliders,
  Lightbulb,
  Maximize2,
  ShieldCheck,
  Type,
  LayoutGrid,
} from "lucide-react";
import {
  DesignAsset,
  DesignGenerationType,
  DesignDimensions,
  UsageStep,
} from "@/lib/types";
import {
  getDesignWorkflowTitle,
  getDesignWorkflowDescription,
} from "@/lib/design-guide-generator";
import { VisualStepGuide } from "@/components/visual-step-guide";

interface DesignGenerationGuideProps {
  tool: string;
  generationType: DesignGenerationType;
  designType?: string;
  assets?: DesignAsset[];
  format?: string;
  dimensions?: DesignDimensions;
  brandAssets?:
    | boolean
    | {
        logo?: string;
        colors?: string[];
        fonts?: string[];
        guidelines?: string;
      };
  requiresTextVerification?: boolean;
  requiresProductAccuracyCheck?: boolean;
  requiresBrandCheck?: boolean;
  requiresMultiFormatResize?: boolean;
  multiFormats?: string[];
  prompt?: string;
  steps: UsageStep[];
  isSubscriber: boolean;
  completedSteps: number[];
  onToggleStep: (stepNumber: number) => void;
}

export function DesignGenerationGuide({
  tool,
  generationType,
  designType,
  assets,
  format,
  dimensions,
  brandAssets,
  requiresTextVerification,
  requiresProductAccuracyCheck,
  requiresBrandCheck,
  requiresMultiFormatResize,
  multiFormats,
  prompt,
  steps,
  isSubscriber,
  completedSteps,
  onToggleStep,
}: DesignGenerationGuideProps) {
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const workflowTitle = getDesignWorkflowTitle(generationType);
  const workflowDescription = getDesignWorkflowDescription(generationType, tool);

  const brandObj = typeof brandAssets === "object" ? brandAssets : null;

  return (
    <div className="space-y-6">
      {/* 1. Header & Workflow Meta */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-rose-500 dark:text-rose-400 shrink-0" />
              <span>Step-by-Step Guide for {tool}</span>
            </h2>

            {/* Workflow Type Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-700 dark:text-rose-300 font-mono tracking-wider uppercase">
              <Sliders className="h-3 w-3" />
              <span>{workflowTitle}</span>
            </span>

            {/* Design Type Badge */}
            {designType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-bold text-pink-700 dark:text-pink-300 font-mono tracking-wider uppercase">
                {designType}
              </span>
            )}

            {/* Format / Dimensions Badge */}
            {format && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono font-bold text-slate-700 dark:text-zinc-300">
                📐 {format}
              </span>
            )}

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

          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 max-w-3xl leading-relaxed">
            {isSubscriber
              ? workflowDescription
              : `Tailored ${tool} step-by-step instructions are protected for active subscribers.`}
          </p>
        </div>
      </div>

      {/* 2. Required Source Materials & Assets (Conditional) */}
      {assets && assets.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Required Design Assets ({assets.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
              Prepare these image/vector inputs before opening {tool}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assets.map((asset, aIdx) => (
              <div
                key={`design-asset-${asset.id || aIdx}-${aIdx}`}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#121316] border border-slate-200 dark:border-zinc-800 shadow-sm"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shrink-0 flex items-center justify-center">
                  {asset.type === "logo" ? (
                    <Layers className="h-6 w-6 text-rose-500 dark:text-rose-400" />
                  ) : (
                    <FileImage className="h-6 w-6 text-slate-400 dark:text-zinc-500" />
                  )}
                  {asset.role && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-white font-mono text-center truncate py-0.5 px-1">
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

                  {(asset.format || asset.dimensions) && (
                    <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                      {asset.format && <span>📁 {asset.format}</span>}
                      {asset.dimensions && <span>📐 {asset.dimensions}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Brand Identity Specifications (Conditional) */}
      {(brandObj || requiresBrandCheck) && (
        <div className="rounded-2xl border border-pink-200/60 dark:border-pink-900/40 bg-pink-50/40 dark:bg-pink-950/10 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-pink-200 uppercase tracking-wider font-mono">
              Brand Identity Guidelines & Tokens
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Logo rules */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#121316] border border-pink-200/50 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Logo Lockup
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-zinc-200">
                {brandObj?.logo || "Vector SVG / Transparent PNG Lockup with 24px Clearspace"}
              </p>
            </div>

            {/* Colors */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#121316] border border-pink-200/50 dark:border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Color Palette
              </span>
              {brandObj?.colors && brandObj.colors.length > 0 ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {brandObj.colors.map((c, idx) => {
                    const hexMatch = c.match(/#[0-9A-Fa-f]{6}/);
                    const hex = hexMatch ? hexMatch[0] : "#333";
                    return (
                      <span
                        key={`brand-color-${idx}-${c}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{c}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-700 dark:text-zinc-300">
                  Primary Brand Hex + Neutral Background + High-Contrast Accents
                </p>
              )}
            </div>

            {/* Typography */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#121316] border border-pink-200/50 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Typography Hierarchy
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-zinc-200">
                {brandObj?.fonts?.join(" • ") || "Display Headline Font + Clean Grotesque Body Copy"}
              </p>
            </div>
          </div>

          {brandObj?.guidelines && (
            <p className="text-xs text-slate-600 dark:text-zinc-400 italic">
              💡 {brandObj.guidelines}
            </p>
          )}
        </div>
      )}

      {/* 4. Multi-Format Campaign Formats (Conditional) */}
      {(multiFormats && multiFormats.length > 0) || requiresMultiFormatResize ? (
        <div className="rounded-2xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/10 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-indigo-200 uppercase tracking-wider font-mono">
              Campaign Target Formats & Safe Margins
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(multiFormats || [
              "Instagram Square Post (1:1 — 1080×1080px)",
              "Instagram Story / Reel (9:16 — 1080×1920px)",
              "Facebook / Web Banner (16:9 — 1200×630px)",
            ]).map((fmt, fIdx) => (
              <div
                key={`multi-format-${fIdx}-${fmt}`}
                className="p-3 rounded-xl bg-white dark:bg-[#121316] border border-indigo-200/50 dark:border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Format {fIdx + 1}
                  </span>
                  <Maximize2 className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <p className="text-[11px] font-mono text-indigo-700 dark:text-indigo-300">
                  {fmt}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 5. Interactive Numbered Steps (Visual 4-Column Grid) */}
      <VisualStepGuide
        category="design"
        tool={tool}
        steps={steps}
        prompt={prompt}
        dimensions={dimensions ? `${dimensions.width}×${dimensions.height}${dimensions.unit || "px"}` : undefined}
        aspectRatio={dimensions?.aspectRatio}
        isSubscriber={isSubscriber}
        completedSteps={completedSteps}
        onToggleStep={onToggleStep}
      />
    </div>
  );
}

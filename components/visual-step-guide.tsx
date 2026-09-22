import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Lock,
  ArrowRight,
  CheckCircle2,
  Maximize2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { UsageStep } from "@/lib/types";

export type GuideCategory =
  | "video"
  | "design"
  | "poster"
  | "website"
  | "presentation"
  | "image"
  | "general";

interface VisualStepGuideProps {
  category?: GuideCategory | string;
  tool: string;
  steps: UsageStep[];
  prompt?: string;
  templateThumbnail?: string;
  aspectRatio?: string;
  dimensions?: string;
  duration?: string;
  isSubscriber: boolean;
  completedSteps: number[];
  onToggleStep: (stepNumber: number) => void;
  subtitle?: string;
}

export function VisualStepGuide({
  category = "general",
  tool,
  steps,
  prompt = "",
  templateThumbnail,
  aspectRatio,
  dimensions,
  duration = "5s",
  isSubscriber,
  completedSteps,
  onToggleStep,
  subtitle,
}: VisualStepGuideProps) {
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    caption?: string;
  } | null>(null);

  return (
    <div className="space-y-4">
      {/* Optional Subtitle Header */}
      {subtitle && (
        <div className="flex items-center justify-between pb-1">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
            {subtitle}
          </p>
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
            {steps.length} Steps Total
          </span>
        </div>
      )}

      {/* Gated Content for Free Users vs Interactive Visual Grid for Subscribers */}
      {!isSubscriber ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 p-6 sm:p-8">
          {/* Blurred Background Preview of the 4-column cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 filter blur-[5px] opacity-35 pointer-events-none select-none"
            aria-hidden="true"
          >
            {steps.slice(0, 8).map((step, idx) => (
              <div
                key={`blurred-step-${idx}-${step.stepNumber || idx + 1}`}
                className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-5 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 text-sm font-semibold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-700 rounded" />
                    <div className="h-3 w-36 bg-slate-100 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
                {step.imageUrl && (
                  <div className="h-28 w-full bg-slate-200 dark:bg-zinc-800 rounded-xl" />
                )}
              </div>
            ))}
          </div>

          {/* Centered Lock Box */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-white/95 via-white/90 to-white/70 dark:from-[#121316] dark:via-[#121316]/95 dark:to-[#121316]/70">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 mb-3 shadow-lg shadow-amber-500/5">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-amber-200">
              {tool} Step-by-Step Guide is for Subscribers Only
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-md leading-relaxed">
              Upgrade to unlock the complete {steps.length}-step {tool} visual workflow, exact generative prompt directives, and visual reference benchmarks.
            </p>
            <Link
              href="/unlimited"
              className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99]"
            >
              <span>Subscribe to Unlock</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* The 4-Column Responsive Grid with Guideline Images */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step, idx) => {
            const stepNum = step.stepNumber || idx + 1;
            const isCompleted = completedSteps.includes(stepNum);

            return (
              <div
                key={`visual-step-${idx}-${stepNum}`}
                onClick={() => onToggleStep(stepNum)}
                className={`rounded-2xl border transition-all cursor-pointer select-none p-5 group flex flex-col justify-between ${
                  isCompleted
                    ? "bg-emerald-500/5 dark:bg-emerald-950/15 border-emerald-500/30 shadow-sm"
                    : "bg-white dark:bg-[#121316] border-slate-200 dark:border-zinc-800/90 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    {/* Step Number Circle */}
                    <div
                      title={isCompleted ? "Click to mark incomplete" : "Click to mark completed"}
                      className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                          : "bg-[#f5f1eb] dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 group-hover:bg-[#ebe5dd] dark:group-hover:bg-zinc-700"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4 stroke-[2.5]" /> : stepNum}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <h3
                          className={`text-sm sm:text-base font-bold transition-colors leading-snug break-words ${
                            isCompleted
                              ? "text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-500/50"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {step.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-[9px] font-bold font-mono text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                            DONE
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs mt-1.5 leading-relaxed break-words ${
                          isCompleted
                            ? "text-slate-400 dark:text-zinc-500"
                            : "text-slate-600 dark:text-zinc-300"
                        }`}
                      >
                        {step.instruction}
                      </p>
                    </div>
                  </div>

                  {/* Visual Reference Guideline Image for this Step */}
                  {step.imageUrl && (
                    <div className="mt-3 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 group/img">
                      <div className="relative h-32 sm:h-36 w-full overflow-hidden">
                        <img
                          src={step.imageUrl}
                          alt={step.title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                          <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-white border border-white/10">
                            {step.imageCaption || "Visual Guideline"}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage({
                                url: step.imageUrl!,
                                title: step.title,
                                caption: step.imageCaption,
                              });
                            }}
                            className="pointer-events-auto p-1 rounded-md bg-black/60 hover:bg-black/90 text-white/90 hover:text-white transition-colors border border-white/15"
                            title="Expand guideline image"
                          >
                            <Maximize2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step Pro Tip Callout */}
                  {step.tip && (
                    <div className="mt-2 text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">💡</span>
                      <span className="leading-tight">{step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal for Guideline Image Inspection */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  {lightboxImage.caption || "Guideline Reference"}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-xs text-zinc-300 font-medium truncate max-w-xs sm:max-w-md">
                  {lightboxImage.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="p-2 sm:p-4 flex items-center justify-center bg-black/60 overflow-hidden flex-1">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

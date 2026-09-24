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
import { mapToGuideSteps } from "@/lib/category-guide-config";
import { AnimatedWorkflowGuide } from "@/components/animated-workflow-guide";

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
              className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-[0.99]"
            >
              <span>Subscribe to Unlock</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <AnimatedWorkflowGuide
          key={`${tool}-${category}-${steps.length}`}
          steps={mapToGuideSteps(steps)}
          category={String(category)}
          tool={tool}
          completedSteps={completedSteps}
          onToggleStep={onToggleStep}
          onImageClick={(img) => setLightboxImage(img)}
        />
      )}

      {/* Lightbox Modal for Guideline Image Inspection */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark-surface relative max-w-3xl w-full bg-slate-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-cyan-400" />
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

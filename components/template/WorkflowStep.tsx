"use client";

import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lightbulb,
  Maximize2,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  HelpCircle,
} from "lucide-react";
import { TemplateStep } from "@/lib/types";

export interface WorkflowStepProps {
  step: TemplateStep;
  mode?: "user" | "admin" | "preview" | "compact";
  isCompleted?: boolean;
  isActive?: boolean;
  onToggleComplete?: (stepOrder: number) => void;
  onSelectStep?: () => void;
  onImageClick?: (img: { url: string; title: string; caption?: string }) => void;
  className?: string;
}

export function WorkflowStep({
  step,
  mode = "user",
  isCompleted = false,
  isActive = false,
  onToggleComplete,
  onSelectStep,
  onImageClick,
  className = "",
}: WorkflowStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const orderNum = step.order || step.stepNumber || 1;
  const orderFormatted = String(orderNum).padStart(2, "0");
  const imgUrl = step.image?.url || step.imageUrl;
  const imgCaption = step.image?.caption || step.imageCaption || "Visual Guideline";

  // Compact Pill mode
  if (mode === "compact") {
    return (
      <div
        onClick={onSelectStep}
        className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
          isCompleted
            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
            : isActive
            ? "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-400 dark:border-cyan-500 text-cyan-900 dark:text-cyan-200 shadow-xs"
            : "bg-white dark:bg-[#121622] border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:border-slate-300"
        } ${className}`}
      >
        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
          {orderNum}
        </span>
        <span className="text-xs font-semibold truncate max-w-xs">{step.title}</span>
      </div>
    );
  }

  // Full User & Preview mode
  return (
    <div
      onClick={onSelectStep}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
        isCompleted
          ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-[#0D1518]"
          : isActive
          ? "border-cyan-400 dark:border-cyan-500/80 bg-white dark:bg-[#111726] shadow-md ring-1 ring-cyan-400/30"
          : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#11141E] hover:border-slate-300 dark:hover:border-zinc-700"
      } ${className}`}
    >
      {/* Step Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3 select-none">
        <div className="flex items-start gap-3 min-w-0">
          {/* Step Number Badge */}
          {mode === "user" && onToggleComplete ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(orderNum);
              }}
              title={isCompleted ? "Mark step incomplete" : "Mark step completed"}
              className={`w-9 h-9 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-all ${
                isCompleted
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : orderFormatted}
            </button>
          ) : (
            <span className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center shrink-0 shadow-xs">
              {orderFormatted}
            </span>
          )}

          {/* Title & Directive */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-sm sm:text-base font-bold transition-colors ${
                  isCompleted
                    ? "text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-500/50"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {step.title}
              </h3>

              {step.shortTitle && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                  {step.shortTitle}
                </span>
              )}

              {isCompleted && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  COMPLETED
                </span>
              )}
            </div>

            {step.description && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                {step.description}
              </p>
            )}

            {step.purpose && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                <span className="font-semibold text-slate-700 dark:text-zinc-300 font-mono">
                  Objective:
                </span>
                <span>{step.purpose}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Step Body */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-5 space-y-4 pt-1 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-[#0E121C]/60">
          {/* Visual Guideline Image if present */}
          {imgUrl && (
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-zinc-800 group/img">
              <div className="relative h-44 sm:h-52 w-full overflow-hidden flex items-center justify-center">
                <img
                  src={imgUrl}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-200 border border-white/10 truncate max-w-md">
                    {imgCaption}
                  </span>

                  {onImageClick && (
                    <button
                      type="button"
                      onClick={() =>
                        onImageClick({
                          url: imgUrl,
                          title: step.title,
                          caption: imgCaption,
                        })
                      }
                      className="pointer-events-auto p-1.5 rounded-lg bg-black/70 hover:bg-black text-white transition-colors border border-white/15"
                      title="Inspect guideline full screen"
                    >
                      <Maximize2 className="h-3.5 w-3.5 text-cyan-300" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Step How-to Text */}
          {step.description && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#141926] border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed font-normal">
              <div className="text-[10px] font-bold font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                How to Perform This Step
              </div>
              <p className="whitespace-pre-wrap">{step.description}</p>
            </div>
          )}

          {/* Instructions checklist */}
          {step.instructions && step.instructions.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 font-mono uppercase tracking-wider">
                Execution Steps:
              </span>
              <ul className="space-y-1 pl-1">
                {step.instructions.map((inst, iIdx) => (
                  <li
                    key={`inst-${iIdx}`}
                    className="text-xs text-slate-600 dark:text-zinc-400 flex items-start gap-2"
                  >
                    <span className="text-cyan-500 font-bold shrink-0">•</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example Output Box */}
          {(() => {
            const exampleOutput =
              typeof step.example === "object" && step.example !== null
                ? step.example.output
                : typeof step.example === "string"
                ? step.example
                : step.output;
            if (!exampleOutput) return null;
            return (
              <div className="p-3 rounded-xl bg-white dark:bg-[#141926] border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  <span>Expected Result / Benchmark</span>
                </div>
                <p className="font-mono text-xs text-slate-800 dark:text-zinc-200">
                  {exampleOutput}
                </p>
              </div>
            );
          })()}

          {/* Tips Box */}
          {step.tips && step.tips.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {step.tips.map((tip, tIdx) => (
                <div
                  key={`tip-${tIdx}`}
                  className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200/90 text-xs flex items-start gap-2"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

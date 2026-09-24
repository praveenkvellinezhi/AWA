"use client";

import React, { memo, useRef, useEffect, useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { motion } from "motion/react";
import { Check, Maximize2, Sparkles } from "lucide-react";
import { GuideStep } from "@/lib/types";

export interface GuideStepNodeData extends Record<string, unknown> {
  step: GuideStep;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  isRevealed: boolean;
  isCompleted: boolean;
  isOutputActive: boolean;
  isInputActive: boolean;
  onToggleComplete?: (stepNumber: number) => void;
  onSelectStep?: (stepIndex: number) => void;
  onCompleteAndConnect?: (stepIndex: number) => void;
  onImageClick?: (img: { url: string; title: string; caption?: string }) => void;
  onHeightMeasured?: (stepIndex: number, height: number) => void;
  accentColor?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  stepIndex: number;
  nodeWidth?: number;
}

export type GuideStepNodeType = Node<GuideStepNodeData, "guideStep">;

function getTargetHandleClasses(pos: Position) {
  switch (pos) {
    case Position.Top:
      return "-top-3 left-1/2 -translate-x-1/2";
    case Position.Bottom:
      return "-bottom-3 left-1/2 -translate-x-1/2";
    case Position.Right:
      return "-right-3 top-1/2 -translate-y-1/2";
    case Position.Left:
    default:
      return "-left-3 top-1/2 -translate-y-1/2";
  }
}

function getSourceHandleClasses(pos: Position) {
  switch (pos) {
    case Position.Bottom:
      return "-bottom-3 left-1/2 -translate-x-1/2";
    case Position.Top:
      return "-top-3 left-1/2 -translate-x-1/2";
    case Position.Left:
      return "-left-3 top-1/2 -translate-y-1/2";
    case Position.Right:
    default:
      return "-right-3 top-1/2 -translate-y-1/2";
  }
}

function GuideStepNodeComponent({ data }: NodeProps<GuideStepNodeType>) {
  const {
    step,
    isFirst,
    isLast,
    isActive,
    isRevealed,
    isCompleted,
    isOutputActive,
    isInputActive,
    onToggleComplete,
    onSelectStep,
    onCompleteAndConnect,
    onImageClick,
    onHeightMeasured,
    sourcePosition = Position.Right,
    targetPosition = Position.Left,
    stepIndex,
    nodeWidth,
  } = data;

  const cardRef = useRef<HTMLDivElement>(null);

  // Measure exact rendered height and observe future dimension changes (e.g. image loads)
  useEffect(() => {
    if (!cardRef.current || !onHeightMeasured) return;

    const el = cardRef.current;
    const initialH = el.offsetHeight;
    if (initialH > 0) {
      onHeightMeasured(stepIndex, initialH);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const measured = Math.round(
          entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height
        );
        if (measured > 0) {
          onHeightMeasured(stepIndex, measured);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [stepIndex, onHeightMeasured]);

  const stepNumberFormatted = step.step < 10 ? `0${step.step}` : `${step.step}`;

  return (
    <div
      ref={cardRef}
      className="relative group/node select-none"
      style={{ width: nodeWidth ? `${nodeWidth}px` : undefined }}
    >
      {/* Target Handle (Input Connection Node) */}
      {!isFirst && (
        <div
          className={`absolute z-20 pointer-events-none ${getTargetHandleClasses(targetPosition)}`}
        >
          {isInputActive && (
            <span className="absolute -inset-1 rounded-full bg-cyan-400 opacity-75 animate-ping" />
          )}
          <Handle
            type="target"
            position={targetPosition}
            id="target"
            className={`!w-4 !h-4 !rounded-full !border-2 transition-all duration-300 ${isInputActive
                ? "!bg-cyan-400 !border-white shadow-[0_0_14px_#38bdf8]"
                : isActive
                  ? "!bg-cyan-500 !border-cyan-200"
                  : "!bg-slate-300 dark:!bg-slate-700 !border-slate-100 dark:!border-slate-900"
              }`}
          />
        </div>
      )}

      {/* Card Content with Motion Entrance */}
      <motion.div
        initial={false}
        animate={{
          opacity: isRevealed ? 1 : 0.15,
          scale: isRevealed ? 1 : 0.94,
          y: isRevealed ? 0 : 10,
        }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={() => {
          if (onSelectStep) {
            onSelectStep(stepIndex);
          }
        }}
        className={`w-full max-w-[92vw] sm:max-w-none rounded-2xl border transition-all duration-300 p-4 sm:p-5 shadow-2xl relative cursor-pointer ${isActive && isCompleted
            ? "bg-emerald-50/70 dark:bg-[#0f181f] border-emerald-500/80 dark:border-emerald-500/60 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-400/40"
            : isActive
              ? "bg-white dark:bg-[#111622] border-cyan-500/80 dark:border-cyan-400/70 shadow-lg shadow-cyan-500/5 dark:shadow-black/40 ring-1 ring-cyan-400/40"
              : isCompleted
                ? "bg-emerald-50/70 dark:bg-[#0f181f] border-emerald-400/60 dark:border-emerald-500/40 shadow-sm hover:border-emerald-500"
                : "bg-white dark:bg-[#0f131c] border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md dark:hover:bg-[#131722]"
          }`}
        title="Click card to view detailed explanation"
      >
        {/* Top Header: Step Number, Title, and Complete Action */}
        <div className="flex items-start gap-3">
          {/* Circular Step Badge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete?.(step.step);
            }}
            title={isCompleted ? "Mark incomplete" : "Mark step completed"}
            className={`w-9 h-9 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-all duration-200 ${isCompleted
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                : isActive
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-2 ring-cyan-400/50"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:border-transparent"
              }`}
          >
            {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepNumberFormatted}
          </button>

          {/* Title and Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <h3
                className={`text-sm sm:text-base font-bold leading-tight break-words transition-colors ${isCompleted
                    ? "text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-500/60"
                    : isActive
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-900 dark:text-slate-100"
                  }`}
              >
                {step.title}
              </h3>

              {/* Status and Pipeline Position Indicators */}
              <div className="flex items-center gap-1 shrink-0">
                {isFirst && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 tracking-wider">
                    START
                  </span>
                )}
                {isLast && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 tracking-wider">
                    RESULT
                  </span>
                )}
                {isCompleted ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    DONE
                  </span>
                ) : isActive ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 dark:border-cyan-500/40 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 animate-spin text-cyan-600 dark:text-cyan-300" />
                    <span>ACTIVE</span>
                  </span>
                ) : null}
              </div>
            </div>

            {/* Instruction description */}
            <p className="text-xs text-slate-600 dark:text-slate-300/90 mt-2 leading-relaxed break-words font-normal">
              {step.description}
            </p>
          </div>
        </div>

        {/* Optional Visual Guideline Image */}
        {step.image && (
          <div className="mt-3.5 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 group/img">
            <div className="relative h-28 sm:h-32 w-full overflow-hidden">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-mono text-zinc-200 border border-white/10 truncate max-w-[200px]">
                  {step.imageCaption || "Visual Guideline"}
                </span>

                {onImageClick && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageClick({
                        url: step.image!,
                        title: step.title,
                        caption: step.imageCaption,
                      });
                    }}
                    className="pointer-events-auto p-1 rounded-md bg-black/70 hover:bg-black text-white transition-colors border border-white/15"
                    title="Expand guideline benchmark"
                  >
                    <Maximize2 className="h-3 w-3 text-cyan-300" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Helpful Tip Box */}
        {step.tip && (
          <div className="mt-3 text-[11px] px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-200/90 flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 text-xs">💡</span>
            <span className="leading-snug">{step.tip}</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {isCompleted ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete?.(step.step);
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 dark:border-emerald-500/30 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm group/btn"
              title="Click to unmark as done"
            >
              <Check className="h-3.5 w-3.5 stroke-[3] text-emerald-600 dark:text-emerald-400" />
              <span>Done</span>
            </button>
          ) : isRevealed ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCompleteAndConnect?.(stepIndex);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] group/btn ${
                isActive
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/25 ring-1 ring-cyan-500/30"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 dark:text-slate-200 dark:border-slate-700 shadow-sm"
              }`}
              title={`Mark Step ${step.step} as done`}
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>Done</span>
            </button>
          ) : (
            <div className="w-full py-2 flex items-center justify-center">
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                Pending Connection
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Source Handle (Output Connection Node) */}
      {!isLast && (
        <div
          className={`absolute z-20 pointer-events-none ${getSourceHandleClasses(sourcePosition)}`}
        >
          {isOutputActive && (
            <span className="absolute -inset-1.5 rounded-full bg-cyan-400 opacity-80 animate-ping" />
          )}
          <Handle
            type="source"
            position={sourcePosition}
            id="source"
            className={`!w-4 !h-4 !rounded-full !border-2 transition-all duration-300 ${isOutputActive
                ? "!bg-cyan-400 !border-white shadow-[0_0_14px_#38bdf8]"
                : isActive
                  ? "!bg-cyan-500 !border-cyan-200"
                  : "!bg-slate-300 dark:!bg-slate-700 !border-slate-100 dark:!border-slate-900"
              }`}
          />
        </div>
      )}
    </div>
  );
}

export const GuideStepNode = memo(GuideStepNodeComponent);

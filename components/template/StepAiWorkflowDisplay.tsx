"use client";

import React, { useState } from "react";
import {
  Film,
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Maximize2,
  Sliders,
  Settings2,
  CheckCircle2,
  Link as LinkIcon,
  HelpCircle,
  Play,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import { StepAiWorkflowConfig, StepReferenceImage, StepStoryboardImage } from "@/lib/types";
import { VIDEO_METHODS, IMAGE_METHODS, REFERENCE_PURPOSES } from "@/components/admin/template-builder/ai-workflow-defaults";

interface StepAiWorkflowDisplayProps {
  aiWorkflow: StepAiWorkflowConfig;
  stepNumber: number;
  onImageClick?: (img: { url: string; title: string; caption?: string }) => void;
  className?: string;
}

export function StepAiWorkflowDisplay({
  aiWorkflow,
  stepNumber,
  onImageClick,
  className = "",
}: StepAiWorkflowDisplayProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const isVideo = aiWorkflow.generationType === "video";
  const isImage = aiWorkflow.generationType === "image";

  const videoMethodInfo = VIDEO_METHODS.find((m) => m.id === aiWorkflow.videoMethod);
  const imageMethodInfo = IMAGE_METHODS.find((m) => m.id === aiWorkflow.imageMethod);

  const methodBadge = isVideo
    ? videoMethodInfo?.badge || "Video Generation"
    : isImage
    ? imageMethodInfo?.badge || "Image Generation"
    : "Instruction";

  const methodTitle = isVideo
    ? videoMethodInfo?.label || "Video Generation"
    : isImage
    ? imageMethodInfo?.label || "Image Generation"
    : "Standard Workflow";

  const toolName = aiWorkflow.aiTool || (isVideo ? "AI Video Tool" : "AI Image Tool");

  const handleCopy = (text?: string, isNeg: boolean = false) => {
    if (!text) return;
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {
      console.warn("Failed to copy:", e);
    }
    if (isNeg) {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div className={`space-y-3.5 text-xs ${className}`}>
      {/* 1. Method & Tool Header Banner */}
      <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121622] flex flex-wrap items-center justify-between gap-2.5 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
              isVideo
                ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                : "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30"
            }`}
          >
            {isVideo ? <Film className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>{methodBadge}</span>
          </span>

          <span className="text-slate-400 dark:text-zinc-600 font-mono">•</span>

          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {methodTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">Tool:</span>
          <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700">
            {toolName}
          </span>
        </div>
      </div>

      {/* 2. Input Asset Dependency Box (Image to Video / Video to Video / Image to Image) */}
      {aiWorkflow.inputAsset && (
        <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/15 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Input Asset Dependency</span>
            </span>
            {aiWorkflow.inputAsset.usage && (
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px]">
                Usage: {aiWorkflow.inputAsset.usage.replace(/-/g, " ")}
              </span>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-[#121622] border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                {isVideo && aiWorkflow.videoMethod === "video-to-video" ? (
                  <Play className="w-3.5 h-3.5" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block truncate">
                  {aiWorkflow.inputAsset.assetName || "Input Asset"}
                </span>
                {aiWorkflow.inputAsset.sourceStepNumber && (
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span>← Output from Step {String(aiWorkflow.inputAsset.sourceStepNumber).padStart(2, "0")}</span>
                    {aiWorkflow.inputAsset.sourceStepTitle && (
                      <span className="text-slate-500 dark:text-zinc-400">({aiWorkflow.inputAsset.sourceStepTitle})</span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {aiWorkflow.inputAsset.sourceType === "previous-step" && !aiWorkflow.inputAsset.sourceStepNumber && (
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                ← Automatically fed from previous step
              </span>
            )}
          </div>

          {aiWorkflow.inputAsset.notes && (
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 pl-1 leading-relaxed">
              {aiWorkflow.inputAsset.notes}
            </p>
          )}
        </div>
      )}

      {/* 3. Reference Images Display with Explicit Purpose & Instructions (Section 15) */}
      {aiWorkflow.referenceImages && aiWorkflow.referenceImages.length > 0 && (
        <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reference Images ({aiWorkflow.referenceImages.length})</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">
              Follow assigned purpose for each reference
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiWorkflow.referenceImages.map((ref, idx) => {
              const purposeLabel =
                REFERENCE_PURPOSES.find((p) => p.value === ref.purpose)?.label ||
                ref.purpose ||
                "Guideline Reference";

              return (
                <div
                  key={ref.id || idx}
                  className="p-3 rounded-lg border border-purple-200 dark:border-purple-900/50 bg-white dark:bg-[#121622] space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs text-purple-700 dark:text-purple-300">
                      {ref.label || `Reference Image ${String(idx + 1).padStart(2, "0")}`}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {purposeLabel}
                    </span>
                  </div>

                  {ref.url && (
                    <div className="relative h-28 w-full rounded-md overflow-hidden bg-slate-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center group/ref">
                      <img
                        src={ref.url}
                        alt={ref.label || "Reference Image"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/ref:scale-105"
                      />
                      {onImageClick && (
                        <button
                          type="button"
                          onClick={() =>
                            onImageClick({
                              url: ref.url!,
                              title: ref.label || "Reference Image",
                              caption: ref.instruction,
                            })
                          }
                          className="absolute bottom-2 right-2 p-1.5 rounded-md bg-black/70 text-white hover:bg-black transition-colors"
                        >
                          <Maximize2 className="w-3 h-3 text-cyan-300" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="space-y-1 pt-0.5">
                    <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-zinc-400 block uppercase">
                      How to Use This Reference:
                    </span>
                    <p className="text-xs text-slate-800 dark:text-zinc-200 leading-relaxed font-normal bg-slate-50 dark:bg-zinc-900/80 p-2 rounded border border-slate-100 dark:border-zinc-800">
                      {ref.instruction || `Upload as the ${purposeLabel.toLowerCase()} to guide this step.`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Storyboard Images (Multiple Images to Video) */}
      {aiWorkflow.storyboardImages && aiWorkflow.storyboardImages.length > 0 && (
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#121622] space-y-3">
          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Storyboard Sequence & Keyframes ({aiWorkflow.storyboardImages.length})</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {aiWorkflow.storyboardImages.map((sb, sbIdx) => (
              <div
                key={sb.id || sbIdx}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E121C] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    {sbIdx + 1}
                  </span>
                  <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    {sb.durationSeconds || "2.5s"}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {sb.purpose || sb.label}
                </div>
                {sb.transitionInstruction && (
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 line-clamp-2">
                    {sb.transitionInstruction}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Transformation Instructions (Video to Video) */}
      {aiWorkflow.transformationInstructions && (
        <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/15 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
            Transformation Directive:
          </span>
          <p className="text-xs text-slate-800 dark:text-zinc-200 leading-relaxed font-normal">
            {aiWorkflow.transformationInstructions}
          </p>
        </div>
      )}

      {/* 6. Video / Image Prompt Box with One-Click Copy */}
      {aiWorkflow.prompt && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
            <span>{isVideo ? "Video Generation Prompt" : "Image Generation Prompt"}</span>
            <button
              type="button"
              onClick={() => handleCopy(aiWorkflow.prompt)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 dark:bg-black/80 border border-slate-700 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text shadow-sm">
            {aiWorkflow.prompt}
          </div>

          {aiWorkflow.negativePrompt && (
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="font-bold text-rose-600 dark:text-rose-400">Negative Prompt: </span>
                <span>{aiWorkflow.negativePrompt}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(aiWorkflow.negativePrompt, true)}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0"
              >
                {copiedNegative ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. Motion Directives (Camera, Subject, Environment) */}
      {aiWorkflow.motion && Object.values(aiWorkflow.motion).some(Boolean) && (
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121622] space-y-2">
          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            <span>Motion Parameters</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {aiWorkflow.motion.cameraMovement && (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0E121C] border border-slate-100 dark:border-zinc-800">
                <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400 block font-bold">
                  Camera Movement:
                </span>
                <span className="text-slate-800 dark:text-zinc-200 font-medium">
                  {aiWorkflow.motion.cameraMovement}
                </span>
              </div>
            )}
            {aiWorkflow.motion.subjectMovement && (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0E121C] border border-slate-100 dark:border-zinc-800">
                <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400 block font-bold">
                  Subject Movement:
                </span>
                <span className="text-slate-800 dark:text-zinc-200 font-medium">
                  {aiWorkflow.motion.subjectMovement}
                </span>
              </div>
            )}
            {aiWorkflow.motion.objectMovement && (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0E121C] border border-slate-100 dark:border-zinc-800">
                <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400 block font-bold">
                  Object Movement:
                </span>
                <span className="text-slate-800 dark:text-zinc-200 font-medium">
                  {aiWorkflow.motion.objectMovement}
                </span>
              </div>
            )}
            {aiWorkflow.motion.environmentalMovement && (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0E121C] border border-slate-100 dark:border-zinc-800">
                <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400 block font-bold">
                  Environment:
                </span>
                <span className="text-slate-800 dark:text-zinc-200 font-medium">
                  {aiWorkflow.motion.environmentalMovement}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. Settings Grid */}
      {aiWorkflow.settings && (
        <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#121622] space-y-2">
          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Recommended Generation Settings</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 text-xs">
            {aiWorkflow.settings.duration && (
              <div className="p-2 rounded-md bg-white dark:bg-[#0E121C] border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Duration</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {aiWorkflow.settings.duration}
                </span>
              </div>
            )}
            {aiWorkflow.settings.aspectRatio && (
              <div className="p-2 rounded-md bg-white dark:bg-[#0E121C] border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Aspect Ratio</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {aiWorkflow.settings.aspectRatio}
                </span>
              </div>
            )}
            {aiWorkflow.settings.resolution && (
              <div className="p-2 rounded-md bg-white dark:bg-[#0E121C] border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Resolution</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {aiWorkflow.settings.resolution}
                </span>
              </div>
            )}
            {aiWorkflow.settings.motionStrength && (
              <div className="p-2 rounded-md bg-white dark:bg-[#0E121C] border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Motion Strength</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {aiWorkflow.settings.motionStrength}
                </span>
              </div>
            )}
            {aiWorkflow.settings.style && (
              <div className="p-2 rounded-md bg-white dark:bg-[#0E121C] border border-slate-200 dark:border-zinc-800 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono text-slate-400 block">Style</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">
                  {aiWorkflow.settings.style}
                </span>
              </div>
            )}
            {aiWorkflow.settings.transformationStrength && (
              <div className="p-2 rounded-md bg-white dark:bg-[#0E121C] border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Transform Strength</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {aiWorkflow.settings.transformationStrength}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. Actionable Execution Steps (Circled numbers ①..⑩ as specified in Section 14) */}
      {aiWorkflow.generationInstructions && aiWorkflow.generationInstructions.length > 0 && (
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121622] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>GENERATE — Actionable Instructions</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
              Execute in order
            </span>
          </div>

          <ol className="space-y-1.5 pl-0.5">
            {aiWorkflow.generationInstructions.map((inst, iIdx) => {
              const circledNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫"];
              const circleGlyph = circledNumbers[iIdx] || `${iIdx + 1}.`;

              return (
                <li
                  key={iIdx}
                  className="text-xs text-slate-700 dark:text-zinc-300 flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono shrink-0 select-none">
                    {circleGlyph}
                  </span>
                  <span className="pt-0.5">{inst}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* 10. Output Asset & Next Step Dependency Handoff (Section 13, 14, 16) */}
      {aiWorkflow.output && (
        <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-50/25 dark:bg-emerald-950/15 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>OUTPUT ASSET</span>
            </span>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 border border-emerald-500/20">
              Format: {aiWorkflow.output.format || (isVideo ? "MP4" : "PNG")}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-[#121622] border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                ✓
              </span>
              <span className="font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                {aiWorkflow.output.name || (isVideo ? "output-video.mp4" : "output-image.png")}
              </span>
            </div>

            {aiWorkflow.output.nextStepNumber && (
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                → Used in Step {String(aiWorkflow.output.nextStepNumber).padStart(2, "0")}
                {aiWorkflow.output.nextStepTitle ? ` (${aiWorkflow.output.nextStepTitle})` : ""}
              </span>
            )}
          </div>

          {aiWorkflow.output.usage && (
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 pl-1 leading-relaxed">
              <strong>Action: </strong> {aiWorkflow.output.usage}
            </p>
          )}

          {/* Explicit NEXT STEP Card as required by Section 14 */}
          {aiWorkflow.output.nextStepNumber && (
            <div className="p-2 rounded-lg bg-white/80 dark:bg-[#101524] border border-emerald-500/30 flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[10px] uppercase text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/15">
                NEXT STEP
              </span>
              <span className="text-slate-800 dark:text-zinc-200 font-medium">
                Use this {isVideo ? "generated video" : "generated image"} in Step {String(aiWorkflow.output.nextStepNumber).padStart(2, "0")}
                {aiWorkflow.output.nextStepTitle ? ` (${aiWorkflow.output.nextStepTitle})` : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

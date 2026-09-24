"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Copy,
  Check,
  Eye,
  Camera,
  Film,
  Globe,
  Presentation,
  Palette,
  Layers,
  Code2,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Lock,
  Bookmark,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BuilderBasicInfo,
  ImageBuilderData,
  VideoBuilderData,
  WebsiteBuilderData,
  SlidesBuilderData,
  PosterBuilderData,
  WorkflowStepItem,
} from "./types";
import { combinePrompts } from "@/lib/prompt-utils";

interface LiveTemplatePreviewProps {
  basicInfo: BuilderBasicInfo;
  imageData: ImageBuilderData;
  videoData: VideoBuilderData;
  websiteData: WebsiteBuilderData;
  slidesData: SlidesBuilderData;
  posterData: PosterBuilderData;
  workflowSteps: WorkflowStepItem[];
  isDraft?: boolean;
}

export function LiveTemplatePreview({
  basicInfo,
  imageData,
  videoData,
  websiteData,
  slidesData,
  posterData,
  workflowSteps,
  isDraft = true,
}: LiveTemplatePreviewProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedStepIndex, setCopiedStepIndex] = useState<number | null>(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<"workflow" | "details">("workflow");

  const getPrimaryPrompt = () => {
    switch (basicInfo.categoryKey) {
      case "image":
        return imageData.prompt;
      case "video":
        return videoData.prompt;
      case "website":
        return combinePrompts(websiteData.uiPrompt, websiteData.contextPrompt);
      case "slides":
        return slidesData.globalPrompt;
      case "poster":
        return posterData.prompt;
      default:
        return "";
    }
  };

  const handleCopyPrimaryPrompt = () => {
    const prompt = getPrimaryPrompt();
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyStep = (promptText: string, index: number) => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopiedStepIndex(index);
    setTimeout(() => setCopiedStepIndex(null), 2000);
  };

  const currentSlide = slidesData.slides[selectedSlideIndex] || slidesData.slides[0];

  return (
    <div className="h-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111726] shadow-md overflow-hidden flex flex-col">
      {/* Preview Header Bar */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-wide">
            Live Template Preview
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            {isDraft ? "Draft" : "Published"}
          </span>
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          Public User View
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Thumbnail Preview Card */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 group shadow-xs">
          {basicInfo.thumbnailUrl ? (
            <Image
              src={basicInfo.thumbnailUrl}
              alt={basicInfo.name || "Template Preview"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized={basicInfo.thumbnailUrl.startsWith("data:")}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
              <Camera className="w-8 h-8 opacity-40" />
              <span className="text-xs">No cover image uploaded</span>
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white border border-white/20">
              {basicInfo.categoryName}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white">
              {basicInfo.difficulty}
            </span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md text-white text-[10px] font-mono">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{basicInfo.recommendedModel || "AI Optimized"}</span>
          </div>
        </div>

        {/* Template Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {basicInfo.subcategoryName || "Creative Template"}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              By {basicInfo.author || "AWA Official"}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {basicInfo.name || "Untitled Template"}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {basicInfo.description || "No description provided yet."}
          </p>

          {/* Tags */}
          {basicInfo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {basicInfo.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Category Specific Previews */}
        {/* 1. SLIDES CATEGORY PREVIEW */}
        {basicInfo.categoryKey === "slides" && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5 text-emerald-500" />
                <span>Slide Deck ({slidesData.slides.length} Slides)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {slidesData.presentationType}
              </span>
            </div>

            {/* Slide Selector Carousel Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {slidesData.slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSlideIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 transition-all ${
                    selectedSlideIndex === idx
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {s.slideNumber.toString().padStart(2, "0")}
                </button>
              ))}
            </div>

            {/* Active Slide Card */}
            {currentSlide && (
              <div className="p-3 rounded-lg bg-white dark:bg-[#131B2A] border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentSlide.title}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {currentSlide.layout}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentSlide.purpose}
                </p>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed relative group">
                  <div className="line-clamp-3">{currentSlide.prompt}</div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyStep(currentSlide.prompt, 999)}
                    className="h-6 text-[10px] mt-1.5 gap-1"
                  >
                    {copiedStepIndex === 999 ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied Slide Prompt</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Slide Prompt</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. WEBSITE CATEGORY PREVIEW */}
        {basicInfo.categoryKey === "website" && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Web Stack & Prompts</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {websiteData.framework}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
              <div className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                CSS: {websiteData.styling}
              </div>
              <div className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                DB: {websiteData.database}
              </div>
            </div>

            <Button
              type="button"
              variant="forest"
              size="sm"
              onClick={handleCopyPrimaryPrompt}
              className="w-full h-8 text-xs font-bold gap-1.5"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Full Combined Prompt!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Combined Website Prompt</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* 3. IMAGE / VIDEO / POSTER MAIN PROMPT & PARAMETERS */}
        {basicInfo.categoryKey !== "slides" && basicInfo.categoryKey !== "website" && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Generation Prompt</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {basicInfo.categoryKey === "image"
                  ? imageData.aspectRatio
                  : basicInfo.categoryKey === "video"
                  ? videoData.duration
                  : posterData.canvasSize}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 line-clamp-4 leading-relaxed">
              {getPrimaryPrompt() || "No prompt configured"}
            </div>

            <Button
              type="button"
              variant="forest"
              size="sm"
              onClick={handleCopyPrimaryPrompt}
              className="w-full h-8 text-xs font-bold gap-1.5"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Main Prompt!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Generation Prompt</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* Execution Steps Section */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Execution Steps ({workflowSteps.length} Steps)</span>
            </span>
            <span className="text-[10px] text-slate-400">
              How-to guide
            </span>
          </div>

          <div className="space-y-2">
            {workflowSteps.map((step) => (
              <div
                key={step.id}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] space-y-1.5"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {step.title}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {step.description || step.instruction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

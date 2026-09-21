"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { PromptPanel } from "@/components/prompt-panel";
import { CustomizePanel } from "@/components/customize-panel";
import { FeedbackWidget } from "@/components/feedback-widget";
import { getTemplateSlides } from "@/lib/template-images";
import {
  ChevronRight,
  Heart,
  Bookmark,
  Share2,
  Lock,
  Unlock,
  Check,
  ArrowRight,
  Maximize2,
  ChevronLeft,
  Zap,
  BookOpen,
  Crown,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  Code,
  CheckCircle2,
  X,
  Lightbulb,
} from "lucide-react";
import {
  generateImageGuide,
  isImageGenerationTemplate,
} from "@/lib/image-guide-generator";
import { UsageStep } from "@/lib/types";

interface TemplatePageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const { templateId } = use(params);
  const {
    templates,
    isSubscriber,
    isAuthenticated,
    isLiked,
    isSaved,
    toggleLike,
    toggleSave,
    setIsDemoControlsExpanded,
  } = useDemo();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  // Lookup template by id or slug
  const template = useMemo(() => {
    const decoded = decodeURIComponent(templateId);
    return templates.find((t) => t.id === decoded || t.slug === decoded || t.id.toLowerCase() === decoded.toLowerCase());
  }, [templates, templateId]);

  if (!template) {
    notFound();
  }

  const liked = isLiked(template.id);
  const saved = isSaved(template.id);
  const currentLikes = liked ? template.likesCount + 1 : template.likesCount;

  const formatLikes = (count: number) => {
    if (count >= 1000) {
      const val = (count / 1000).toFixed(1);
      return `${val.replace(/\.0$/, "")}K`;
    }
    return count.toString();
  };

  const handleLike = () => {
    toggleLike(template.id);
  };

  const handleSave = () => {
    toggleSave(template.id);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getToolUrl = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("v0")) return "https://v0.dev";
    if (lower.includes("figma")) return "https://figma.com";
    if (lower.includes("chatgpt") || lower.includes("gpt")) return "https://chatgpt.com";
    if (lower.includes("midjourney")) return "https://midjourney.com";
    if (lower.includes("lovable")) return "https://lovable.dev";
    if (lower.includes("cursor")) return "https://cursor.com";
    if (lower.includes("bolt")) return "https://bolt.new";
    if (lower.includes("runway")) return "https://runwayml.com";
    if (lower.includes("sora")) return "https://openai.com/sora";
    if (lower.includes("flux")) return "https://blackforestlabs.ai";
    if (lower.includes("pika")) return "https://pika.art";
    if (lower.includes("gamma")) return "https://gamma.app";
    return `https://www.google.com/search?q=${encodeURIComponent(name + " AI tool")}`;
  };

  const defaultTools = useMemo(
    () => [
      {
        toolId: "tool-v0",
        toolName: "v0 by Vercel",
        modelName: "v0 Generative UI",
        reason: "Generate and customize landing pages with AI.",
        badge: "Flagship Match",
      },
      {
        toolId: "tool-figma",
        toolName: "Figma",
        modelName: "Figma Vector UI",
        reason: "Edit and design the UI components.",
      },
      {
        toolId: "tool-chatgpt",
        toolName: "ChatGPT",
        modelName: "GPT-4o",
        reason: "Modify the prompt, generate content, and get variations.",
      },
      {
        toolId: "tool-midjourney",
        toolName: "Midjourney",
        modelName: "v6 Photoreal",
        reason: "Create custom visuals, hero images, and illustrations.",
      },
    ],
    []
  );

  const displayTools = useMemo(() => {
    const templateTools = template.recommendedTools || [];
    if (templateTools.length >= 4) {
      return templateTools.slice(0, 4);
    }
    const existingNames = new Set(templateTools.map((t) => t.toolName.toLowerCase()));
    const remaining = defaultTools.filter((dt) => !existingNames.has(dt.toolName.toLowerCase()));
    return [...templateTools, ...remaining].slice(0, 4);
  }, [template.recommendedTools, defaultTools]);

  const defaultSteps: UsageStep[] = useMemo(
    () => [
      {
        stepNumber: 1,
        title: "Preview the Design",
        instruction: "Explore the preview images to understand the layout, sections, and style.",
      },
      {
        stepNumber: 2,
        title: "Choose Your Tool",
        instruction: "Use v0, Figma, or your preferred tool to start building.",
      },
      {
        stepNumber: 3,
        title: "Customize Content",
        instruction: "Replace text, images, and branding with your own.",
      },
      {
        stepNumber: 4,
        title: "Implement Features",
        instruction: "Add interactive elements like pricing toggle, animations, and forms.",
      },
      {
        stepNumber: 5,
        title: "Make it Responsive",
        instruction: "Ensure the design works well on all devices.",
      },
      {
        stepNumber: 6,
        title: "Launch Your Project",
        instruction: "Export or deploy to your preferred platform (Vercel, Netlify, etc.).",
      },
    ],
    []
  );

  // Tool selection for dynamic step-by-step guide
  const isImageGen = useMemo(() => isImageGenerationTemplate(template), [template]);

  // Image generation tools specifically associated with this template
  const imageGenTools = useMemo(() => {
    return (template.recommendedTools || []).filter((t) => {
      const lower = t.toolName.toLowerCase();
      return !lower.includes("figma") && !lower.includes("v0") && !lower.includes("lovable") && !lower.includes("cursor") && !lower.includes("bolt");
    });
  }, [template.recommendedTools]);

  const [selectedGuideToolIndex, setSelectedGuideToolIndex] = useState(0);

  const activeGuideTool = useMemo(() => {
    if (imageGenTools.length > 0) {
      return imageGenTools[selectedGuideToolIndex] || imageGenTools[0];
    }
    return template.recommendedTools?.[0] || {
      toolId: "default",
      toolName: "AI Image Generator",
      modelName: "Latest Model",
      reason: "General image creation",
    };
  }, [imageGenTools, selectedGuideToolIndex, template.recommendedTools]);

  // Dynamic 8-10 step tool-adapted guide
  const displaySteps = useMemo(() => {
    if (isImageGen || imageGenTools.length > 0) {
      return generateImageGuide(activeGuideTool.toolName, activeGuideTool.modelName, {
        templateName: template.name,
        promptText: template.promptText,
        style: template.style,
        categoryId: template.categoryId,
      });
    }
    if (template.usageSteps && template.usageSteps.length > 0) {
      return template.usageSteps;
    }
    return defaultSteps;
  }, [isImageGen, imageGenTools, activeGuideTool, template, defaultSteps]);

  // Computed dynamic slides with appropriate demo images for this template
  const slides = useMemo(() => getTemplateSlides(template), [template]);

  // Render Slide Content with appropriate demo images in the preview window
  const renderSlideContent = (slideIndex: number) => {
    const currentSlide = slides[slideIndex] || slides[0];

    return (
      <div className="relative w-full h-full min-h-[400px] sm:min-h-[460px] bg-[#08090d] flex items-center justify-center select-none overflow-hidden group/canvas">
        {/* Ambient subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* High Resolution Demo Image */}
        <img
          src={currentSlide.url}
          alt={currentSlide.caption || template.name}
          className="w-full h-full object-contain max-h-[520px] transition-transform duration-500 group-hover/canvas:scale-[1.01]"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/15 shadow-md">
            {currentSlide.label}
          </span>
          {template.categoryName && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              {template.categoryName}
            </span>
          )}
        </div>

        {/* Bottom Overlay Bar with AI Tool info & Action */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-300 text-[11px] truncate max-w-sm">
            {template.recommendedTools[0]?.toolName ? (
              `Generated via ${template.recommendedTools[0].toolName}`
            ) : (
              "AI Guided Walkthrough"
            )}
          </span>
          <button
            onClick={() => setIsFullScreen(true)}
            className="px-3 py-1 rounded-lg bg-black/60 hover:bg-black/90 text-[10px] font-bold text-white border border-white/15 backdrop-blur-md flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Maximize2 className="h-3 w-3 text-cyan-400" />
            <span>Inspect HD</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-10">
        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Interactive Window Preview & Thumbnail Carousel (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            {/* Main Window Preview Container */}
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0e12] overflow-hidden shadow-2xl relative group">
              {/* macOS-style Window Titlebar */}
              <div className="px-4 py-3 bg-[#131419] border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/90" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/90" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
                </div>
                <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                  {template.slug}.preview
                </span>
                <div className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  <X className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Viewport content */}
              <div className="relative">
                {renderSlideContent(activeSlide)}
              </div>
            </div>

            {/* Thumbnail Carousel Bar & View Full Screen Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              {/* Thumbnail Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <button
                  onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {slides.map((s, idx) => {
                  const isActive = activeSlide === idx;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 relative bg-[#090a0f] ${
                        isActive
                          ? "border-cyan-400 shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400/50 scale-105"
                          : "border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100"
                      }`}
                      title={s.label}
                    >
                      <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-1.5 text-[9px] font-bold font-mono text-zinc-200 truncate max-w-[75px]">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* View Full Screen Button (from screenshot) */}
              <button
                onClick={() => setIsFullScreen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors shrink-0 shadow active:scale-95"
              >
                <Maximize2 className="h-3.5 w-3.5 text-zinc-400" />
                <span>View Full Screen</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Metadata, Lock/Unlock Box, Badges (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Category Pill & Social Actions */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700/80">
                {template.subcategoryName || template.categoryName}
              </span>

              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    liked
                      ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                  title={liked ? "Unlike" : "Like template"}
                >
                  <Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-400 text-rose-400" : ""}`} />
                  <span>{formatLikes(currentLikes)}</span>
                </button>

                {/* Save / Bookmark Button */}
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    saved
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                  title={saved ? "Remove from saved" : "Save template"}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-amber-400 text-amber-400" : ""}`} />
                  <span>{saved ? "Saved" : "Save"}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                  title="Share template"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Template Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {template.name}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {template.description}
            </p>

            {/* Tag Pills (Matching Screenshot) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-zinc-400 bg-zinc-900/90 px-2.5 py-1 rounded-lg border border-zinc-800"
                >
                  {tag}
                </span>
              ))}
              <span className="text-xs font-medium text-zinc-400 bg-zinc-900/90 px-2.5 py-1 rounded-lg border border-zinc-800">
                {template.style}
              </span>
            </div>

            {/* Prompt Access Box (Matching Screenshot Locked/Unlocked state) */}
            {!isSubscriber ? (
              <div className="rounded-2xl border border-zinc-800 bg-[#121316] p-5 space-y-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">
                      Prompt is for Subscribers Only
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Upgrade to unlock the full AI prompt, step-by-step guide, and download all assets.
                    </p>
                  </div>
                </div>

                <Link
                  href="/unlimited"
                  className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99]"
                >
                  <span>Subscribe to Unlock</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <PromptPanel
                  templateId={template.id}
                  originalPrompt={template.promptText}
                  isCustomizeOpen={isCustomizeOpen}
                  onCustomizeClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
                  onCopySuccess={() => setHasCopiedPrompt(true)}
                />

                {isCustomizeOpen && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <CustomizePanel
                      templateId={template.id}
                      originalPrompt={template.promptText}
                      onClose={() => setIsCustomizeOpen(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Feature Highlights 4-Box Grid (Matching Screenshot) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center space-y-1">
                <div className="h-6 w-6 rounded-lg bg-pink-500/15 text-pink-400 flex items-center justify-center mx-auto text-xs font-bold">
                  ❖
                </div>
                <p className="text-xs font-bold text-white">Figma file</p>
                <span className="text-[10px] text-zinc-500 block">Preview only</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center space-y-1">
                <div className="h-6 w-6 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto text-xs font-bold">
                  v0
                </div>
                <p className="text-xs font-bold text-white">v0 compatible</p>
                <span className="text-[10px] text-zinc-500 block">Ready to use</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center space-y-1">
                <Smartphone className="h-5 w-5 text-indigo-400 mx-auto" />
                <p className="text-xs font-bold text-white">Responsive</p>
                <span className="text-[10px] text-zinc-500 block">All devices</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center space-y-1">
                <ShieldCheck className="h-5 w-5 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Commercial use</p>
                <span className="text-[10px] text-zinc-500 block">Allowed</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Recommended AI Tools Section */}
        <section id="tools-section" className="space-y-4 pt-6 border-t border-zinc-850">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span className="text-blue-400">⚡</span>
                <span>Recommended AI Tools</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Admin-curated AI models, tested rationales, and direct launch links for this template.
              </p>
            </div>

            <Link
              href="/mcp"
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View All Tools</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayTools.map((tool, idx) => {
              const url = getToolUrl(tool.toolName);
              return (
                <div
                  key={`${tool.toolId}-${idx}`}
                  className="rounded-2xl border border-zinc-800 bg-[#121316] p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 hover:bg-[#15161b] transition-all shadow-lg group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {tool.toolName.toLowerCase().includes("v0") ? (
                        <div className="h-9 w-9 rounded-xl bg-black border border-zinc-700 flex items-center justify-center font-bold text-white font-mono text-sm tracking-tighter">
                          v0
                        </div>
                      ) : tool.toolName.toLowerCase().includes("figma") ? (
                        <div className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2">
                          <svg className="h-5 w-5" viewBox="0 0 38 57" fill="none">
                            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
                            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
                            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
                            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
                            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
                          </svg>
                        </div>
                      ) : tool.toolName.toLowerCase().includes("chatgpt") || tool.toolName.toLowerCase().includes("gpt") ? (
                        <div className="h-9 w-9 rounded-xl bg-[#10a37f]/20 border border-[#10a37f]/40 flex items-center justify-center text-[#10a37f]">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.771-4.204 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.746-7.075zM13.26 22.45a4.5 4.5 0 0 1-2.87-1.026l.16-.09 4.77-2.756a.78.78 0 0 0 .392-.681v-6.733l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.524 4.524 0 0 1-4.51 4.483zm-8.818-4.275a4.506 4.506 0 0 1-.535-3.003l.16.096 4.773 2.756a.776.776 0 0 0 .783 0l5.83-3.368v2.336a.08.08 0 0 1-.033.064l-4.834 2.793a4.524 4.524 0 0 1-6.144-1.674zm-1.572-8.487a4.504 4.504 0 0 1 2.335-1.977v5.7a.78.78 0 0 0 .391.68l5.83 3.368-2.02 1.168a.079.079 0 0 1-.072.007L4.56 13.04a4.523 4.523 0 0 1-1.69-3.351zm15.864 1.835l-5.83-3.368 2.02-1.168a.079.079 0 0 1 .072-.007l4.834 2.791a4.527 4.527 0 0 1-.689 8.163v-5.7a.78.78 0 0 0-.407-.711zm2.012-3.025l-.16-.096-4.773-2.756a.776.776 0 0 0-.783 0l-5.83 3.368V7.68a.08.08 0 0 1 .033-.064l4.834-2.793a4.527 4.527 0 0 1 6.679 4.682zm-10.864 4.214l2.607-1.507 2.607 1.507v3.013l-2.607 1.507-2.607-1.507z"/>
                          </svg>
                        </div>
                      ) : tool.toolName.toLowerCase().includes("midjourney") ? (
                        <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18M12 3v14M6 17l6-14 6 14"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs flex items-center justify-center">
                          <Zap className="h-4 w-4 text-amber-500" />
                        </div>
                      )}

                      {tool.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-mono">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {tool.toolName}
                      </h3>
                      {tool.modelName && (
                        <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
                          {tool.modelName}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {tool.reason}
                    </p>
                  </div>

                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-1.5 transition-all group-hover:border-zinc-700"
                  >
                    <span>Launch {tool.toolName}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Step-by-Step Guide */}
        <section id="steps-section" className="space-y-6 pt-6 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Step-by-Step Guide for {activeGuideTool.toolName}</span>
                {!isSubscriber ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-700 dark:text-amber-300 font-mono tracking-wider uppercase">
                    <Lock className="h-3 w-3" />
                    <span>Subscribers Only</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-mono tracking-wider uppercase">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>
                      Checklist ({completedSteps.filter((id) => displaySteps.some((s) => s.stepNumber === id)).length}/{displaySteps.length})
                    </span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                {isSubscriber
                  ? `Follow these tailored ${activeGuideTool.toolName} steps to generate, evaluate, and refine this asset. Click any step to mark complete.`
                  : `Tailored ${activeGuideTool.toolName} step-by-step instructions are protected for active subscribers.`}
              </p>
            </div>

            {/* Tool Switcher Pills when multiple tools exist */}
            {imageGenTools.length > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Workflow for:</span>
                {imageGenTools.map((t, idx) => (
                  <button
                    key={t.toolId || idx}
                    onClick={() => setSelectedGuideToolIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      selectedGuideToolIndex === idx
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {t.toolName}
                    {t.badge && <span className="ml-1 opacity-75 font-mono text-[10px]">★</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isSubscriber ? (
            <div className="relative rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 sm:p-8 overflow-hidden shadow-xl">
              {/* Blurred background preview of the actual tool-specific steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 filter blur-[5px] opacity-30 pointer-events-none select-none" aria-hidden="true">
                {displaySteps.slice(0, 6).map((step) => (
                  <div
                    key={step.stepNumber}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800"
                  >
                    <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-zinc-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {String(step.stepNumber).padStart(2, "0")}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-48 bg-slate-300 dark:bg-zinc-700 rounded" />
                      <div className="h-3 w-full max-w-md bg-slate-200 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Centered Lock Box */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-white/95 via-white/90 to-white/70 dark:from-[#121316] dark:via-[#121316]/95 dark:to-[#121316]/70">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 mb-3 shadow-lg shadow-amber-500/5">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-amber-200">
                  {activeGuideTool.toolName} Guide is for Subscribers Only
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-md leading-relaxed">
                  Upgrade to unlock the complete {displaySteps.length}-step {activeGuideTool.toolName} generation guide, recommended parameters, and expert refinement workflows.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displaySteps.map((step) => {
                const isCompleted = completedSteps.includes(step.stepNumber);
                const stepNumStr = String(step.stepNumber).padStart(2, "0");

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStepCompleted(step.stepNumber)}
                    className={`flex items-start gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none group h-full ${
                      isCompleted
                        ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30 shadow-sm"
                        : "bg-white dark:bg-[#121316] border-slate-200 dark:border-zinc-800/90 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm"
                    }`}
                    title={isCompleted ? "Click to mark incomplete" : "Click to mark completed"}
                  >
                    {/* Step Number Button */}
                    <div
                      className={`h-9 w-9 rounded-xl font-bold flex items-center justify-center shrink-0 text-xs font-mono transition-all ${
                        isCompleted
                          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 group-hover:border-slate-400 dark:group-hover:border-zinc-500"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepNumStr}
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-sm sm:text-base font-bold transition-colors ${
                            isCompleted
                              ? "text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-500/60"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          <span className="font-mono text-slate-400 dark:text-zinc-500 mr-2 text-xs sm:text-sm">
                            {stepNumStr} —
                          </span>
                          {step.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                            DONE
                          </span>
                        )}
                      </div>

                      {/* Short Instruction */}
                      <p
                        className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                          isCompleted
                            ? "text-slate-500 dark:text-zinc-500"
                            : "text-slate-700 dark:text-zinc-300"
                        }`}
                      >
                        {step.instruction}
                      </p>

                      {/* Optional Tip / Note */}
                      {step.tip && (
                        <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-900/60 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-zinc-800/80">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            <strong className="font-semibold text-slate-800 dark:text-zinc-200">Tip: </strong>
                            {step.tip}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. Bottom Banner: Access Banner */}
        {!isSubscriber ? (
          <section className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-[#121316] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
                <Crown className="h-6 w-6" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Get Full Access</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                  Unlock the complete prompt, recommended AI tools, step-by-step guide, and all resources.
                </p>
              </div>
            </div>

            <Link
              href="/unlimited"
              className="relative z-10 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 shrink-0"
            >
              <span>Subscribe Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0d1e19] via-[#11161d] to-[#141221] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-80 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Premium Active</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                    All Features Unlocked
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  You have unrestricted access to this template&apos;s prompt, AI tools stack, step-by-step instructions, and customization engine.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <Link
                href="/collection"
                className="px-5 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Bookmark className="h-3.5 w-3.5 text-amber-400" />
                <span>My Collection</span>
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                <span>Browse More Templates</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* 6. Feedback Widget */}
        <section className="pt-6 border-t border-zinc-850">
          <FeedbackWidget
            templateId={template.id}
            templateName={template.name}
            recommendedTools={template.recommendedTools}
          />
        </section>
      </div>

      {/* Full Screen Modal View */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <span className="text-sm font-bold text-white font-mono">{template.name} — Full View</span>
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl rounded-2xl border border-zinc-800 bg-[#0d0e12] overflow-hidden shadow-2xl">
              {renderSlideContent(activeSlide)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

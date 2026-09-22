"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { PromptPanel } from "@/components/prompt-panel";
import { CustomizePanel } from "@/components/customize-panel";
import { FeedbackWidget } from "@/components/feedback-widget";
import { getTemplateSlides } from "@/lib/template-images";
import { getTemplatePrompts } from "@/lib/prompt-utils";
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
  ExternalLink,
  Layers,
  Code,
  CheckCircle2,
  X,
  Lightbulb,
  Film,
  Video,
  Image as ImageIcon,
  Copy,
  Globe,
  Presentation,
  Palette,
} from "lucide-react";
import {
  generateImageGuide,
  isImageGenerationTemplate,
} from "@/lib/image-guide-generator";
import {
  generateVideoGuide,
  isVideoGenerationTemplate,
  resolveVideoWorkflow,
  getWorkflowTitle,
  getWorkflowDescription,
} from "@/lib/video-guide-generator";
import {
  generateWebsiteGuide,
  isWebsiteGenerationTemplate,
  resolveWebsiteWorkflow,
} from "@/lib/website-guide-generator";
import {
  generatePresentationGuide,
  isPresentationGenerationTemplate,
  resolvePresentationWorkflow,
} from "@/lib/presentation-guide-generator";
import {
  generateDesignGuide,
  isDesignGenerationTemplate,
  resolveDesignWorkflow,
} from "@/lib/design-guide-generator";
import { WebsiteGenerationGuide } from "@/components/website-generation-guide";
import { PresentationGenerationGuide } from "@/components/presentation-generation-guide";
import { DesignGenerationGuide } from "@/components/design-generation-guide";
import { VisualStepGuide } from "@/components/visual-step-guide";
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

  const templatePrompts = useMemo(() => {
    return getTemplatePrompts(template);
  }, [template]);

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

  // Dynamic step-by-step guide detection
  const isVideoGen = useMemo(() => isVideoGenerationTemplate(template), [template]);
  const isWebsiteGen = useMemo(() => isWebsiteGenerationTemplate(template), [template]);
  const isPresentationGen = useMemo(() => isPresentationGenerationTemplate(template), [template]);
  const isDesignGen = useMemo(() => isDesignGenerationTemplate(template), [template]);
  const isImageGen = useMemo(() => isImageGenerationTemplate(template), [template]);

  // Video generation tools specifically associated with this template
  const videoGenTools = useMemo(() => {
    return (template.recommendedTools || []).filter((t) => {
      const lower = t.toolName.toLowerCase();
      return (
        lower.includes("runway") ||
        lower.includes("sora") ||
        lower.includes("pika") ||
        lower.includes("kling") ||
        lower.includes("luma") ||
        lower.includes("veo") ||
        lower.includes("hailuo") ||
        lower.includes("minimax") ||
        lower.includes("kaiber") ||
        lower.includes("video")
      );
    });
  }, [template.recommendedTools]);

  // Website generation tools specifically associated with this template
  const websiteGenTools = useMemo(() => {
    return (template.recommendedTools || []).filter((t) => {
      const lower = t.toolName.toLowerCase();
      return (
        lower.includes("v0") ||
        lower.includes("lovable") ||
        lower.includes("bolt") ||
        lower.includes("framer") ||
        lower.includes("stitch") ||
        lower.includes("replit") ||
        lower.includes("antigravity") ||
        lower.includes("cursor") ||
        lower.includes("webflow") ||
        lower.includes("wix") ||
        lower.includes("claude") ||
        lower.includes("chatgpt") ||
        lower.includes("figma") ||
        lower.includes("web") ||
        lower.includes("code")
      );
    });
  }, [template.recommendedTools]);

  // Presentation generation tools specifically associated with this template
  const presentationGenTools = useMemo(() => {
    return (template.recommendedTools || []).filter((t) => {
      const lower = t.toolName.toLowerCase();
      return (
        lower.includes("gamma") ||
        lower.includes("canva") ||
        lower.includes("beautiful") ||
        lower.includes("powerpoint") ||
        lower.includes("copilot") ||
        lower.includes("slides") ||
        lower.includes("gemini") ||
        lower.includes("tome") ||
        lower.includes("pitch") ||
        lower.includes("plus") ||
        lower.includes("prezi") ||
        lower.includes("presentation")
      );
    });
  }, [template.recommendedTools]);

  // Design generation tools specifically associated with this template
  const designGenTools = useMemo(() => {
    return (template.recommendedTools || []).filter((t) => {
      const lower = t.toolName.toLowerCase();
      return (
        lower.includes("canva") ||
        lower.includes("adobe") ||
        lower.includes("express") ||
        lower.includes("firefly") ||
        lower.includes("ideogram") ||
        lower.includes("kittl") ||
        lower.includes("designer") ||
        lower.includes("figma") ||
        lower.includes("midjourney") ||
        lower.includes("stitch") ||
        lower.includes("poster") ||
        lower.includes("design")
      );
    });
  }, [template.recommendedTools]);

  // Image generation tools specifically associated with this template
  const imageGenTools = useMemo(() => {
    return (template.recommendedTools || []).filter((t) => {
      const lower = t.toolName.toLowerCase();
      return (
        !lower.includes("figma") &&
        !lower.includes("v0") &&
        !lower.includes("lovable") &&
        !lower.includes("cursor") &&
        !lower.includes("bolt") &&
        !lower.includes("replit") &&
        !lower.includes("stitch") &&
        !lower.includes("antigravity") &&
        !lower.includes("webflow") &&
        !lower.includes("wix") &&
        !lower.includes("gamma") &&
        !lower.includes("canva") &&
        !lower.includes("beautiful") &&
        !lower.includes("powerpoint") &&
        !lower.includes("tome") &&
        !lower.includes("pitch") &&
        !lower.includes("prezi") &&
        !lower.includes("ideogram") &&
        !lower.includes("kittl") &&
        !lower.includes("express") &&
        !lower.includes("firefly") &&
        !lower.includes("designer") &&
        !lower.includes("runway") &&
        !lower.includes("pika") &&
        !lower.includes("kling") &&
        !lower.includes("luma") &&
        !lower.includes("sora") &&
        !lower.includes("veo") &&
        !lower.includes("hailuo") &&
        !lower.includes("minimax")
      );
    });
  }, [template.recommendedTools]);

  const guideTools = useMemo(() => {
    if (isVideoGen) {
      return videoGenTools.length > 0 ? videoGenTools : (template.recommendedTools || []);
    }
    if (isWebsiteGen) {
      return websiteGenTools.length > 0 ? websiteGenTools : (template.recommendedTools || []);
    }
    if (isPresentationGen) {
      return presentationGenTools.length > 0 ? presentationGenTools : (template.recommendedTools || []);
    }
    if (isDesignGen) {
      return designGenTools.length > 0 ? designGenTools : (template.recommendedTools || []);
    }
    if (isImageGen) {
      return imageGenTools.length > 0 ? imageGenTools : (template.recommendedTools || []);
    }
    return template.recommendedTools || [];
  }, [isVideoGen, isWebsiteGen, isPresentationGen, isDesignGen, isImageGen, videoGenTools, websiteGenTools, presentationGenTools, designGenTools, imageGenTools, template.recommendedTools]);

  const [selectedGuideToolIndex, setSelectedGuideToolIndex] = useState(0);

  const activeGuideTool = useMemo(() => {
    if (guideTools.length > 0) {
      return guideTools[selectedGuideToolIndex] || guideTools[0];
    }
    return template.recommendedTools?.[0] || {
      toolId: "default",
      toolName: isVideoGen
        ? "AI Video Generator"
        : isWebsiteGen
          ? "AI Website Builder"
          : isPresentationGen
            ? "AI Presentation Creator"
            : isDesignGen
              ? "AI Design Tool"
              : isImageGen
                ? "AI Image Generator"
                : "AI Tool",
      modelName: "Latest Model",
      reason: "General creation",
    };
  }, [guideTools, selectedGuideToolIndex, isVideoGen, isWebsiteGen, isPresentationGen, isDesignGen, isImageGen, template.recommendedTools]);

  // Dynamic video workflow resolution
  const videoWorkflow = useMemo(() => {
    if (!isVideoGen) return null;
    return resolveVideoWorkflow(template, activeGuideTool.toolName);
  }, [isVideoGen, template, activeGuideTool.toolName]);

  // Dynamic website workflow resolution
  const websiteWorkflow = useMemo(() => {
    if (!isWebsiteGen) return null;
    return resolveWebsiteWorkflow(template, activeGuideTool.toolName);
  }, [isWebsiteGen, template, activeGuideTool.toolName]);

  // Dynamic presentation workflow resolution
  const presentationWorkflow = useMemo(() => {
    if (!isPresentationGen) return null;
    return resolvePresentationWorkflow(template, activeGuideTool.toolName);
  }, [isPresentationGen, template, activeGuideTool.toolName]);

  // Dynamic design workflow resolution
  const designWorkflow = useMemo(() => {
    if (!isDesignGen) return null;
    return resolveDesignWorkflow(template, activeGuideTool.toolName);
  }, [isDesignGen, template, activeGuideTool.toolName]);

  // Computed dynamic slides with appropriate demo images for this template
  const slides = useMemo(() => getTemplateSlides(template), [template]);

  // Dynamic 8-10 step tool-adapted guide with visual guideline checkpoints
  const displaySteps = useMemo(() => {
    let rawSteps: UsageStep[] = [];
    if (isVideoGen && videoWorkflow) {
      rawSteps = generateVideoGuide(videoWorkflow, activeGuideTool.toolName, activeGuideTool.modelName, {
        templateName: template.name,
        promptText: template.promptText,
      });
    } else if (isWebsiteGen && websiteWorkflow) {
      rawSteps = generateWebsiteGuide(websiteWorkflow, activeGuideTool.toolName, activeGuideTool.modelName, {
        templateName: template.name,
        promptText: template.promptText,
        style: template.style,
        categoryId: template.categoryId,
        assets: websiteWorkflow.assets,
      });
    } else if (isPresentationGen && presentationWorkflow) {
      rawSteps = generatePresentationGuide(presentationWorkflow, activeGuideTool.toolName, activeGuideTool.modelName, {
        templateName: template.name,
        promptText: template.promptText,
        style: template.style,
        categoryId: template.categoryId,
        assets: presentationWorkflow.assets,
        slideCount: presentationWorkflow.slideCount,
      });
    } else if (isDesignGen && designWorkflow) {
      rawSteps = generateDesignGuide(designWorkflow, activeGuideTool.toolName, activeGuideTool.modelName, {
        templateTitle: template.name,
        promptText: template.promptText,
        style: template.style,
        mood: template.mood,
      });
    } else if (isImageGen || imageGenTools.length > 0) {
      rawSteps = generateImageGuide(activeGuideTool.toolName, activeGuideTool.modelName, {
        templateName: template.name,
        promptText: template.promptText,
        style: template.style,
        categoryId: template.categoryId,
      });
    } else if (template.usageSteps && template.usageSteps.length > 0) {
      rawSteps = template.usageSteps;
    } else {
      rawSteps = defaultSteps;
    }

    // Collect all workflow assets across workflows if available
    const workflowAssets = [
      ...(videoWorkflow?.assets || []),
      ...(websiteWorkflow?.assets || []),
      ...(presentationWorkflow?.assets || []),
      ...(designWorkflow?.assets || []),
    ];

    // Identify candidate steps for visual guideline illustrations (up to 3 high-value checkpoints):
    // 1. Reference / Setup / Wireframe / Upload step -> slides[1]?.url
    // 2. Lighting / Styling / Atmosphere / Architecture step -> slides[2]?.url
    // 3. Output Review / Upscale / Benchmark / Export step -> slides[0]?.url (or template.imageUrl)
    let refStepIdx = -1;
    let styleStepIdx = -1;
    let benchmarkStepIdx = -1;

    rawSteps.forEach((step, idx) => {
      const text = `${step.title} ${step.instruction}`.toLowerCase();

      // Check for Reference / Input / Upload / Wireframe / Screenshot (steps 0-4)
      if (
        refStepIdx === -1 &&
        idx <= 4 &&
        (text.includes("reference") ||
          text.includes("upload") ||
          text.includes("source") ||
          text.includes("input") ||
          text.includes("screenshot") ||
          text.includes("wireframe") ||
          text.includes("moodboard") ||
          text.includes("first frame") ||
          text.includes("asset") ||
          text.includes("preview the design") ||
          text.includes("composition") ||
          text.includes("canvas"))
      ) {
        refStepIdx = idx;
        return;
      }

      // Check for Lighting / Style / Atmosphere / Architecture / Palette (mid steps 2-7)
      if (
        styleStepIdx === -1 &&
        idx !== refStepIdx &&
        idx >= 2 &&
        idx <= 7 &&
        (text.includes("lighting") ||
          text.includes("atmosphere") ||
          text.includes("style") ||
          text.includes("camera") ||
          text.includes("motion") ||
          text.includes("theme") ||
          text.includes("component") ||
          text.includes("typography") ||
          text.includes("color") ||
          text.includes("palette") ||
          text.includes("customize") ||
          text.includes("feature") ||
          text.includes("render"))
      ) {
        styleStepIdx = idx;
        return;
      }

      // Check for Benchmark / Review / Upscale / Final / Quality / Export (late steps)
      if (
        benchmarkStepIdx === -1 &&
        idx !== refStepIdx &&
        idx !== styleStepIdx &&
        idx >= Math.max(3, rawSteps.length - 3) &&
        (text.includes("review") ||
          text.includes("evaluate") ||
          text.includes("inspect") ||
          text.includes("upscale") ||
          text.includes("quality") ||
          text.includes("benchmark") ||
          text.includes("output") ||
          text.includes("final") ||
          text.includes("export") ||
          text.includes("launch") ||
          text.includes("result"))
      ) {
        benchmarkStepIdx = idx;
      }
    });

    // Fallbacks if some indices weren't matched for rich templates:
    if (refStepIdx === -1 && rawSteps.length >= 4) {
      refStepIdx = 1;
    }
    if (benchmarkStepIdx === -1 && rawSteps.length >= 3) {
      benchmarkStepIdx = rawSteps.length - 1;
    }
    if (styleStepIdx === -1 && rawSteps.length >= 6) {
      const mid = Math.floor(rawSteps.length / 2);
      if (mid !== refStepIdx && mid !== benchmarkStepIdx) {
        styleStepIdx = mid;
      }
    }

    return rawSteps.map((s, idx) => {
      // If s already has an explicit imageUrl, preserve it
      if (s.imageUrl) {
        return {
          ...s,
          stepNumber: idx + 1,
        };
      }

      // Check if any workflow asset explicitly matches this step
      const stepText = `${s.title} ${s.instruction}`.toLowerCase();
      const matchedAsset = workflowAssets.find((a) => {
        const lbl = (a.label || "").toLowerCase();
        return lbl && stepText.includes(lbl);
      });

      if (matchedAsset && matchedAsset.url) {
        return {
          ...s,
          stepNumber: idx + 1,
          imageUrl: matchedAsset.url,
          imageCaption: `${matchedAsset.label} Reference`,
        };
      }

      // Assign guideline images based on matched checkpoints
      if (idx === refStepIdx && slides[1]?.url) {
        return {
          ...s,
          stepNumber: idx + 1,
          imageUrl: slides[1].url,
          imageCaption: "Guideline: Composition & Reference Setup",
        };
      }

      if (idx === styleStepIdx && slides[2]?.url) {
        return {
          ...s,
          stepNumber: idx + 1,
          imageUrl: slides[2].url,
          imageCaption: "Guideline: Lighting & Style Architecture",
        };
      }

      if (idx === benchmarkStepIdx && (slides[0]?.url || template.imageUrl)) {
        return {
          ...s,
          stepNumber: idx + 1,
          imageUrl: slides[0]?.url || template.imageUrl,
          imageCaption: "Guideline: Expected Output Benchmark",
        };
      }

      return {
        ...s,
        stepNumber: idx + 1,
      };
    });
  }, [
    isVideoGen,
    videoWorkflow,
    isWebsiteGen,
    websiteWorkflow,
    isPresentationGen,
    presentationWorkflow,
    isDesignGen,
    designWorkflow,
    isImageGen,
    imageGenTools.length,
    activeGuideTool.toolName,
    activeGuideTool.modelName,
    template.name,
    template.imageUrl,
    template.promptText,
    template.style,
    template.mood,
    template.categoryId,
    template.usageSteps,
    defaultSteps,
    slides,
  ]);

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
                      className={`h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 relative bg-[#090a0f] ${isActive
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${liked
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${saved
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
                  className="text-xs font-medium text-slate-700 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900/90 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800"
                >
                  {tag}
                </span>
              ))}
              <span className="text-xs font-medium text-slate-700 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900/90 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800">
                {template.style}
              </span>
            </div>

            {/* Prompt Access Box (Matching Screenshot Locked/Unlocked state) */}
            {!isSubscriber ? (
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-5 space-y-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200">
                      Prompt is for Subscribers Only
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                      Upgrade to unlock the full AI prompt, step-by-step guide, and download all assets.
                    </p>
                  </div>
                </div>

                <Link
                  href="/unlimited"
                  className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                >
                  <span>Subscribe to Unlock</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <PromptPanel
                  templateId={template.id}
                  uiPrompt={templatePrompts.uiPrompt}
                  contextPrompt={templatePrompts.contextPrompt}
                  originalPrompt={template.promptText}
                  isCustomizeOpen={isCustomizeOpen}
                  onCustomizeClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
                  onCopySuccess={() => setHasCopiedPrompt(true)}
                />

                {isCustomizeOpen && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <CustomizePanel
                      templateId={template.id}
                      uiPrompt={templatePrompts.uiPrompt}
                      contextPrompt={templatePrompts.contextPrompt}
                      originalPrompt={template.promptText}
                      onClose={() => setIsCustomizeOpen(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Feature Highlights Spec Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 text-center space-y-1">
                <div className="h-6 w-6 rounded-md bg-slate-200/60 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center mx-auto text-xs font-semibold font-mono">
                  ❖
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Figma file</p>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">Preview only</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 text-center space-y-1">
                <div className="h-6 w-6 rounded-md bg-slate-200/60 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center mx-auto text-xs font-semibold font-mono">
                  v0
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">v0 compatible</p>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">Ready to use</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 text-center space-y-1">
                <Smartphone className="h-5 w-5 text-slate-600 dark:text-zinc-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Responsive</p>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">All devices</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 text-center space-y-1">
                <ShieldCheck className="h-5 w-5 text-slate-600 dark:text-zinc-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Commercial use</p>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">Allowed</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Recommended AI Tools Section */}
        <section id="tools-section" className="space-y-4 pt-6 border-t border-slate-200 dark:border-zinc-850">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Recommended AI Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                Admin-curated AI models, tested rationales, and direct launch links for this template.
              </p>
            </div>

            <Link
              href="/mcp"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>View All Tools</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {displayTools.map((tool, idx) => {
              const url = getToolUrl(tool.toolName);
              return (
                <a
                  key={`${tool.toolId}-${idx}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 sm:px-5 sm:py-4 rounded-2xl bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="min-w-0 pr-3 space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {tool.toolName}
                    </h3>
                    {tool.modelName && (
                      <p className="text-xs text-slate-500 dark:text-zinc-400 truncate font-normal">
                        {tool.modelName}
                      </p>
                    )}
                  </div>

                  <div className="text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 4. Step-by-Step Guide */}
        <section id="steps-section" className="space-y-6 pt-6 border-t border-slate-200 dark:border-zinc-800">
          {isDesignGen && designWorkflow ? (
            <>
              {/* Tool Switcher Pills when multiple tools exist */}
              {guideTools.length > 1 && (
                <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Switch Tool Workflow:
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {guideTools.map((t, idx) => (
                      <button
                        key={`design-tool-${t.toolId || t.toolName}-${idx}`}
                        onClick={() => setSelectedGuideToolIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${selectedGuideToolIndex === idx
                            ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700"
                          }`}
                      >
                        {t.toolName}
                        {t.badge && <span className="ml-1 opacity-75 font-mono text-[10px]">★</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <DesignGenerationGuide
                tool={activeGuideTool.toolName}
                generationType={designWorkflow.generationType}
                designType={designWorkflow.designType}
                assets={designWorkflow.assets}
                format={designWorkflow.format}
                dimensions={designWorkflow.dimensions}
                brandAssets={designWorkflow.brandAssets}
                requiresTextVerification={designWorkflow.requiresTextVerification}
                requiresProductAccuracyCheck={designWorkflow.requiresProductAccuracyCheck}
                requiresBrandCheck={designWorkflow.requiresBrandCheck}
                requiresMultiFormatResize={designWorkflow.requiresMultiFormatResize}
                multiFormats={designWorkflow.multiFormats}
                prompt={template.promptText}
                steps={displaySteps}
                isSubscriber={isSubscriber}
                completedSteps={completedSteps}
                onToggleStep={toggleStepCompleted}
              />
            </>
          ) : isPresentationGen && presentationWorkflow ? (
            <>
              {/* Tool Switcher Pills when multiple tools exist */}
              {guideTools.length > 1 && (
                <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Presentation className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Switch Tool Workflow:
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {guideTools.map((t, idx) => (
                      <button
                        key={`pres-tool-${t.toolId || t.toolName}-${idx}`}
                        onClick={() => setSelectedGuideToolIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${selectedGuideToolIndex === idx
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700"
                          }`}
                      >
                        {t.toolName}
                        {t.badge && <span className="ml-1 opacity-75 font-mono text-[10px]">★</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <PresentationGenerationGuide
                tool={activeGuideTool.toolName}
                generationType={presentationWorkflow.generationType}
                presentationType={presentationWorkflow.presentationType}
                assets={presentationWorkflow.assets}
                slideCount={presentationWorkflow.slideCount}
                prompt={template.promptText}
                outline={presentationWorkflow.outline}
                steps={displaySteps}
                isSubscriber={isSubscriber}
                completedSteps={completedSteps}
                onToggleStep={toggleStepCompleted}
              />
            </>
          ) : isWebsiteGen && websiteWorkflow ? (
            <>
              {/* Tool Switcher Pills when multiple tools exist */}
              {guideTools.length > 1 && (
                <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Switch Tool Workflow:
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {guideTools.map((t, idx) => (
                      <button
                        key={`web-tool-${t.toolId || t.toolName}-${idx}`}
                        onClick={() => setSelectedGuideToolIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${selectedGuideToolIndex === idx
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700"
                          }`}
                      >
                        {t.toolName}
                        {t.badge && <span className="ml-1 opacity-75 font-mono text-[10px]">★</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <WebsiteGenerationGuide
                tool={activeGuideTool.toolName}
                generationType={websiteWorkflow.generationType}
                assets={websiteWorkflow.assets}
                projectType={websiteWorkflow.projectType}
                techStack={websiteWorkflow.techStack}
                pages={websiteWorkflow.pages}
                features={websiteWorkflow.features}
                prompt={template.promptText}
                steps={displaySteps}
                isSubscriber={isSubscriber}
                completedSteps={completedSteps}
                onToggleStep={toggleStepCompleted}
              />
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {isVideoGen ? (
                        <Film className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                      <span>Step-by-Step Guide for {activeGuideTool.toolName}</span>
                    </h2>

                    {isVideoGen && videoWorkflow && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-700 dark:text-purple-300">
                        <Film className="h-3 w-3" />
                        <span>{getWorkflowTitle(videoWorkflow.generationType)}</span>
                      </span>
                    )}

                    {!isSubscriber ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-300">
                        <Lock className="h-3 w-3" />
                        <span>Subscribers Only</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>
                          Checklist ({completedSteps.filter((id) => displaySteps.some((s) => s.stepNumber === id)).length}/{displaySteps.length})
                        </span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                    {isSubscriber
                      ? isVideoGen && videoWorkflow
                        ? getWorkflowDescription(videoWorkflow.generationType, activeGuideTool.toolName)
                        : `Follow these tailored ${activeGuideTool.toolName} steps to generate, evaluate, and refine this asset. Click any step to mark complete.`
                      : `Tailored ${activeGuideTool.toolName} step-by-step instructions are protected for active subscribers.`}
                  </p>
                </div>

                {/* Tool Switcher Pills when multiple tools exist */}
                {guideTools.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Workflow for:</span>
                    {guideTools.map((t, idx) => (
                      <button
                        key={`default-tool-${t.toolId || t.toolName}-${idx}`}
                        onClick={() => setSelectedGuideToolIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${selectedGuideToolIndex === idx
                            ? isVideoGen
                              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                              : "bg-blue-600 text-white border-blue-600 shadow-sm"
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

              {/* Dynamic Asset Checklist for Video Tutorials */}
              {isVideoGen && videoWorkflow?.assets && videoWorkflow.assets.length > 0 && (
                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        Required Tutorial Assets ({videoWorkflow.assets.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Prepare these inputs before launching {activeGuideTool.toolName}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {videoWorkflow.assets.map((asset, aIdx) => (
                      <div
                        key={`video-asset-${asset.id || aIdx}-${aIdx}`}
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
                            <ImageIcon className="h-6 w-6 text-slate-400 dark:text-zinc-500" />
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

              <VisualStepGuide
                category={isVideoGen ? "video" : "image"}
                tool={activeGuideTool.toolName}
                steps={displaySteps}
                prompt={template.promptText}
                templateThumbnail={template.imageUrl || template.galleryImages?.[0]}
                duration={videoWorkflow?.settings?.durationSeconds ? `${videoWorkflow.settings.durationSeconds}s` : "5s"}
                isSubscriber={isSubscriber}
                completedSteps={completedSteps}
                onToggleStep={toggleStepCompleted}
              />
            </>
          )}
        </section>

        {/* 5. Bottom Banner: Access Banner (Only shown to non-subscribers) */}
        {!isSubscriber && (
          <section className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121316] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Crown className="h-5 w-5" />
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
              className="relative z-10 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
            >
              <span>Subscribe Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
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

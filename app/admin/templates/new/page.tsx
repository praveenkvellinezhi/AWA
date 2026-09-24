"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { Template, UsageStep, SlidePrompt, TemplateStep, TemplateWorkflow } from "@/lib/types";
import { normalizeTemplateStep, combineFullTemplatePrompt } from "@/lib/template-workflow";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Layers,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "@/components/admin/template-builder/BasicInfoSection";
import { ImageBuilder } from "@/components/admin/template-builder/ImageBuilder";
import { VideoBuilder } from "@/components/admin/template-builder/VideoBuilder";
import { WebsiteBuilder } from "@/components/admin/template-builder/WebsiteBuilder";
import { SlidesBuilder } from "@/components/admin/template-builder/SlidesBuilder";
import { PosterBuilder } from "@/components/admin/template-builder/PosterBuilder";
import { WorkflowStepBuilder } from "@/components/admin/template-builder/WorkflowStepBuilder";
import { LiveTemplatePreview } from "@/components/admin/template-builder/LiveTemplatePreview";
import {
  BuilderBasicInfo,
  CategoryOption,
  ImageBuilderData,
  VideoBuilderData,
  WebsiteBuilderData,
  SlidesBuilderData,
  PosterBuilderData,
  WorkflowStepItem,
  ValidationErrors,
  TemplateCategoryKey,
} from "@/components/admin/template-builder/types";
import {
  CATEGORY_OPTIONS,
  INITIAL_BASIC_INFO,
  INITIAL_IMAGE_DATA,
  INITIAL_VIDEO_DATA,
  INITIAL_WEBSITE_DATA,
  INITIAL_SLIDES_DATA,
  INITIAL_POSTER_DATA,
  getDefaultWorkflowSteps,
} from "@/components/admin/template-builder/defaults";
import { combinePrompts } from "@/lib/prompt-utils";

function TemplateBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { templates, categories, aiTools, addTemplate, updateTemplate } = useDemo();

  // 1. Basic Information State
  const [basicInfo, setBasicInfo] = useState<BuilderBasicInfo>(INITIAL_BASIC_INFO);

  // 2. Category-Specific Data States
  const [imageData, setImageData] = useState<ImageBuilderData>(INITIAL_IMAGE_DATA);
  const [videoData, setVideoData] = useState<VideoBuilderData>(INITIAL_VIDEO_DATA);
  const [websiteData, setWebsiteData] = useState<WebsiteBuilderData>(INITIAL_WEBSITE_DATA);
  const [slidesData, setSlidesData] = useState<SlidesBuilderData>(INITIAL_SLIDES_DATA);
  const [posterData, setPosterData] = useState<PosterBuilderData>(INITIAL_POSTER_DATA);

  // 3. Workflow Steps State
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepItem[]>(
    getDefaultWorkflowSteps("image")
  );

  // 4. UI Controls & Notifications
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [successNotice, setSuccessNotice] = useState<{
    message: string;
    templateId: string;
    slug: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing template if editing
  useEffect(() => {
    if (!editId) return;
    const existing = templates.find((t) => t.id === editId);
    if (!existing) return;

    // Detect category key from categoryId / categoryName
    let catKey: TemplateCategoryKey = "image";
    if (existing.categoryId.includes("video") || existing.categoryName.toLowerCase().includes("video")) {
      catKey = "video";
    } else if (existing.categoryId.includes("website") || existing.categoryName.toLowerCase().includes("website")) {
      catKey = "website";
    } else if (existing.categoryId.includes("slides") || existing.categoryName.toLowerCase().includes("slide") || existing.categoryName.toLowerCase().includes("presentation")) {
      catKey = "slides";
    } else if (existing.categoryId.includes("poster") || existing.categoryName.toLowerCase().includes("poster") || existing.categoryName.toLowerCase().includes("design")) {
      catKey = "poster";
    }

    setBasicInfo({
      name: existing.name,
      slug: existing.slug,
      description: existing.description,
      categoryKey: catKey,
      categoryId: existing.categoryId,
      categoryName: existing.categoryName,
      subcategoryId: existing.subcategoryId || "",
      subcategoryName: existing.subcategoryName || "",
      thumbnailUrl: existing.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      tags: existing.tags || [],
      rawTags: (existing.tags || []).join(", "),
      author: "AWA Creator",
      difficulty: existing.difficulty || "Beginner",
      featured: false,
      popular: true,
      status: existing.isPublished ? "published" : "draft",
      seoTitle: "",
      seoDescription: "",
      recommendedModel: existing.recommendedTools[0]?.modelName || "Midjourney v6.1",
    });

    if (existing.uiPrompt) {
      setWebsiteData((prev) => ({
        ...prev,
        uiPrompt: existing.uiPrompt || prev.uiPrompt,
        contextPrompt: existing.contextPrompt || prev.contextPrompt,
      }));
    }

    if (existing.promptText) {
      setImageData((prev) => ({ ...prev, prompt: existing.promptText || prev.prompt }));
      setVideoData((prev) => ({ ...prev, prompt: existing.promptText || prev.prompt }));
      setPosterData((prev) => ({ ...prev, prompt: existing.promptText || prev.prompt }));
    }

    if (existing.slidePrompts && existing.slidePrompts.length > 0) {
      setSlidesData((prev) => ({
        ...prev,
        slides: existing.slidePrompts!.map((sp, idx) => ({
          id: `slide-${idx + 1}`,
          slideNumber: sp.slideNumber,
          title: sp.title,
          purpose: sp.purpose || "",
          layout: sp.layout || "Hero Title & Visual",
          prompt: sp.prompt,
          visualDirection: sp.visualDirection || "",
          contentRequirements: "",
          speakerNotes: "",
        })),
        numberOfSlides: existing.slidePrompts!.length,
      }));
    }

    // CANONICAL SINGLE SOURCE OF TRUTH: Load template.workflow.steps first!
    if (existing.workflow?.steps && existing.workflow.steps.length > 0) {
      setWorkflowSteps(
        existing.workflow.steps.map((ws, idx) => normalizeTemplateStep(ws, idx))
      );
    } else if (existing.usageSteps && existing.usageSteps.length > 0) {
      setWorkflowSteps(
        existing.usageSteps.map((us, idx) => normalizeTemplateStep(us, idx))
      );
    }
  }, [editId, templates]);

  // Handle Category Change
  const handleSelectCategory = (category: CategoryOption) => {
    // Find category in demo-context to resolve subcategories
    const catEntity = categories.find((c) => c.id === category.id);
    const subcat = catEntity?.subcategories[0];

    // Pick recommended default AI tool for this category
    let defaultToolId = "tool-midjourney";
    if (category.key === "video") defaultToolId = "tool-runway";
    else if (category.key === "website") defaultToolId = "tool-v0";
    else if (category.key === "slides") defaultToolId = "tool-gamma";
    else if (category.key === "poster") defaultToolId = "tool-ideogram";

    const matchedTool = aiTools.find((t) => t.id === defaultToolId) || aiTools[0];
    const defModel = matchedTool?.models.find((m) => m.isDefault) || matchedTool?.models[0];

    setBasicInfo((prev) => ({
      ...prev,
      categoryKey: category.key,
      categoryId: category.id,
      categoryName: category.name,
      subcategoryId: subcat?.id || category.defaultSubcategory,
      subcategoryName: subcat?.name || "General",
      assignedToolId: matchedTool?.id || prev.assignedToolId,
      assignedToolName: matchedTool?.name || prev.assignedToolName,
      assignedModelId: defModel?.id || prev.assignedModelId,
      assignedModelName: defModel?.name || prev.assignedModelName,
      recommendedModel: defModel?.name || prev.recommendedModel,
    }));

    // Update workflow steps default for new category
    setWorkflowSteps(getDefaultWorkflowSteps(category.key));
    setValidationErrors({});
  };

  // Validation function
  const validate = (): boolean => {
    const errors: ValidationErrors = {};

    if (!basicInfo.name.trim()) {
      errors.name = "Template Name is required.";
    }

    switch (basicInfo.categoryKey) {
      case "image":
        if (!imageData.prompt.trim()) {
          errors.mainPrompt = "Main Generation Prompt is required for Image templates.";
        }
        break;
      case "video":
        if (!videoData.prompt.trim()) {
          errors.mainPrompt = "Video Generation Prompt is required for Video templates.";
        }
        break;
      case "website":
        if (!websiteData.uiPrompt.trim()) {
          errors.uiPrompt = "UI Generation Prompt is required for Website templates.";
        }
        if (!websiteData.contextPrompt.trim()) {
          errors.contextPrompt = "Context Prompt is required for Website templates.";
        }
        break;
      case "slides":
        if (!slidesData.presentationContext.trim()) {
          errors.presentationContext = "Presentation Context is required for Slide decks.";
        }
        if (slidesData.slides.length === 0) {
          errors.slides = "At least one slide is required in the slide pipeline.";
        } else if (!slidesData.slides[0].prompt.trim()) {
          errors.slides = "Slide 1 prompt must be defined.";
        }
        break;
      case "poster":
        if (!posterData.prompt.trim()) {
          errors.mainPrompt = "Graphic Design Prompt is required for Poster templates.";
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Construct standard Template object
  const buildTemplatePayload = (isPublished: boolean): Template => {
    const timestamp = Date.now();
    const templateId = editId || `template-${basicInfo.categoryKey}-${timestamp}`;
    const slug =
      basicInfo.slug ||
      basicInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // CANONICAL SINGLE SOURCE OF TRUTH: All surfaces consume template.workflow.steps
    const canonicalSteps: TemplateStep[] = workflowSteps.map((ws, idx) =>
      normalizeTemplateStep(ws, idx)
    );

    const workflowPayload: TemplateWorkflow = {
      steps: canonicalSteps,
    };

    // Backward-compatibility mirror
    const usageStepsPayload: UsageStep[] = canonicalSteps;

    // Slide Prompts
    const slidePromptsPayload: SlidePrompt[] =
      basicInfo.categoryKey === "slides"
        ? slidesData.slides.map((s) => ({
            slideNumber: s.slideNumber,
            title: s.title,
            purpose: s.purpose,
            prompt: s.prompt,
            visualDirection: s.visualDirection,
            layout: s.layout,
          }))
        : [];

    let combinedPromptText = "";
    let uiPromptText: string | undefined = undefined;
    let contextPromptText: string | undefined = undefined;

    if (basicInfo.categoryKey === "website") {
      uiPromptText = websiteData.uiPrompt;
      contextPromptText = websiteData.contextPrompt;
      combinedPromptText = combinePrompts(websiteData.uiPrompt, websiteData.contextPrompt);
    } else if (basicInfo.categoryKey === "image") {
      combinedPromptText = imageData.prompt;
    } else if (basicInfo.categoryKey === "video") {
      combinedPromptText = videoData.prompt;
    } else if (basicInfo.categoryKey === "slides") {
      combinedPromptText = slidesData.globalPrompt;
    } else if (basicInfo.categoryKey === "poster") {
      combinedPromptText = posterData.prompt;
    }

    const toolName = basicInfo.assignedToolName || basicInfo.recommendedModel.split(" ")[0] || "AI";
    const modelName = basicInfo.assignedModelName || basicInfo.recommendedModel;
    const toolId = basicInfo.assignedToolId || `tool-${toolName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

    const recommendedTools = [
      {
        toolId,
        toolName,
        modelName,
        reason: `Engineered and validated prompt pipeline configuration optimized for ${toolName}.`,
      },
    ];

    const template: Template = {
      id: templateId,
      name: basicInfo.name.trim(),
      slug,
      categoryId: basicInfo.categoryId,
      categoryName: basicInfo.categoryName,
      subcategoryId: basicInfo.subcategoryId,
      subcategoryName: basicInfo.subcategoryName,
      description: basicInfo.description.trim(),
      promptText: combinedPromptText,
      uiPrompt: uiPromptText,
      contextPrompt: contextPromptText,
      safePreviewText: basicInfo.description.trim().slice(0, 110) + "...",
      tags: basicInfo.tags,
      difficulty: basicInfo.difficulty,
      style:
        basicInfo.categoryKey === "image"
          ? imageData.visualStyle
          : basicInfo.categoryKey === "video"
          ? videoData.visualStyle
          : basicInfo.categoryKey === "poster"
          ? posterData.visualStyle
          : "Modern & Clean",
      mood:
        basicInfo.categoryKey === "image"
          ? imageData.mood
          : basicInfo.categoryKey === "slides"
          ? slidesData.tone
          : "Professional High-Conversion",
      recommendedTools,
      workflow: workflowPayload,
      usageSteps: usageStepsPayload,
      slidePrompts: slidePromptsPayload.length > 0 ? slidePromptsPayload : undefined,
      thumbnailGradient: "from-slate-900 via-emerald-950 to-slate-900",
      imageUrl: basicInfo.thumbnailUrl,
      likesCount: 1420,
      savesCount: 890,
      isPublished,
      createdAt: new Date().toISOString(),
    };

    return template;
  };

  const handleSaveDraft = () => {
    if (!basicInfo.name.trim()) {
      setValidationErrors({ name: "Please enter a template name before saving draft." });
      return;
    }

    setIsSaving(true);
    const payload = buildTemplatePayload(false);

    if (editId) {
      updateTemplate(editId, payload);
    } else {
      addTemplate(payload);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSuccessNotice({
        message: "Template draft saved successfully!",
        templateId: payload.id,
        slug: payload.slug,
      });
    }, 300);
  };

  const handlePublish = () => {
    if (!validate()) {
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setIsSaving(true);
    const payload = buildTemplatePayload(true);

    if (editId) {
      updateTemplate(editId, payload);
    } else {
      addTemplate(payload);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSuccessNotice({
        message: "Template published successfully and is now live in the AWA catalog!",
        templateId: payload.id,
        slug: payload.slug,
      });
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-white transition-colors">
      {/* Sticky Header Bar */}
      <header className="shrink-0 bg-white/95 dark:bg-[#0E1422]/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 lg:px-8 py-3 z-30 transition-colors">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left: Back Link & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/templates"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Templates</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {editId ? "Edit Template" : "New Template"}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono">
                {basicInfo.categoryName} Builder
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toggle mobile preview */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
              className="lg:hidden text-xs gap-1.5 font-medium"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isMobilePreviewOpen ? "Hide Preview" : "Live Preview"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="text-xs font-medium gap-1.5 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Save Draft</span>
            </Button>

            <Button
              type="button"
              variant="forest"
              size="sm"
              onClick={handlePublish}
              disabled={isSaving}
              className="text-xs font-bold gap-1.5 rounded-xl shadow-xs"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Publish Template</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Split Layout: Fluid Full Width & Fixed Preview */}
      <div className="flex-1 flex min-h-0 overflow-hidden w-full">
        {/* Left Column: ONLY THIS SECTION SCROLLS */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
          {/* Success Modal / Banner */}
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    {successNotice.message}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Template ID: <code className="font-mono">{successNotice.templateId}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/templates/${successNotice.templateId}`}
                  target="_blank"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  <span>View Live in Catalog</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/templates")}
                  className="text-xs font-medium rounded-xl"
                >
                  Return to Templates List
                </Button>
              </div>
            </div>
          )}

          {/* Builder Hero Header */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                Visual Creation Suite
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Template Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Create reusable, production-ready AI templates for modern creators. The builder dynamically adapts its fields, prompt structures, and parameters based on your selected category.
            </p>
          </div>
            {/* Step 01: Basic Information */}
            <BasicInfoSection
              basicInfo={basicInfo}
              onChange={(updated) => setBasicInfo((prev) => ({ ...prev, ...updated }))}
              categories={categories}
              aiTools={aiTools}
              onSelectCategory={handleSelectCategory}
              errors={validationErrors}
            />

            {/* Step 02: Dynamic Category-Specific Builder */}
            <section className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    02
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Template Content & Parameters
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Category-specific builder configured for <strong>{basicInfo.categoryName}</strong>.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {basicInfo.categoryKey.toUpperCase()}
                </span>
              </div>

              {/* Dynamic Category Switcher */}
              {basicInfo.categoryKey === "image" && (
                <ImageBuilder
                  data={imageData}
                  onChange={(updated) => setImageData((prev) => ({ ...prev, ...updated }))}
                  errors={validationErrors}
                />
              )}

              {basicInfo.categoryKey === "video" && (
                <VideoBuilder
                  data={videoData}
                  onChange={(updated) => setVideoData((prev) => ({ ...prev, ...updated }))}
                  errors={validationErrors}
                />
              )}

              {basicInfo.categoryKey === "website" && (
                <WebsiteBuilder
                  data={websiteData}
                  onChange={(updated) => setWebsiteData((prev) => ({ ...prev, ...updated }))}
                  errors={validationErrors}
                />
              )}

              {basicInfo.categoryKey === "slides" && (
                <SlidesBuilder
                  data={slidesData}
                  onChange={(updated) => setSlidesData((prev) => ({ ...prev, ...updated }))}
                  errors={validationErrors}
                />
              )}

              {basicInfo.categoryKey === "poster" && (
                <PosterBuilder
                  data={posterData}
                  onChange={(updated) => setPosterData((prev) => ({ ...prev, ...updated }))}
                  errors={validationErrors}
                />
              )}
            </section>

            {/* Step 03: Universal Prompt Workflow Builder */}
            <WorkflowStepBuilder
              steps={workflowSteps}
              onChange={setWorkflowSteps}
              categoryName={basicInfo.categoryName}
            />

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span>Category: </span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {basicInfo.categoryName}
                </strong>
                <span> • {workflowSteps.length} workflow steps configured</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="text-xs font-semibold rounded-xl"
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={handlePublish}
                  disabled={isSaving}
                  className="text-xs font-bold rounded-xl shadow-xs"
                >
                  Publish Template
                </Button>
              </div>
            </div>
        </div>

        {/* Right Column: FIXED LIVE PREVIEW PANEL (Does NOT scroll with left column) */}
        <div
          className={`w-[380px] xl:w-[440px] 2xl:w-[490px] shrink-0 h-full p-4 pl-0 overflow-hidden flex flex-col ${
            isMobilePreviewOpen
              ? "fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-xs flex"
              : "hidden lg:flex"
          }`}
        >
          <div className="h-full w-full relative flex flex-col overflow-hidden">
            {isMobilePreviewOpen && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsMobilePreviewOpen(false)}
                className="mb-2 self-end lg:hidden bg-white dark:bg-slate-900"
              >
                Close Preview
              </Button>
            )}
            <LiveTemplatePreview
              basicInfo={basicInfo}
              imageData={imageData}
              videoData={videoData}
              websiteData={websiteData}
              slidesData={slidesData}
              posterData={posterData}
              workflowSteps={workflowSteps}
              isDraft={basicInfo.status === "draft"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewTemplateBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F17]">
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
            <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading AWA Template Builder...</span>
          </div>
        </div>
      }
    >
      <TemplateBuilderContent />
    </Suspense>
  );
}

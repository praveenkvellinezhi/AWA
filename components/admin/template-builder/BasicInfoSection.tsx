"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Tag,
  Plus,
  X,
  Sliders,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  HelpCircle,
  UploadCloud,
  Upload,
  Trash2,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelector } from "./CategorySelector";
import {
  BuilderBasicInfo,
  CategoryOption,
  TemplateCategoryKey,
  ValidationErrors,
} from "./types";
import { Category, AITool } from "@/lib/types";

interface BasicInfoSectionProps {
  basicInfo: BuilderBasicInfo;
  onChange: (updated: Partial<BuilderBasicInfo>) => void;
  categories: Category[];
  aiTools: AITool[];
  onSelectCategory: (category: CategoryOption) => void;
  errors?: ValidationErrors;
}

const PRESET_THUMBNAILS = [
  {
    label: "3D Abstract",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Minimal Architecture",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Cinematic Film",
    url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Tech Presentation",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Studio Fashion",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  },
];

export function BasicInfoSection({
  basicInfo,
  onChange,
  categories,
  aiTools = [],
  onSelectCategory,
  errors,
}: BasicInfoSectionProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // File Upload states & handlers
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailMode, setThumbnailMode] = useState<"upload" | "url">("upload");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onChange({ thumbnailUrl: dataUrl });
        setUploadedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleClearThumbnail = () => {
    onChange({ thumbnailUrl: "" });
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get subcategories for current category
  const currentCategory = categories.find((c) => c.id === basicInfo.categoryId);
  const subcategories = currentCategory?.subcategories || [];

  // AI Tool & Model Resolution
  const activeTool =
    aiTools.find((t) => t.id === basicInfo.assignedToolId) ||
    aiTools.find((t) => t.name.toLowerCase() === basicInfo.assignedToolName?.toLowerCase()) ||
    aiTools[0];

  const availableModels = activeTool?.models || [];

  const activeModel =
    availableModels.find((m) => m.id === basicInfo.assignedModelId) ||
    availableModels.find((m) => m.name === basicInfo.recommendedModel) ||
    availableModels.find((m) => m.isDefault) ||
    availableModels[0];

  const handleToolChange = (toolId: string) => {
    const tool = aiTools.find((t) => t.id === toolId);
    if (!tool) return;
    const defModel = tool.models.find((m) => m.isDefault) || tool.models[0];
    onChange({
      assignedToolId: tool.id,
      assignedToolName: tool.name,
      assignedModelId: defModel?.id || "",
      assignedModelName: defModel?.name || tool.name,
      recommendedModel: defModel?.name || tool.name,
    });
  };

  const handleModelChange = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId);
    if (!model) return;
    onChange({
      assignedModelId: model.id,
      assignedModelName: model.name,
      recommendedModel: model.name,
    });
  };

  // Sort tools to prioritize active category matches
  const sortedTools = React.useMemo(() => {
    return [...aiTools].sort((a, b) => {
      const catKey = basicInfo.categoryKey;
      const isAMatch =
        (catKey === "image" && a.category === "Image") ||
        (catKey === "video" && a.category === "Video") ||
        (catKey === "website" && a.category === "Code / Web") ||
        (catKey === "slides" && (a.category.includes("Slide") || a.category.includes("Design") || a.name.includes("Gamma") || a.name.includes("Beautiful"))) ||
        (catKey === "poster" && (a.category.includes("Design") || a.category.includes("Image")));

      const isBMatch =
        (catKey === "image" && b.category === "Image") ||
        (catKey === "video" && b.category === "Video") ||
        (catKey === "website" && b.category === "Code / Web") ||
        (catKey === "slides" && (b.category.includes("Slide") || b.category.includes("Design") || b.name.includes("Gamma") || b.name.includes("Beautiful"))) ||
        (catKey === "poster" && (b.category.includes("Design") || b.category.includes("Image")));

      if (isAMatch && !isBMatch) return -1;
      if (!isAMatch && isBMatch) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [aiTools, basicInfo.categoryKey]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const updates: Partial<BuilderBasicInfo> = { name: newName };
    // Auto-generate slug if it was empty or matched previous name
    if (!basicInfo.slug || basicInfo.slug === basicInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      updates.slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    onChange(updates);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (!trimmed) return;
    if (!basicInfo.tags.includes(trimmed)) {
      const nextTags = [...basicInfo.tags, trimmed];
      onChange({
        tags: nextTags,
        rawTags: nextTags.join(", "),
      });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const nextTags = basicInfo.tags.filter((t) => t !== tagToRemove);
    onChange({
      tags: nextTags,
      rawTags: nextTags.join(", "),
    });
  };

  return (
    <section className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            01
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Basic Information
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Establish core metadata, category identity, and discovery parameters.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Category Selector (Top priority) */}
      <CategorySelector
        selectedCategoryKey={basicInfo.categoryKey}
        onSelectCategory={onSelectCategory}
        isDirty={!!basicInfo.name || !!basicInfo.description}
      />

      {/* Main Core Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Template Name */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Template Name</span>
            <span className="text-emerald-500">*</span>
          </label>
          <Input
            value={basicInfo.name}
            onChange={handleNameChange}
            placeholder="e.g. Minimalist Studio Product Photography"
            className={`font-semibold text-slate-900 dark:text-white ${
              errors?.name ? "border-rose-500 ring-1 ring-rose-500" : ""
            }`}
          />
          {errors?.name && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>URL Slug</span>
            <span className="text-emerald-500">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs text-slate-400 font-mono select-none">
              /templates/
            </span>
            <Input
              value={basicInfo.slug}
              onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              placeholder="minimalist-studio-product"
              className="pl-24 font-mono text-xs text-slate-700 dark:text-slate-300"
            />
          </div>
        </div>

        {/* Subcategory */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Subcategory</span>
            <span className="text-emerald-500">*</span>
          </label>
          <Select
            value={basicInfo.subcategoryId}
            onValueChange={(val) => {
              const sub = subcategories.find((s) => s.id === val);
              onChange({
                subcategoryId: val,
                subcategoryName: sub?.name || "",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assigned AI Tool */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Assigned AI Tool</span>
            <span className="text-emerald-500">*</span>
          </label>
          <Select
            value={activeTool?.id || ""}
            onValueChange={handleToolChange}
          >
            <SelectTrigger className="font-semibold text-xs">
              <SelectValue placeholder="Select primary AI tool" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {sortedTools.map((tool) => (
                <SelectItem key={tool.id} value={tool.id}>
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="font-bold">{tool.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({tool.category})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI Model / Engine Version */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Target AI Model / Version</span>
            <span className="text-emerald-500">*</span>
          </label>
          <Select
            value={activeModel?.id || ""}
            onValueChange={handleModelChange}
          >
            <SelectTrigger className="font-mono text-xs" disabled={availableModels.length === 0}>
              <SelectValue placeholder="Select model version" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    {model.isDefault && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        Default
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Short Description */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Short Description</span>
              <span className="text-emerald-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {basicInfo.description.length} / 250
            </span>
          </div>
          <Textarea
            rows={2}
            value={basicInfo.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="A crisp, high-impact overview of what this template generates and who it's for..."
            className="text-xs sm:text-sm text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Thumbnail Image: Upload or Link */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Cover Image / Thumbnail</span>
              <span className="text-emerald-500">*</span>
            </label>

            {/* Toggle tabs: Upload File vs Image Link */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setThumbnailMode("upload")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  thumbnailMode === "upload"
                    ? "bg-white dark:bg-[#131B2A] text-emerald-700 dark:text-emerald-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setThumbnailMode("url")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  thumbnailMode === "url"
                    ? "bg-white dark:bg-[#131B2A] text-emerald-700 dark:text-emerald-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image Link</span>
              </button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Live Visual Preview Box with hover upload trigger */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group relative w-full sm:w-36 h-24 rounded-xl overflow-hidden border cursor-pointer shrink-0 transition-all flex items-center justify-center ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500"
                  : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 hover:border-emerald-500"
              }`}
              title="Click or drop image to upload"
            >
              {basicInfo.thumbnailUrl ? (
                <>
                  <Image
                    src={basicInfo.thumbnailUrl}
                    alt="Thumbnail Preview"
                    fill
                    className="object-cover"
                    unoptimized={basicInfo.thumbnailUrl.startsWith("data:")}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium gap-1">
                    <UploadCloud className="w-4 h-4" />
                    <span>Change Image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-2 text-center">
                  <UploadCloud className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-[10px] font-medium">Click or Drop</span>
                </div>
              )}
            </div>

            {/* Mode-specific Controls */}
            {thumbnailMode === "upload" ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 w-full rounded-xl border border-dashed p-3 flex flex-col justify-center gap-2 transition-colors ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30"
                    : "border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422]/50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-emerald-600" />
                      <span>{uploadedFileName || (basicInfo.thumbnailUrl?.startsWith("data:") ? "Custom Image Uploaded" : "Upload Thumbnail Image")}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      PNG, JPG, WebP, or SVG (Recommended: 16:9 or 1:1, max 10MB)
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="forest"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 text-xs font-bold gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Browse Files</span>
                    </Button>

                    {basicInfo.thumbnailUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearThumbnail}
                        className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1.5"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick Presets row */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Or select preset:
                  </span>
                  {PRESET_THUMBNAILS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        onChange({ thumbnailUrl: preset.url });
                        setUploadedFileName(null);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Link Mode */
              <div className="flex-1 w-full space-y-1.5">
                <Input
                  value={basicInfo.thumbnailUrl}
                  onChange={(e) => {
                    onChange({ thumbnailUrl: e.target.value });
                    setUploadedFileName(null);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="text-xs font-mono text-slate-700 dark:text-slate-300"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Presets:
                  </span>
                  {PRESET_THUMBNAILS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        onChange({ thumbnailUrl: preset.url });
                        setUploadedFileName(null);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Tags</span>
            <span className="text-emerald-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Tag className="w-3.5 h-3.5" />
              </span>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type a tag and press Enter or comma..."
                className="pl-8 text-xs"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              className="text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </div>

          {/* Active Tags list */}
          {basicInfo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {basicInfo.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 hover:text-rose-500 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Advanced Settings & SEO */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center justify-between w-full py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Advanced Metadata & Publishing Settings</span>
            <span className="text-[10px] font-normal text-slate-400">
              (Difficulty, Author, SEO, Visibility)
            </span>
          </div>
          {isAdvancedOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isAdvancedOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-2 animate-in fade-in duration-200">
            {/* Author */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Author / Creator
              </label>
              <Input
                value={basicInfo.author}
                onChange={(e) => onChange({ author: e.target.value })}
                placeholder="AWA Official Team"
                className="text-xs"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Difficulty
              </label>
              <Select
                value={basicInfo.difficulty}
                onValueChange={(val: string) =>
                  onChange({ difficulty: val as "Beginner" | "Intermediate" | "Advanced" })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recommended Model */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Recommended AI Model
              </label>
              <Input
                value={basicInfo.recommendedModel}
                onChange={(e) => onChange({ recommendedModel: e.target.value })}
                placeholder="e.g. Midjourney v6.1 / Claude 3.5 Sonnet"
                className="text-xs"
              />
            </div>

            {/* SEO Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                SEO Meta Title
              </label>
              <Input
                value={basicInfo.seoTitle}
                onChange={(e) => onChange({ seoTitle: e.target.value })}
                placeholder="Leave blank to use template name"
                className="text-xs"
              />
            </div>

            {/* Featured & Popular toggles */}
            <div className="space-y-2 sm:col-span-1 flex flex-col justify-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Badges & Promotion
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={basicInfo.featured}
                    onChange={(e) => onChange({ featured: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={basicInfo.popular}
                    onChange={(e) => onChange({ popular: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Popular</span>
                </label>
              </div>
            </div>

            {/* SEO Description */}
            <div className="space-y-1 sm:col-span-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                SEO Meta Description
              </label>
              <Input
                value={basicInfo.seoDescription}
                onChange={(e) => onChange({ seoDescription: e.target.value })}
                placeholder="Search engine optimized snippet..."
                className="text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

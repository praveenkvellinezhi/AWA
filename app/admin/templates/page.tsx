"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDemo } from "@/lib/demo-context";
import { Template } from "@/lib/types";
import { getTemplatePrompts, combinePrompts } from "@/lib/prompt-utils";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Lightbulb,
  Eye,
  MoreVertical,
  ArrowUpDown,
  LayoutGrid,
  List,
  Pencil,
  Copy,
  Trash2,
  Shield,
  Lock,
  Layers,
  Sparkles,
  BarChart2,
  Check,
} from "lucide-react";

export default function AdminTemplatesPage() {
  const { templates, categories, addTemplate, updateTemplate, deleteTemplate } = useDemo();

  // Primary toggle: Form only visible when button is clicked!
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<"all" | "my" | "published" | "drafts" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("latest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || "cat-image-gen");
  const [formSubcategoryId, setFormSubcategoryId] = useState(
    categories[0]?.subcategories[0]?.id || "sub-img-product"
  );
  const [formDescription, setFormDescription] = useState("");
  const [formAiModel, setFormAiModel] = useState("Midjourney v6.1");
  const [formUiPrompt, setFormUiPrompt] = useState("");
  const [formContextPrompt, setFormContextPrompt] = useState("");
  const [formVisibility, setFormVisibility] = useState("Public");
  const [formRegion, setFormRegion] = useState("Global");
  const [formTags, setFormTags] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [formStyle, setFormStyle] = useState("");

  // Subcategories for selected category in form
  const availableSubcategories = useMemo(() => {
    const cat = categories.find((c) => c.id === formCategoryId);
    return cat?.subcategories || [];
  }, [categories, formCategoryId]);

  // Handle category change in form
  const handleCategoryChange = (newCatId: string) => {
    setFormCategoryId(newCatId);
    const cat = categories.find((c) => c.id === newCatId);
    if (cat && cat.subcategories.length > 0) {
      setFormSubcategoryId(cat.subcategories[0].id);
    } else {
      setFormSubcategoryId("");
    }
  };

  const openNewEditor = () => {
    if (isEditorOpen && !editingTemplateId) {
      setIsEditorOpen(false);
      return;
    }
    setEditingTemplateId(null);
    setFormName("");
    setFormCategoryId(categories[0]?.id || "cat-image-gen");
    setFormSubcategoryId(categories[0]?.subcategories[0]?.id || "sub-img-product");
    setFormDescription("");
    setFormAiModel("Midjourney v6.1");
    setFormUiPrompt("");
    setFormContextPrompt("");
    setFormVisibility("Public");
    setFormRegion("Global");
    setFormTags("");
    setFormDifficulty("Beginner");
    setFormStyle("");
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditEditor = (template: Template) => {
    setEditingTemplateId(template.id);
    setFormName(template.name);
    setFormCategoryId(template.categoryId);
    setFormSubcategoryId(template.subcategoryId || "");
    setFormDescription(template.description);
    setFormAiModel(template.recommendedTools[0]?.modelName || "Midjourney v6.1");
    const prompts = getTemplatePrompts(template);
    setFormUiPrompt(prompts.uiPrompt || template.uiPrompt || "");
    setFormContextPrompt(prompts.contextPrompt || template.contextPrompt || "");
    setFormVisibility(template.isPublished ? "Public" : "Draft");
    setFormRegion("Global");
    setFormTags(template.tags.join(", "));
    setFormDifficulty(template.difficulty);
    setFormStyle(template.style);
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || (!formUiPrompt.trim() && !formContextPrompt.trim())) return;

    const category = categories.find((c) => c.id === formCategoryId);
    const categoryName = category?.name || "Image Generation";
    const subcat = category?.subcategories.find((s) => s.id === formSubcategoryId);
    const subcategoryName = subcat?.name || "Product Photography";
    const tags = formTags.split(",").map((t) => t.trim()).filter(Boolean);

    const recommendedTools = [
      {
        toolId: `tool-${formAiModel.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        toolName: formAiModel.split(" ")[0] || "AI",
        modelName: formAiModel,
        reason: "Optimized model configuration for prompt authoring.",
      },
    ];

    const combinedPrompt = combinePrompts(formUiPrompt.trim(), formContextPrompt.trim());

    if (editingTemplateId) {
      updateTemplate(editingTemplateId, {
        name: formName.trim(),
        categoryId: formCategoryId,
        categoryName,
        subcategoryId: formSubcategoryId,
        subcategoryName,
        description: formDescription.trim(),
        promptText: combinedPrompt,
        uiPrompt: formUiPrompt.trim(),
        contextPrompt: formContextPrompt.trim(),
        tags,
        difficulty: formDifficulty,
        style: formStyle.trim() || "Editorial",
        isPublished: formVisibility === "Public",
        recommendedTools,
      });
    } else {
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: formName.trim(),
        slug: formName.toLowerCase().replace(/\s+/g, "-"),
        categoryId: formCategoryId,
        categoryName,
        subcategoryId: formSubcategoryId,
        subcategoryName,
        description: formDescription.trim(),
        promptText: combinedPrompt,
        uiPrompt: formUiPrompt.trim(),
        contextPrompt: formContextPrompt.trim(),
        safePreviewText: formDescription.trim().slice(0, 100) + "...",
        tags,
        difficulty: formDifficulty,
        style: formStyle.trim() || "Editorial",
        mood: "Modern & Clean",
        recommendedTools,
        thumbnailGradient: "from-emerald-900 via-teal-900 to-slate-900",
        likesCount: 1200,
        savesCount: 850,
        isPublished: formVisibility === "Public",
        createdAt: new Date().toISOString(),
      };
      addTemplate(newTemplate);
    }

    setIsEditorOpen(false);
  };

  // Filtered templates logic
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      // Tab filter
      if (activeTab === "published" && !t.isPublished) return false;
      if (activeTab === "drafts" && t.isPublished) return false;
      if (activeTab === "archived") return false;

      // Category filter
      if (selectedCategory !== "all" && t.categoryId !== selectedCategory && t.categoryName !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus === "published" && !t.isPublished) return false;
      if (selectedStatus === "draft" && t.isPublished) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesCat = t.categoryName.toLowerCase().includes(q);
        const matchesSubcat = t.subcategoryName?.toLowerCase().includes(q);
        const matchesTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesSubcat && !matchesTags) return false;
      }

      return true;
    });
  }, [templates, activeTab, selectedCategory, selectedStatus, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: 128,
      my: 24,
      published: 102,
      drafts: 18,
      archived: 6,
    };
  }, []);

  // Pagination slice
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(start, start + itemsPerPage);
  }, [filteredTemplates, currentPage, itemsPerPage]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(paginatedTemplates.map((t) => t.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds([...selectedRowIds, id]);
    } else {
      setSelectedRowIds(selectedRowIds.filter((rowId) => rowId !== id));
    }
  };

  // Helper for category badge styling matching mockup
  const getCategoryBadgeStyle = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes("image")) {
      return "bg-[#EAF5ED] text-[#008235] border-[#D1E7DD] dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60";
    }
    if (lower.includes("web") || lower.includes("saas")) {
      return "bg-[#EBF5FF] text-[#0284C7] border-[#BAE6FD] dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800/60";
    }
    if (lower.includes("poster") || lower.includes("design")) {
      return "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3] dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60";
    }
    if (lower.includes("video")) {
      return "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE] dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/60";
    }
    return "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/60";
  };

  const getUpdatedRelativeTime = (index: number) => {
    const times = ["2 days ago", "3 days ago", "5 days ago", "1 week ago", "1 week ago", "2 weeks ago"];
    return times[index % times.length];
  };

  const getFormattedUsage = (template: Template, index: number) => {
    const mockUsages = ["2.4K", "1.8K", "3.2K", "980", "1.4K"];
    if (index < mockUsages.length) return mockUsages[index];
    const total = (template.likesCount || 0) + (template.savesCount || 0);
    return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : `${total}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Page Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
          <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">Templates</span>
          <span>&gt;</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Authoring</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/40 border border-[#D1E7DD] dark:border-emerald-500/30 text-[#008235] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Templates & Prompts Authoring
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Create, manage and organize AI templates for your users. Build powerful prompts with categories, subcategories and model settings.
              </p>
            </div>
          </div>

          {/* Actions: Launch Dedicated Visual Builder or Quick Inline */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
            <Button
              variant="outline"
              size="default"
              onClick={openNewEditor}
              className="gap-1.5 text-xs text-slate-600 dark:text-slate-300"
            >
              <span>{isEditorOpen && !editingTemplateId ? "Hide Quick Form" : "Quick Form"}</span>
            </Button>

            <Link href="/admin/templates/new">
              <Button
                variant="forest"
                size="default"
                className="gap-2 shadow-xs"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>+ Add Template (Visual Builder)</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Authoring Section: ONLY VISIBLE WHEN BUTTON IS CLICKED */}
      {isEditorOpen && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Left Column: Create New Template Form (8 cols) */}
          <form
            onSubmit={handleSave}
            className="lg:col-span-8 p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-5"
          >
            {/* Form Title with green round icon */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#008235] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingTemplateId ? "Edit Template" : "Create New Template"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill in the details to create a new AI template.
                </p>
              </div>
            </div>

            {/* Row 1: Template Name, Category, Subcategory using Shadcn Input, Label, Select */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="block mb-1.5">
                  Template Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Professional Product Shot"
                />
              </div>

              <div>
                <Label className="block mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </Label>
                <Select value={formCategoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-1.5">
                  Subcategory <span className="text-rose-500">*</span>
                </Label>
                <Select value={formSubcategoryId} onValueChange={setFormSubcategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Short Description, AI Model using Shadcn Input, Select */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label className="block mb-1.5">Short Description</Label>
                <Input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Briefly describe what this template does..."
                />
              </div>

              <div>
                <Label className="block mb-1.5">AI Model (Optional)</Label>
                <Select value={formAiModel} onValueChange={setFormAiModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Midjourney v6.1">Midjourney v6.1</SelectItem>
                    <SelectItem value="DALL-E 3">DALL-E 3</SelectItem>
                    <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                    <SelectItem value="Runway Gen-3">Runway Gen-3</SelectItem>
                    <SelectItem value="Flux.1 Pro">Flux.1 Pro</SelectItem>
                    <SelectItem value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</SelectItem>
                    <SelectItem value="v0 Generative UI">v0 Generative UI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Two Side-by-Side Prompt Textareas using Shadcn Textarea, Label */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: UI Prompt */}
              <div className="space-y-1.5">
                <Label className="text-slate-900 dark:text-white">
                  UI Prompt <span className="text-rose-500">*</span>
                </Label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Prompt used for generating the UI/Visual output.
                </p>
                <div className="relative">
                  <Textarea
                    rows={4}
                    maxLength={4000}
                    value={formUiPrompt}
                    onChange={(e) => setFormUiPrompt(e.target.value)}
                    placeholder="Enter the UI prompt here..."
                    className="pb-6 font-mono"
                  />
                  <div className="absolute right-3 bottom-2 text-[10px] text-slate-400 pointer-events-none">
                    {formUiPrompt.length}/4000
                  </div>
                </div>
              </div>

              {/* Right: Context Prompt */}
              <div className="space-y-1.5">
                <Label className="text-slate-900 dark:text-white flex items-center gap-1">
                  <span className="text-[#008235] font-bold">+</span>
                  <span>Context Prompt</span> <span className="text-rose-500">*</span>
                </Label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Additional context, style guidelines, and constraints.
                </p>
                <div className="relative">
                  <Textarea
                    rows={4}
                    maxLength={4000}
                    value={formContextPrompt}
                    onChange={(e) => setFormContextPrompt(e.target.value)}
                    placeholder="Enter the context prompt here..."
                    className="pb-6 font-mono"
                  />
                  <div className="absolute right-3 bottom-2 text-[10px] text-slate-400 pointer-events-none">
                    {formContextPrompt.length}/4000
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Other Settings using Shadcn Select, Input, Label */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Shield className="h-3.5 w-3.5 text-[#008235]" />
                <span>Other Settings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="block mb-1">Visibility</Label>
                  <Select value={formVisibility} onValueChange={setFormVisibility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Subscribers Only">Subscribers Only</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block mb-1">Region</Label>
                  <Select value={formRegion} onValueChange={setFormRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Global">Global</SelectItem>
                      <SelectItem value="North America">North America</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia">Asia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block mb-1">Tags (optional)</Label>
                  <Input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Add tags.."
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Action Buttons using Shadcn Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditorOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="forest"
                className="gap-2"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Save Template</span>
              </Button>
            </div>
          </form>

          {/* Right Column: Guidance Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Card 1: Authoring Guidelines */}
            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>Authoring Guidelines</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#EAF5ED] text-[#008235] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Write clear, specific and detailed prompts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#EAF5ED] text-[#008235] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Include style and composition details</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#EAF5ED] text-[#008235] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Specify output format and resolution</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#EAF5ED] text-[#008235] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Add relevant tags for better discovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#EAF5ED] text-[#008235] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Test the prompt before publishing</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Pro Tips */}
            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>Pro Tips</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
                <li>Be specific with lighting, style and composition</li>
                <li>Include camera parameters for image prompts</li>
                <li>Mention the intended use case</li>
                <li>Add negative prompts when needed</li>
                <li>Iterate and test with different variations</li>
              </ul>
            </div>

            {/* Card 3: Template Preview */}
            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Eye className="h-4 w-4 text-sky-500" />
                <span>Template Preview</span>
              </div>

              {formName.trim() || formUiPrompt.trim() ? (
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF5ED] text-[#008235]">
                      {categories.find((c) => c.id === formCategoryId)?.name || "Image Generation"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{formAiModel}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {formName || "Untitled Template"}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {formDescription || formUiPrompt || "No description entered."}
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2 bg-slate-50/30 dark:bg-slate-950/30">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                    <Layers className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your template preview will appear here...
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                    Fill in the details to see a preview of how it will look for users.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Catalog & Filter Section: Tab Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "all"
              ? "bg-[#008235] text-white shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <span>All Templates</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "all" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}
          >
            {tabCounts.all}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("my");
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "my"
              ? "bg-[#008235] text-white shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <span>My Templates</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "my" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}
          >
            {tabCounts.my}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("published");
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "published"
              ? "bg-[#008235] text-white shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <span>Published</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "published" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}
          >
            {tabCounts.published}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("drafts");
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "drafts"
              ? "bg-[#008235] text-white shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <span>Drafts</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "drafts" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}
          >
            {tabCounts.drafts}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("archived");
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "archived"
              ? "bg-[#008235] text-white shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <span>Archived</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "archived" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}
          >
            {tabCounts.archived}
          </span>
        </button>
      </div>

      {/* Control Bar: Shadcn Input, Shadcn Selects, View Toggles */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search templates..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown using Shadcn Select */}
          <div className="w-[160px]">
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                setSelectedCategory(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Dropdown using Shadcn Select */}
          <div className="w-[130px]">
            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                setSelectedStatus(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Dropdown using Shadcn Select */}
          <div className="w-[125px]">
            <Select
              value={selectedSort}
              onValueChange={(val) => setSelectedSort(val)}
            >
              <SelectTrigger>
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                  <SelectValue placeholder="Sort" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="usage">Most Used</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggles using Shadcn Button */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            <Button
              variant={viewMode === "grid" ? "forest" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0 rounded-lg"
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "forest" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0 rounded-lg"
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Catalog Table matching mockup */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-10">
                  <Checkbox
                    checked={
                      paginatedTemplates.length > 0 &&
                      selectedRowIds.length === paginatedTemplates.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Template</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Subcategory</th>
                <th className="py-3 px-4 font-semibold">Model</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Usage</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Updated</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {paginatedTemplates.map((template, idx) => {
                const isSelected = selectedRowIds.includes(template.id);
                const modelName =
                  template.recommendedTools[0]?.modelName || "Midjourney v6.1";

                return (
                  <tr
                    key={template.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${
                      isSelected ? "bg-emerald-50/20 dark:bg-emerald-950/20" : ""
                    }`}
                  >
                    {/* Checkbox using Shadcn Checkbox */}
                    <td className="py-3.5 px-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          toggleSelectRow(template.id, checked)
                        }
                      />
                    </td>

                    {/* Template Thumbnail & Name/Description */}
                    <td className="py-3.5 px-4 min-w-[240px]">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-2xs">
                          {template.imageUrl ? (
                            <Image
                              src={template.imageUrl}
                              alt={template.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${
                                template.thumbnailGradient || "from-emerald-800 to-slate-900"
                              } flex items-center justify-center text-white/50 text-[10px] font-bold`}
                            >
                              {template.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block hover:text-[#008235] transition-colors cursor-pointer">
                            {template.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                            {template.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getCategoryBadgeStyle(
                          template.categoryName
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {template.categoryName}
                      </span>
                    </td>

                    {/* Subcategory */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                        {template.subcategoryName || "Product Photography"}
                      </span>
                    </td>

                    {/* Model */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono">
                        <Sparkles className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{modelName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {template.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF5ED] text-[#008235] border border-[#D1E7DD] dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#008235]"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Usage */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <BarChart2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{getFormattedUsage(template, idx)}</span>
                      </div>
                    </td>

                    {/* Updated */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {getUpdatedRelativeTime(idx)}
                    </td>

                    {/* Actions using Shadcn Button and DropdownMenu */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/templates/new?edit=${template.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-[#008235] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit in Visual Builder"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const duplicated: Template = {
                              ...template,
                              id: `template-${Date.now()}`,
                              name: `${template.name} (Copy)`,
                              slug: `${template.slug}-copy`,
                              createdAt: new Date().toISOString(),
                            };
                            addTemplate(duplicated);
                          }}
                          className="h-8 w-8 text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Duplicate template"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="right">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/templates/new?edit=${template.id}`}
                                className="flex items-center cursor-pointer"
                              >
                                <Sparkles className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                                <span>Edit in Visual Builder</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditEditor(template)}>
                              <Pencil className="h-3.5 w-3.5 mr-2 text-slate-400" />
                              <span>Quick Edit Form</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const duplicated: Template = {
                                  ...template,
                                  id: `template-${Date.now()}`,
                                  name: `${template.name} (Copy)`,
                                  slug: `${template.slug}-copy`,
                                  createdAt: new Date().toISOString(),
                                };
                                addTemplate(duplicated);
                              }}
                            >
                              <Copy className="h-3.5 w-3.5 mr-2 text-slate-400" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
                                  deleteTemplate(template.id);
                                }
                              }}
                              className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedTemplates.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No templates found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: Pagination matching screenshot */}
        <div className="py-3 px-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing 1 to {paginatedTemplates.length} of {tabCounts.all} templates
          </div>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 px-2"
            >
              &lt;
            </Button>

            {[1, 2, 3, 4, 5].map((pageNum) => (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "forest" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={`h-7 w-7 p-0 text-xs font-semibold ${
                  currentPage === pageNum ? "shadow-xs" : ""
                }`}
              >
                {pageNum}
              </Button>
            ))}

            <span className="px-1 text-slate-400">..</span>

            <Button
              variant={currentPage === 26 ? "forest" : "ghost"}
              size="sm"
              onClick={() => setCurrentPage(26)}
              className={`h-7 w-7 p-0 text-xs font-semibold ${
                currentPage === 26 ? "shadow-xs" : ""
              }`}
            >
              26
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(26, p + 1))}
              disabled={currentPage === 26}
              className="h-7 px-2"
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { initialTemplates } from "@/lib/mock-data/templates";
import { Template } from "@/lib/types";
import { getTemplatePrompts } from "@/lib/prompt-utils";
import { TemplateTranslateTab } from "@/components/admin/templates/TemplateTranslateTab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Layers,
  Globe,
  History,
  Pencil,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Copy,
  Info,
} from "lucide-react";

export default function AdminTemplateDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const templateId = typeof params?.id === "string" ? params.id : "";
  const initialTab = searchParams.get("tab") || "basic";

  const { templates } = useDemo();

  // Find template from context or fallback to mock catalog
  const template: Template | undefined =
    templates.find((t) => t.id === templateId) ||
    initialTemplates.find((t) => t.id === templateId);

  const [activeTab, setActiveTab] = useState<"basic" | "prompts" | "versions" | "translate">(
    initialTab === "translate" ? "translate" : "basic"
  );

  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  if (!template) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Template Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The requested template ID <code className="font-mono">{templateId}</code> could not be found.
        </p>
        <Link href="/admin/templates">
          <Button variant="outline" size="sm" className="text-xs">
            Return to Templates Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const prompts = getTemplatePrompts(template);
  const uiPrompt = prompts.uiPrompt || template.uiPrompt || template.promptText || "";
  const contextPrompt =
    prompts.contextPrompt ||
    template.contextPrompt ||
    "Ensure consistent aspect ratio, color palette harmony, and brand integrity.";

  const handleCopyPrompt = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyNotice(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopyNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Copy Toast Notice */}
      {copyNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{copyNotice}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/admin/templates"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Templates</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              {template.categoryName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {template.name}
            </h1>
            {template.isPublished ? (
              <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px] font-mono">
                Published
              </Badge>
            ) : (
              <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 text-[10px] font-mono">
                Draft
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl line-clamp-1">
            {template.description}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/admin/templates/new?edit=${template.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium gap-1.5 rounded-xl border-slate-200 dark:border-zinc-700"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500" />
              <span>Visual Builder</span>
            </Button>
          </Link>

          <Link href={`/templates/${template.id}`} target="_blank">
            <Button
              variant="forest"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Catalog Preview</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Tab Bar (Section 41 Spec: Basic Information, Prompts, Versions, Translate) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-zinc-800 shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "basic"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Basic Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("prompts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "prompts"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Prompts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("versions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "versions"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Versions</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            v3
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("translate")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "translate"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Translate</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            Locales
          </span>
        </button>
      </div>

      {/* TAB 1: BASIC INFORMATION */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Overview & Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Core catalog specifications and metadata for this template.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Category
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {template.categoryName}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Subcategory
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {template.subcategoryName || "General"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Difficulty Level
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {template.difficulty || "Beginner"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Recommended Model
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {template.recommendedTools[0]?.modelName || "Midjourney v6.1"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Preview */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Visual Preview
            </h3>
            {template.imageUrl ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-slate-800 to-emerald-950 flex items-center justify-center text-xs text-slate-400">
                No thumbnail uploaded
              </div>
            )}
            <div className="text-[11px] text-slate-500 font-mono space-y-1">
              <div>Slug: {template.slug}</div>
              <div>Likes: {template.likesCount}</div>
              <div>Saves: {template.savesCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROMPTS */}
      {activeTab === "prompts" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Source Prompts (Canonical English)
                </h3>
                <p className="text-xs text-slate-500">
                  Authoring prompt and system instructions. Technical variables and parameters are preserved during translation.
                </p>
              </div>
            </div>

            {/* UI Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  UI Prompt
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyPrompt(uiPrompt, "UI Prompt")}
                  className="h-7 text-[11px] gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {uiPrompt}
              </div>
            </div>

            {/* Context Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  System Context Prompt
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyPrompt(contextPrompt, "Context Prompt")}
                  className="h-7 text-[11px] gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {contextPrompt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERSIONS */}
      {activeTab === "versions" && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Prompt Version History
            </h3>
            <p className="text-xs text-slate-500">
              When a new prompt version is authored, existing translations are marked as Needs Update to prompt localization review.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  v3
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Current Active Version
                    </span>
                    <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px]">
                      Live
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Refined Kling 2.1 cinematic lighting & camera rotation specs
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Sep 20, 2026</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] flex items-center justify-between opacity-75">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-mono font-bold text-xs">
                  v2
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    Version 2
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Integrated Midjourney raw style parameter and bokeh details
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Aug 14, 2026</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-mono font-bold text-xs">
                  v1
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    Initial Release
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Initial prompt authored during platform launch
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Jun 01, 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSLATE (Section 13, 14, 15, 18, 19, 20, 41) */}
      {activeTab === "translate" && (
        <TemplateTranslateTab
          template={template}
          onSavedNotice={(msg) => setCopyNotice(msg)}
        />
      )}
    </div>
  );
}

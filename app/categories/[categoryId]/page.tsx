"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { TemplateCard } from "@/components/template-card";
import {
  Search,
  SlidersHorizontal,
  Cpu,
  Layers,
  X,
} from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = use(params);
  const { categories, templates } = useDemo();

  const category = categories.find((c) => c.id === categoryId);

  // States for subcategory filter, search, model, difficulty, style
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  if (!category) {
    notFound();
  }

  // Collect all unique AI models for templates in this category
  const availableModels = useMemo(() => {
    const categoryTemplates = templates.filter((t) => t.categoryId === category.id);
    const models = new Set<string>();
    categoryTemplates.forEach((t) => {
      t.recommendedTools.forEach((rt) => models.add(rt.modelName));
    });
    return Array.from(models);
  }, [templates, category.id]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (t.categoryId !== category.id) return false;

      // Subcategory filter
      if (selectedSubcategoryId && t.subcategoryId !== selectedSubcategoryId) {
        return false;
      }

      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesStyle = t.style.toLowerCase().includes(q);
        const matchesMood = t.mood.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTags && !matchesStyle && !matchesMood) {
          return false;
        }
      }

      // Model filter (FEAT-003)
      if (selectedModel) {
        const matchesModel = t.recommendedTools.some(
          (rt) => rt.modelName.toLowerCase() === selectedModel.toLowerCase()
        );
        if (!matchesModel) return false;
      }

      // Difficulty filter
      if (selectedDifficulty && t.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [
    templates,
    category.id,
    selectedSubcategoryId,
    searchQuery,
    selectedModel,
    selectedDifficulty,
  ]);

  const activeSubcategory = category.subcategories?.find(
    (s) => s.id === selectedSubcategoryId
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header (Plain Text with Subcategories as Tabs) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Subcategories as Tabs */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="pt-2 border-b border-zinc-800/80">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedSubcategoryId(null)}
                className={`pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                  selectedSubcategoryId === null
                    ? "border-white text-white font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                All
              </button>
              {category.subcategories.map((sub) => {
                const isActive = selectedSubcategoryId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() =>
                      setSelectedSubcategoryId(isActive ? null : sub.id)
                    }
                    className={`pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                      isActive
                        ? "border-white text-white font-bold"
                        : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar (FEAT-002, FEAT-003) */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates in this category by tag, mood, difficulty..."
              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty || ""}
              onChange={(e) => setSelectedDifficulty(e.target.value || null)}
              className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* AI Model Filter Row (FEAT-003) */}
        {availableModels.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-purple-400" /> Target AI Model:
            </span>
            <button
              onClick={() => setSelectedModel(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${selectedModel === null
                  ? "bg-purple-600 text-white font-bold shadow-sm"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
            >
              All Models
            </button>
            {availableModels.map((model) => {
              const active = selectedModel === model;
              return (
                <button
                  key={model}
                  onClick={() => setSelectedModel(active ? null : model)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${active
                      ? "bg-purple-600 text-white font-bold shadow-sm shadow-purple-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  {model}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? "Template" : "Templates"}
          </span>
          {(selectedSubcategoryId || searchQuery || selectedModel || selectedDifficulty) && (
            <button
              onClick={() => {
                setSelectedSubcategoryId(null);
                setSearchQuery("");
                setSelectedModel(null);
                setSelectedDifficulty(null);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredTemplates.length === 0 ? (
          /* Empty State per FEAT-002 */
          <div className="mt-8 p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 space-y-3">
            <SlidersHorizontal className="h-8 w-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Templates Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No template in {category.name} matches your current filter combination.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedSubcategoryId(null);
                  setSearchQuery("");
                  setSelectedModel(null);
                  setSelectedDifficulty(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

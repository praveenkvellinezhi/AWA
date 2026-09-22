"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { Category, Subcategory } from "@/lib/types";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Folder,
  Check,
  X,
  Layers,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useDemo();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState<Record<string, string>>({});

  // New Category Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Folder");

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = `cat-${Date.now()}`;
    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, "-");

    addCategory({
      id,
      name: newCatName.trim(),
      slug,
      description: newCatDesc.trim() || "Curated expert prompts and tool workflows.",
      iconName: newCatIcon,
      accentColor: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30",
      templateCount: 0,
      subcategories: [],
    });

    setNewCatName("");
    setNewCatSlug("");
    setNewCatDesc("");
    setIsCreating(false);
  };

  const handleAddSubcategory = (categoryId: string) => {
    const subName = newSubcategoryName[categoryId]?.trim();
    if (!subName) return;

    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    const newSub: Subcategory = {
      id: `sub-${Date.now()}`,
      name: subName,
      slug: subName.toLowerCase().replace(/\s+/g, "-"),
      description: `Collection of ${subName} templates.`,
      categoryId,
      templateCount: 0,
    };

    updateCategory(categoryId, {
      subcategories: [...(cat.subcategories || []), newSub],
    });

    setNewSubcategoryName({ ...newSubcategoryName, [categoryId]: "" });
  };

  const handleDeleteSubcategory = (categoryId: string, subId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    updateCategory(categoryId, {
      subcategories: (cat.subcategories || []).filter((s) => s.id !== subId),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
            FEAT-029 • Content Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 mt-1">
            <FolderTree className="h-7 w-7 text-indigo-400" />
            Category & Subcategory Hierarchy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain AWA&apos;s unlimited-depth browsable category tree without developer involvement.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* New Category Drawer / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateCategory}
          className="p-6 rounded-2xl border border-indigo-500/40 bg-slate-900/90 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Create New Top-Level Category</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. 3D & Spatial Design"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                placeholder="e.g. 3d-spatial-design (auto-generated if empty)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Brief summary shown to users on the browse screen..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Category Tree List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
          >
            {/* Category Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30">
                  <Folder className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {category.name}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      ID: {category.id}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{category.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Remove category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Subcategories Subsection */}
            <div className="pl-4 sm:pl-8 space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                Subcategories ({category.subcategories?.length || 0})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {category.subcategories?.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{sub.name}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        /{sub.slug}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add subcategory input */}
              <div className="flex items-center gap-2 pt-1 max-w-md">
                <input
                  type="text"
                  placeholder="New subcategory name..."
                  value={newSubcategoryName[category.id] || ""}
                  onChange={(e) =>
                    setNewSubcategoryName({
                      ...newSubcategoryName,
                      [category.id]: e.target.value,
                    })
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubcategory(category.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 shrink-0"
                >
                  + Add Subcategory
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

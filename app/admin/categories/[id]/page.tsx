"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { Category, Subcategory } from "@/lib/types";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  ArrowLeft,
  LayoutGrid,
  Plus,
  Search,
  Folder,
  Layers,
  Calendar,
  Edit,
  Trash2,
  X,
  FileText,
  Camera,
  Film,
  Globe,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Package,
  Hash,
} from "lucide-react";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const { categories, templates, updateCategory, deleteCategory } = useDemo();

  // Find target category
  const category = useMemo(() => {
    return categories.find((c) => c.id === categoryId);
  }, [categories, categoryId]);

  // Form states for Adding New Subcategory
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [subDesc, setSubDesc] = useState("");

  // Edit Subcategory state
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [editSubName, setEditSubName] = useState("");
  const [editSubSlug, setEditSubSlug] = useState("");
  const [editSubDesc, setEditSubDesc] = useState("");

  // Search state for subcategories
  const [searchQuery, setSearchQuery] = useState("");

  // Filter subcategories
  const filteredSubcategories = useMemo(() => {
    if (!category || !category.subcategories) return [];
    return category.subcategories.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [category, searchQuery]);

  // Templates belonging to this category
  const categoryTemplates = useMemo(() => {
    return templates.filter((t) => t.categoryId === categoryId);
  }, [templates, categoryId]);

  // If category not found
  if (!category) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A]">
        <Folder className="h-12 w-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Category Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested category ID &quot;{categoryId}&quot; does not exist or has been removed.
        </p>
        <Link href="/admin/categories">
          <Button variant="forest" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Categories</span>
          </Button>
        </Link>
      </div>
    );
  }

  // Handle Add Subcategory Submit
  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    const newSub: Subcategory = {
      id: `sub-${Date.now()}`,
      name: subName.trim(),
      slug: subSlug.trim() || subName.toLowerCase().replace(/\s+/g, "-"),
      description: subDesc.trim() || `Prompts for ${subName.trim()}`,
      categoryId: category.id,
      templateCount: 0,
    };

    const updatedSubcategories = [...(category.subcategories || []), newSub];
    updateCategory(category.id, {
      subcategories: updatedSubcategories,
    });

    setSubName("");
    setSubSlug("");
    setSubDesc("");
    setIsAddFormOpen(false);
  };

  // Handle Edit Subcategory Submit
  const handleUpdateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub || !editSubName.trim()) return;

    const updatedSubcategories = (category.subcategories || []).map((s) => {
      if (s.id === editingSub.id) {
        return {
          ...s,
          name: editSubName.trim(),
          slug: editSubSlug.trim() || editSubName.toLowerCase().replace(/\s+/g, "-"),
          description: editSubDesc.trim(),
        };
      }
      return s;
    });

    updateCategory(category.id, {
      subcategories: updatedSubcategories,
    });

    setEditingSub(null);
  };

  // Handle Delete Subcategory
  const handleDeleteSubcategory = (subId: string) => {
    if (confirm("Are you sure you want to remove this subcategory?")) {
      const updatedSubcategories = (category.subcategories || []).filter((s) => s.id !== subId);
      updateCategory(category.id, {
        subcategories: updatedSubcategories,
      });
    }
  };

  // Icon mapping
  const renderCategoryIcon = (iconName: string) => {
    const iconProps = { className: "h-6 w-6" };
    switch (iconName) {
      case "Camera":
        return <Camera {...iconProps} />;
      case "Film":
        return <Film {...iconProps} />;
      case "Globe":
        return <Globe {...iconProps} />;
      case "FileText":
        return <FileText {...iconProps} />;
      case "Sparkles":
        return <Sparkles {...iconProps} />;
      default:
        return <Folder {...iconProps} />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link
          href="/admin/categories"
          className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 font-medium"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Categories</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-white font-bold">{category.name}</span>
      </div>

      {/* Hero Category Header Card */}
      <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60 flex items-center justify-center shrink-0 shadow-xs">
              {renderCategoryIcon(category.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {category.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5ED] text-[#008235] border border-[#D1E7DD]">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {category.description}
              </p>
              <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                Slug: /{category.slug}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="forest"
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>{isAddFormOpen ? "Close Form" : "Add Subcategory"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 3 Metric Stats Cards for this Category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Subcategories */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Layers className="h-6 w-6 text-[#008235] dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
              Subcategories
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-tight">
              {category.subcategories?.length || 0}
            </div>
          </div>
        </div>

        {/* Stat 2: Linked Templates */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Package className="h-6 w-6 text-[#008235] dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
              Linked Templates
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-tight">
              {categoryTemplates.length || category.templateCount || 0}
            </div>
          </div>
        </div>

        {/* Stat 3: Created Date */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Calendar className="h-6 w-6 text-[#008235] dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
              Created Date
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono tracking-tight pt-1">
              Jan 12, 2024
            </div>
          </div>
        </div>
      </div>

      {/* Add Subcategory Form Card using Shadcn Components */}
      {isAddFormOpen && (
        <form
          onSubmit={handleAddSubcategory}
          className="p-6 rounded-2xl border border-[#D1E7DD] dark:border-emerald-900/60 bg-white dark:bg-[#131B2A] space-y-4 shadow-lg animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#008235]" />
              Add New Subcategory to {category.name}
            </h3>
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block mb-1.5">
                Subcategory Name *
              </Label>
              <Input
                type="text"
                required
                value={subName}
                onChange={(e) => {
                  setSubName(e.target.value);
                  if (!subSlug) {
                    setSubSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }
                }}
                placeholder="e.g. Product Photography"
              />
            </div>

            <div>
              <Label className="block mb-1.5">
                Subcategory Slug (URL Identifier)
              </Label>
              <Input
                type="text"
                value={subSlug}
                onChange={(e) => setSubSlug(e.target.value)}
                placeholder="e.g. product-photography"
              />
            </div>
          </div>

          <div>
            <Label className="block mb-1.5">
              Description
            </Label>
            <Textarea
              value={subDesc}
              onChange={(e) => setSubDesc(e.target.value)}
              placeholder="Brief summary of subcategory scope..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="forest"
            >
              Save Subcategory
            </Button>
          </div>
        </form>
      )}

      {/* Subcategories List Section */}
      <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#008235]" />
              Subcategories ({category.subcategories?.length || 0})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sub-topics organized under {category.name}.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none z-10" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subcategories..."
              className="pl-9 h-8"
            />
          </div>
        </div>

        {/* List of Subcategories - Full-width spacious row cards */}
        {filteredSubcategories.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2.5">
            <Layers className="h-9 w-9 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No subcategories found</p>
            <p className="text-xs text-slate-400">No matching subcategories in this category.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddFormOpen(true)}
              className="gap-1 mt-2 text-[#008235]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add First Subcategory</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredSubcategories.map((sub, index) => {
              const idxStr = (index + 1).toString().padStart(2, "0");
              const linkedTemplates = templates.filter((t) => t.subcategoryId === sub.id).length;

              return (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:border-[#008235]/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs hover:shadow-xs"
                >
                  {/* Left: Index, Title, Badges, & Description */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 w-6 shrink-0 mt-0.5">
                      {idxStr}
                    </span>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#008235] dark:group-hover:text-emerald-400 transition-colors">
                          {sub.name}
                        </h4>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          /{sub.slug}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-300 border border-[#D1E7DD]/80">
                          <Package className="h-3 w-3" />
                          {linkedTemplates || sub.templateCount || 0} templates linked
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                        {sub.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Framed Action Buttons using Shadcn Button */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80 pt-2 sm:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSub(sub);
                        setEditSubName(sub.name);
                        setEditSubSlug(sub.slug);
                        setEditSubDesc(sub.description);
                      }}
                      className="gap-1.5 h-8 text-xs font-semibold shadow-2xs"
                    >
                      <Edit className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#008235]" />
                      <span>Edit</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteSubcategory(sub.id)}
                      className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 shadow-2xs"
                      title="Delete subcategory"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Subcategory Modal using Shadcn Components */}
      {editingSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateSubcategory}
            className="w-full max-w-md bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Subcategory</h3>
              <button
                type="button"
                onClick={() => setEditingSub(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <Label className="block mb-1.5">
                Subcategory Name *
              </Label>
              <Input
                type="text"
                required
                value={editSubName}
                onChange={(e) => setEditSubName(e.target.value)}
              />
            </div>

            <div>
              <Label className="block mb-1.5">
                Slug
              </Label>
              <Input
                type="text"
                value={editSubSlug}
                onChange={(e) => setEditSubSlug(e.target.value)}
              />
            </div>

            <div>
              <Label className="block mb-1.5">
                Description
              </Label>
              <Textarea
                value={editSubDesc}
                onChange={(e) => setEditSubDesc(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingSub(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="forest"
              >
                Update Subcategory
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

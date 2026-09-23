"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { Category, Subcategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  LayoutGrid,
  Plus,
  Search,
  Folder,
  Package,
  Layers,
  EyeOff,
  Calendar,
  Edit,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  X,
  Trash2,
  Camera,
  Film,
  Globe,
  FileText,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, templates, addCategory, updateCategory, deleteCategory } = useDemo();

  // Search, Filter & Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name-asc");

  // Modal / Drawer state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [managingSubcategoriesCategory, setManagingSubcategoriesCategory] = useState<Category | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New Category Form state
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catIcon, setCatIcon] = useState("Folder");

  // New Subcategory Form state inside management drawer
  const [newSubName, setNewSubName] = useState("");

  // Statistics calculation
  const totalCategories = categories.length;
  const totalProductsOrTemplates = useMemo(() => {
    return categories.reduce((sum, cat) => {
      const templatesInCat = templates.filter((t) => t.categoryId === cat.id).length;
      return sum + Math.max(cat.templateCount || 0, templatesInCat);
    }, 0);
  }, [categories, templates]);

  const activeCategoriesCount = totalCategories; // All active in current demo catalog
  const inactiveCategoriesCount = 0;

  // Filter & Sort categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        const matchesSearch =
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        if (sortOption === "most-templates") return (b.templateCount || 0) - (a.templateCount || 0);
        if (sortOption === "most-subcategories")
          return (b.subcategories?.length || 0) - (a.subcategories?.length || 0);
        return 0;
      });
  }, [categories, searchTerm, sortOption]);

  // Handle Create Category Submit
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const id = `cat-${Date.now()}`;
    const slug = catSlug.trim() || catName.toLowerCase().replace(/\s+/g, "-");

    addCategory({
      id,
      name: catName.trim(),
      slug,
      description: catDesc.trim() || "Curated expert prompts and workflows.",
      iconName: catIcon,
      accentColor: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      templateCount: 0,
      subcategories: [],
    });

    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setIsCreateModalOpen(false);
  };

  // Handle Edit Category Submit
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !catName.trim()) return;

    updateCategory(editingCategory.id, {
      name: catName.trim(),
      slug: catSlug.trim() || catName.toLowerCase().replace(/\s+/g, "-"),
      description: catDesc.trim(),
      iconName: catIcon,
    });

    setEditingCategory(null);
    setCatName("");
    setCatSlug("");
    setCatDesc("");
  };

  // Open Edit Modal prefilled
  const startEditing = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description);
    setCatIcon(cat.iconName || "Folder");
    setActiveMenuId(null);
  };

  // Subcategory management
  const handleAddSubcategory = (catId: string) => {
    if (!newSubName.trim()) return;
    const targetCat = categories.find((c) => c.id === catId);
    if (!targetCat) return;

    const newSub: Subcategory = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      slug: newSubName.toLowerCase().replace(/\s+/g, "-"),
      description: `Collection of ${newSubName} templates.`,
      categoryId: catId,
      templateCount: 0,
    };

    const updatedSubcategories = [...(targetCat.subcategories || []), newSub];
    updateCategory(catId, { subcategories: updatedSubcategories });

    // Update local state if managing subcategories
    if (managingSubcategoriesCategory && managingSubcategoriesCategory.id === catId) {
      setManagingSubcategoriesCategory({
        ...managingSubcategoriesCategory,
        subcategories: updatedSubcategories,
      });
    }

    setNewSubName("");
  };

  const handleDeleteSubcategory = (catId: string, subId: string) => {
    const targetCat = categories.find((c) => c.id === catId);
    if (!targetCat) return;

    const updatedSubcategories = (targetCat.subcategories || []).filter((s) => s.id !== subId);
    updateCategory(catId, { subcategories: updatedSubcategories });

    if (managingSubcategoriesCategory && managingSubcategoriesCategory.id === catId) {
      setManagingSubcategoriesCategory({
        ...managingSubcategoriesCategory,
        subcategories: updatedSubcategories,
      });
    }
  };

  // Helper for Category Icon styling & rendering
  const renderCategoryIcon = (iconName: string, index: number) => {
    const iconProps = { className: "h-5 w-5" };
    let IconComp = Folder;
    if (iconName === "Camera") IconComp = Camera;
    else if (iconName === "Film") IconComp = Film;
    else if (iconName === "Globe") IconComp = Globe;
    else if (iconName === "FileText") IconComp = FileText;
    else if (iconName === "Sparkles") IconComp = Sparkles;

    const colors = [
      { bg: "bg-[#EAF5ED] dark:bg-emerald-950/60", text: "text-[#008235] dark:text-emerald-400", border: "border-[#D1E7DD]" },
      { bg: "bg-blue-50 dark:bg-blue-950/60", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200" },
      { bg: "bg-amber-50 dark:bg-amber-950/60", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200" },
      { bg: "bg-rose-50 dark:bg-rose-950/60", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200" },
      { bg: "bg-purple-50 dark:bg-purple-950/60", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200" },
    ];
    const theme = colors[index % colors.length];

    return (
      <div className={`h-11 w-11 rounded-xl ${theme.bg} ${theme.text} border ${theme.border} flex items-center justify-center shrink-0 shadow-2xs`}>
        <IconComp {...iconProps} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching reference mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 flex items-center justify-center border border-[#D1E7DD] dark:border-emerald-900/60 shrink-0">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Categories
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Organize your AI prompt catalog with categories and subcategories.
            </p>
          </div>
        </div>

        <Button
          variant="forest"
          onClick={() => {
            setEditingCategory(null);
            setCatName("");
            setCatSlug("");
            setCatDesc("");
            setIsCreateModalOpen(true);
          }}
          className="gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* 4 Stat Cards Row matching reference mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Categories */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Folder className="h-6 w-6 text-[#008235] dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
              Total Categories
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-tight">
              {totalCategories}
            </div>
            <div className="text-[11px] font-semibold text-[#008235] dark:text-emerald-400 flex items-center gap-1 truncate">
              <span>▲</span>
              <span>+2 this month</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Total Products / Templates */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Package className="h-6 w-6 text-[#008235] dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
              Total Products
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-tight">
              {totalProductsOrTemplates}
            </div>
            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
              Across all categories
            </div>
          </div>
        </div>

        {/* Stat 3: Active Categories */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Layers className="h-6 w-6 text-[#008235] dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
              Active Categories
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-tight">
              {activeCategoriesCount}
            </div>
            <div className="text-[11px] font-semibold text-[#008235] dark:text-emerald-400 flex items-center gap-1 truncate">
              <CheckCircle2 className="h-3 w-3" />
              <span>100% active</span>
            </div>
          </div>
        </div>

        {/* Stat 4: Inactive Categories */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <EyeOff className="h-6 w-6 text-[#008235] dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
              Inactive Categories
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-tight">
              {inactiveCategoriesCount}
            </div>
            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
              0% inactive
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Row matching reference mockup */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories, description..."
            className="pl-10"
          />
        </div>

        {/* Dropdown Filters using Shadcn Select */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-[145px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[130px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[195px]">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Sort by: Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Sort by: Name (Z-A)</SelectItem>
                <SelectItem value="most-templates">Sort by: Most Products</SelectItem>
                <SelectItem value="most-subcategories">Sort by: Most Subcategories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Flat Category Cards List (NO TREES) matching reference mockup */}
      <div className="space-y-3">
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A]">
            <Folder className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No categories found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search criteria or create a new category.
            </p>
          </div>
        ) : (
          filteredCategories.map((category, index) => {
            const indexStr = (index + 1).toString().padStart(2, "0");
            const subCount = category.subcategories?.length || 0;
            const templateCount = Math.max(
              category.templateCount || 0,
              templates.filter((t) => t.categoryId === category.id).length
            );

            return (
              <div
                key={category.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left Section: Index, Category Icon, Title, Subtitle, & Tag Pills */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Index Number */}
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 w-6 shrink-0">
                    {indexStr}
                  </span>

                  {/* Icon Box */}
                  <Link href={`/admin/categories/${category.id}`} className="shrink-0 hover:opacity-90 transition-opacity">
                    {renderCategoryIcon(category.iconName, index)}
                  </Link>

                  {/* Title & Description & Pills */}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-[#008235] dark:hover:text-emerald-400 transition-colors leading-snug block truncate"
                    >
                      {category.name}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xl">
                      {category.description}
                    </p>

                    {/* Badge Pills */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-[#EAF5ED] dark:hover:bg-emerald-950/40 hover:text-[#008235] transition-colors"
                      >
                        {subCount} subcategories
                      </Link>
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-[#EAF5ED] dark:hover:bg-emerald-950/40 hover:text-[#008235] transition-colors"
                      >
                        {templateCount} products
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Section: Status Badge, Date Created, Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80 pt-3 sm:pt-0">
                  {/* Status & Date */}
                  <div className="text-right flex flex-col items-start sm:items-end gap-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF5ED] dark:bg-emerald-950/50 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#008235] dark:bg-emerald-400" />
                      Active
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created on Jan 12, 2024
                    </span>
                  </div>

                  {/* Actions Buttons matching mockup using Shadcn Button & DropdownMenu */}
                  <div className="flex items-center gap-1.5 relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(category)}
                      className="gap-1.5 h-8 text-xs font-semibold shadow-2xs"
                    >
                      <Edit className="h-3.5 w-3.5 text-slate-500" />
                      <span>Edit</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-slate-500 shadow-2xs"
                          title="More Options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="right" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="flex items-center gap-2"
                          >
                            <Layers className="h-3.5 w-3.5 text-[#008235]" />
                            <span>Subcategories</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                              deleteCategory(category.id);
                            }
                          }}
                          className="text-rose-600 dark:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          <span>Delete Category</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-[#008235] dark:hover:text-emerald-400 transition-colors"
                      title="View Category Detail & Subcategories"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer matching reference mockup */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing 1 to {filteredCategories.length} of {categories.length} categories
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="px-3 py-1 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 font-bold border border-[#D1E7DD] dark:border-emerald-900/60">
            1
          </button>
          <button
            disabled
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Create / Edit Category Modal */}
      {(isCreateModalOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            className="w-full max-w-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="block mb-1.5">
                  Category Name
                </Label>
                <Input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Image Generation"
                />
              </div>

              <div>
                <Label className="block mb-1.5">
                  Slug (URL Identifier)
                </Label>
                <Input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="e.g. image-generation"
                />
              </div>
            </div>

            <div>
              <Label className="block mb-1.5">
                Description
              </Label>
              <Textarea
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Brief summary of this category..."
                rows={3}
              />
            </div>

            <div>
              <Label className="block mb-1.5">
                Icon Type
              </Label>
              <Select value={catIcon} onValueChange={setCatIcon}>
                <SelectTrigger>
                  <SelectValue placeholder="Select icon type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Folder">Folder Icon</SelectItem>
                  <SelectItem value="Camera">Camera / Photography</SelectItem>
                  <SelectItem value="Film">Film / Video</SelectItem>
                  <SelectItem value="Globe">Globe / Web Builder</SelectItem>
                  <SelectItem value="FileText">Document / Copywriting</SelectItem>
                  <SelectItem value="Sparkles">Sparkles / Creative AI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingCategory(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="forest"
              >
                {editingCategory ? "Update Category" : "Save Category"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Subcategory Management Overlay Drawer */}
      {managingSubcategoriesCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Subcategories for {managingSubcategoriesCategory.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage taxonomy &amp; sub-topics under this category.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManagingSubcategoriesCategory(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Existing Subcategories List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(managingSubcategoriesCategory.subcategories?.length || 0) === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No subcategories created yet. Add one below!
                </div>
              ) : (
                managingSubcategoriesCategory.subcategories?.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{sub.name}</span>
                      <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                        /{sub.slug}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSubcategory(managingSubcategoriesCategory.id, sub.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove subcategory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Subcategory Form */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Input
                type="text"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubcategory(managingSubcategoriesCategory.id);
                  }
                }}
                placeholder="New subcategory name..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="forest"
                size="sm"
                onClick={() => handleAddSubcategory(managingSubcategoriesCategory.id)}
                className="shrink-0"
              >
                + Add
              </Button>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setManagingSubcategoriesCategory(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

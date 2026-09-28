"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguages } from "@/lib/hooks/use-translation";
import { ConfiguredLanguage } from "@/lib/types/translation";
import { AddLanguageDialog } from "@/components/admin/languages/AddLanguageDialog";
import { LanguageTableRow } from "@/components/admin/languages/LanguageTableRow";
import { LanguageCard } from "@/components/admin/languages/LanguageCard";
import { TranslationProgressModal } from "@/components/admin/languages/TranslationProgressModal";
import { translationService } from "@/lib/services/translation-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Languages,
  Plus,
  Search,
  CheckCircle2,
  Globe,
  AlertTriangle,
  RotateCw,
  Sparkles,
  TrendingUp,
  Layers,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

export default function AdminLanguagesPage() {
  const router = useRouter();
  const {
    languages,
    isLoading,
    error,
    addLanguage,
    enableLanguage,
    disableLanguage,
  } = useLanguages();

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog & Modal states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLanguageForProgress, setSelectedLanguageForProgress] =
    useState<ConfiguredLanguage | null>(null);

  // Notification toast / alert state
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return languages;
    const q = searchQuery.toLowerCase();
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        (l.nativeName && l.nativeName.toLowerCase().includes(q))
    );
  }, [languages, searchQuery]);

  // Overall metric stats
  const totalLanguages = languages.length;
  const enabledCount = languages.filter(
    (l) => l.status === "enabled" || l.status === "default"
  ).length;

  const totalProgressList = languages.map((l) =>
    translationService.getTranslationProgress(l.code)
  );

  const totalTemplatesAcrossCatalog = totalProgressList.reduce(
    (acc, curr) => acc + curr.totalTemplates,
    0
  );
  const totalCompletedAcrossCatalog = totalProgressList.reduce(
    (acc, curr) => acc + curr.completed,
    0
  );
  const totalFailedAcrossCatalog = totalProgressList.reduce(
    (acc, curr) => acc + curr.failed,
    0
  );

  const overallCompletionRate =
    totalTemplatesAcrossCatalog > 0
      ? Math.round((totalCompletedAcrossCatalog / totalTemplatesAcrossCatalog) * 100)
      : 0;

  // Handlers
  const handleAddLanguageSubmit = (
    name: string,
    code: string,
    enabled: boolean,
    flag: string
  ) => {
    const res = addLanguage(name, code, enabled, flag);
    if (res.success) {
      showNotification(
        `Language "${name}" (${code.toUpperCase()}) successfully configured${
          enabled ? " and translation job queued." : "."
        }`
      );
    }
    return res;
  };

  const handleToggleStatus = (code: string, currentStatus: string) => {
    const lang = languages.find((l) => l.code === code);
    if (!lang || lang.isDefault) return;

    if (currentStatus === "enabled") {
      disableLanguage(code);
      showNotification(
        `Language "${lang.name}" disabled. Existing translations remain safely preserved.`,
        "info"
      );
    } else {
      enableLanguage(code);
      showNotification(
        `Language "${lang.name}" enabled. Translation job initiated for all catalog templates.`
      );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            notification.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
              : notification.type === "info"
              ? "bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100"
              : "bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <p className="text-xs font-semibold">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              FEAT-034 • Localization Architecture
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Simulated Service Ready
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Languages className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            Language & Translation Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage supported catalog languages, queue simulated AI translations across published templates, review translated prompts, and publish localized content.
          </p>
        </div>

        {/* Top Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="font-bold gap-2 text-xs shadow-xs rounded-xl h-10 px-4"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Language</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
              Configured Locales
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {totalLanguages}
              </span>
              <span className="text-xs text-emerald-600 font-semibold font-mono">
                {enabledCount} active
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
              Completed Translations
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {totalCompletedAcrossCatalog}
              </span>
              <span className="text-xs text-slate-500 font-mono">records</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
              Catalog Completion
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {overallCompletionRate}%
              </span>
              <span className="text-xs text-emerald-600 font-mono">live sync</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              totalFailedAcrossCatalog > 0
                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                : "bg-slate-50 dark:bg-slate-800 text-slate-400"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
              Failed / Attention
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-black ${
                  totalFailedAcrossCatalog > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"
                }`}
              >
                {totalFailedAcrossCatalog}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {totalFailedAcrossCatalog > 0 ? "ready for retry" : "all clean"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Languages Table & Search */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-5">
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search language name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Showing {filteredLanguages.length} of {languages.length} languages
            </span>
          </div>
        </div>

        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60">
              <TableRow className="border-b border-slate-200 dark:border-zinc-800">
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Language
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-24">
                  Code
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-28">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-32">
                  Total Templates
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-24">
                  Completed
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-20">
                  Pending
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-24">
                  Failed
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-44">
                  Progress
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 text-right w-28">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLanguages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-slate-400 text-xs">
                    No languages configured matching search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLanguages.map((lang) => (
                  <LanguageTableRow
                    key={lang.code}
                    language={lang}
                    onViewProgress={(l) => setSelectedLanguageForProgress(l)}
                    onToggleStatus={handleToggleStatus}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards View (Visible on small screens) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No languages configured matching search.
            </div>
          ) : (
            filteredLanguages.map((lang) => (
              <LanguageCard
                key={lang.code}
                language={lang}
                onViewProgress={(l) => setSelectedLanguageForProgress(l)}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Language Dialog */}
      <AddLanguageDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddLanguage={handleAddLanguageSubmit}
      />

      {/* Detailed Translation Progress Modal */}
      <TranslationProgressModal
        language={selectedLanguageForProgress}
        open={Boolean(selectedLanguageForProgress)}
        onOpenChange={(open) => {
          if (!open) setSelectedLanguageForProgress(null);
        }}
        onOpenTemplateTranslation={(templateId) => {
          router.push(`/admin/templates/${templateId}?tab=translate`);
        }}
      />
    </div>
  );
}

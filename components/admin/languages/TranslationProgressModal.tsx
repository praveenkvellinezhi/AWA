"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
} from "lucide-react";
import { ConfiguredLanguage, TemplateTranslation, TranslationStatus } from "@/lib/types/translation";
import { useLanguageProgress, useAllTranslations } from "@/lib/hooks/use-translation";

interface TranslationProgressModalProps {
  language: ConfiguredLanguage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTemplateTranslation?: (templateId: string, languageCode: string) => void;
}

export function TranslationProgressModal({
  language,
  open,
  onOpenChange,
  onOpenTemplateTranslation,
}: TranslationProgressModalProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const langCode = language?.code || "";
  const { progress, isProcessing } = useLanguageProgress(langCode);
  const { translations, retryTranslation } = useAllTranslations({
    languageCode: langCode,
  });

  if (!language) return null;

  const filteredTranslations = translations.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = t.templateName.toLowerCase().includes(q);
      const matchUi = t.uiPrompt.toLowerCase().includes(q);
      const matchCtx = t.contextPrompt.toLowerCase().includes(q);
      if (!matchName && !matchUi && !matchCtx) return false;
    }
    return true;
  });

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    await retryTranslation(id);
    setRetryingId(null);
  };

  const getStatusBadge = (status: TranslationStatus) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 gap-1 font-mono text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Published
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800 gap-1 font-mono text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Completed
          </Badge>
        );
      case "translating":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 gap-1 font-mono text-[10px] animate-pulse">
            <RotateCw className="w-3 h-3 animate-spin text-amber-600" />
            Translating
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 gap-1 font-mono text-[10px]">
            <Clock className="w-3 h-3 text-slate-500" />
            Pending
          </Badge>
        );
      case "needs_update":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 gap-1 font-mono text-[10px]">
            <RefreshCw className="w-3 h-3 text-amber-600" />
            Needs Update
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 gap-1 font-mono text-[10px]">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] flex flex-col bg-white dark:bg-[#131B2A] border-slate-200 dark:border-zinc-800 p-6 overflow-hidden">
        <DialogHeader className="shrink-0 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {language.flag}
              </span>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{language.name} Translation Hub</span>
                  <span className="text-xs font-mono font-normal uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {language.code}
                  </span>
                  {isProcessing && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      <RotateCw className="w-3 h-3 animate-spin" />
                      Live Job Active
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time translation state across catalog templates. Failed translations can be safely retried without duplication.
                </DialogDescription>
              </div>
            </div>

            {/* Overall Progress Card */}
            <div className="sm:text-right shrink-0">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {progress.percentage}% Translated
              </span>
              <p className="text-[11px] text-slate-400 font-mono">
                {progress.completed} of {progress.totalTemplates} templates
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <Progress
              value={progress.percentage}
              className="h-2"
              indicatorClassName={
                progress.isComplete
                  ? "bg-emerald-600 dark:bg-emerald-500"
                  : progress.failed > 0
                  ? "bg-amber-500"
                  : "bg-emerald-600 dark:bg-emerald-500"
              }
            />
          </div>

          {/* Stat Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 text-xs">
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              Total: <strong>{progress.totalTemplates}</strong>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 font-mono text-[11px] text-emerald-800 dark:text-emerald-300">
              Completed: <strong>{progress.completed}</strong>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 font-mono text-[11px] text-amber-800 dark:text-amber-300">
              Pending: <strong>{progress.pending}</strong>
            </div>
            {progress.failed > 0 && (
              <div className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 font-mono text-[11px] text-rose-800 dark:text-rose-300 flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Failed: {progress.failed}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Filter & Search Bar */}
        <div className="py-3 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search template name or translated text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="w-full sm:w-48 shrink-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="needs_update">Needs Update</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scrollable Templates Table */}
        <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60 sticky top-0 z-10">
              <TableRow className="border-b border-slate-200 dark:border-zinc-800">
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Template Name
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-24">
                  Version
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 w-32">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 text-right w-36">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTranslations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-400 text-xs">
                    {statusFilter === "failed"
                      ? "No failed translations."
                      : statusFilter === "pending"
                      ? "No pending translations."
                      : "No template translations found matching criteria."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTranslations.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                  >
                    <TableCell className="py-3">
                      <div>
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">
                          {item.templateName}
                        </span>
                        {item.errorMessage && (
                          <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-mono">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{item.errorMessage}</span>
                          </p>
                        )}
                        {item.uiPrompt && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {item.uiPrompt}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      v{item.promptVersionNumber}
                    </TableCell>

                    <TableCell>{getStatusBadge(item.status)}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === "failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetry(item.id)}
                            disabled={retryingId === item.id}
                            className="h-7 text-[11px] font-semibold text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/50 gap-1 rounded-lg"
                          >
                            <RotateCw
                              className={`w-3 h-3 ${retryingId === item.id ? "animate-spin" : ""}`}
                            />
                            <span>Retry</span>
                          </Button>
                        )}

                        {item.status === "needs_update" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetry(item.id)}
                            disabled={retryingId === item.id}
                            className="h-7 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/50 gap-1 rounded-lg"
                          >
                            <RefreshCw
                              className={`w-3 h-3 ${retryingId === item.id ? "animate-spin" : ""}`}
                            />
                            <span>Update</span>
                          </Button>
                        )}

                        {onOpenTemplateTranslation && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              onOpenChange(false);
                              onOpenTemplateTranslation(item.templateId, item.languageCode);
                            }}
                            className="h-7 text-[11px] font-medium text-slate-700 dark:text-slate-300 gap-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Open Translation Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Details</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span>Safe retry enabled: updating in place avoids duplicate records.</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

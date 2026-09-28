"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  MoreVertical,
  Layers,
  Power,
  PowerOff,
  Eye,
  RefreshCw,
} from "lucide-react";
import { ConfiguredLanguage } from "@/lib/types/translation";
import { useLanguageProgress } from "@/lib/hooks/use-translation";

interface LanguageTableRowProps {
  language: ConfiguredLanguage;
  onViewProgress: (lang: ConfiguredLanguage) => void;
  onToggleStatus: (code: string, currentStatus: string) => void;
}

export function LanguageTableRow({
  language,
  onViewProgress,
  onToggleStatus,
}: LanguageTableRowProps) {
  const { progress, isProcessing } = useLanguageProgress(language.code);

  const isDefault = language.isDefault;
  const isEnabled = language.status === "enabled";
  const isDisabled = language.status === "disabled";

  return (
    <TableRow className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
      {/* 1. Language & Flag */}
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none">{language.flag}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {language.name}
              </span>
              {language.nativeName && language.nativeName !== language.name && (
                <span className="text-xs text-slate-400">({language.nativeName})</span>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">
              Locale: {language.code}
            </span>
          </div>
        </div>
      </TableCell>

      {/* 2. ISO Code */}
      <TableCell>
        <span className="font-mono text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase">
          {language.code}
        </span>
      </TableCell>

      {/* 3. Status Badge */}
      <TableCell>
        {isDefault ? (
          <Badge className="bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-mono text-[10px] font-bold">
            Default
          </Badge>
        ) : isEnabled ? (
          <Badge className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-mono text-[10px] font-bold">
            Enabled
          </Badge>
        ) : (
          <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-mono text-[10px]">
            Disabled
          </Badge>
        )}
      </TableCell>

      {/* 4. Total Templates */}
      <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-300">
        {isDisabled ? (
          <span className="text-slate-400">—</span>
        ) : (
          <span>{progress.totalTemplates} Templates</span>
        )}
      </TableCell>

      {/* 5. Completed */}
      <TableCell className="font-mono text-xs">
        {isDisabled ? (
          <span className="text-slate-400">—</span>
        ) : (
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {progress.completed}
          </span>
        )}
      </TableCell>

      {/* 6. Pending */}
      <TableCell className="font-mono text-xs">
        {isDisabled ? (
          <span className="text-slate-400">—</span>
        ) : progress.pending > 0 ? (
          <span className="text-amber-600 dark:text-amber-400 font-bold">{progress.pending}</span>
        ) : (
          <span className="text-slate-400">0</span>
        )}
      </TableCell>

      {/* 7. Failed */}
      <TableCell className="font-mono text-xs">
        {isDisabled ? (
          <span className="text-slate-400">—</span>
        ) : progress.failed > 0 ? (
          <button
            onClick={() => onViewProgress(language)}
            className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold hover:underline"
            title="Click to view and retry failures"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{progress.failed} Failed</span>
          </button>
        ) : (
          <span className="text-slate-400">0</span>
        )}
      </TableCell>

      {/* 8. Progress */}
      <TableCell className="w-44">
        {isDisabled ? (
          <span className="text-xs text-slate-400 font-mono">—</span>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-900 dark:text-white">
                {progress.percentage}%
              </span>
              {isProcessing && (
                <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                  <RotateCw className="w-3 h-3 animate-spin" />
                  <span>translating</span>
                </span>
              )}
            </div>
            <Progress
              value={progress.percentage}
              className="h-2"
              indicatorClassName={
                progress.isComplete
                  ? "bg-emerald-600"
                  : progress.failed > 0
                  ? "bg-amber-500"
                  : "bg-emerald-600"
              }
            />
          </div>
        )}
      </TableCell>

      {/* 9. Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewProgress(language)}
            className="h-8 text-xs font-medium gap-1 rounded-xl"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Details</span>
          </Button>

          {!isDefault && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="right" className="w-44">
                <DropdownMenuItem
                  onClick={() => onViewProgress(language)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>View Progress</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {isEnabled ? (
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(language.code, "enabled")}
                    className="text-xs gap-2 text-rose-600 dark:text-rose-400 cursor-pointer"
                  >
                    <PowerOff className="w-4 h-4" />
                    <span>Disable Language</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(language.code, "disabled")}
                    className="text-xs gap-2 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                  >
                    <Power className="w-4 h-4" />
                    <span>Enable Language</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

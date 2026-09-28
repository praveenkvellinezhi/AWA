"use client";

import React from "react";
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
  MoreVertical,
  Layers,
  Power,
  PowerOff,
  Eye,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { ConfiguredLanguage } from "@/lib/types/translation";
import { useLanguageProgress } from "@/lib/hooks/use-translation";

interface LanguageCardProps {
  language: ConfiguredLanguage;
  onViewProgress: (lang: ConfiguredLanguage) => void;
  onToggleStatus: (code: string, currentStatus: string) => void;
}

export function LanguageCard({
  language,
  onViewProgress,
  onToggleStatus,
}: LanguageCardProps) {
  const { progress, isProcessing } = useLanguageProgress(language.code);

  const isDefault = language.isDefault;
  const isEnabled = language.status === "enabled";
  const isDisabled = language.status === "disabled";

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{language.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {language.name}
              </h3>
              <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                {language.code}
              </span>
            </div>
            {language.nativeName && language.nativeName !== language.name && (
              <span className="text-xs text-slate-400">{language.nativeName}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isDefault ? (
            <Badge className="bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-mono text-[10px]">
              Default
            </Badge>
          ) : isEnabled ? (
            <Badge className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-mono text-[10px]">
              Enabled
            </Badge>
          ) : (
            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              Disabled
            </Badge>
          )}

          {!isDefault && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="right">
                <DropdownMenuItem
                  onClick={() => onViewProgress(language)}
                  className="text-xs gap-2"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isEnabled ? (
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(language.code, "enabled")}
                    className="text-xs gap-2 text-rose-600 dark:text-rose-400"
                  >
                    <PowerOff className="w-4 h-4" />
                    <span>Disable Language</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(language.code, "disabled")}
                    className="text-xs gap-2 text-emerald-600 dark:text-emerald-400"
                  >
                    <Power className="w-4 h-4" />
                    <span>Enable Language</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Progress & Stats */}
      {isDisabled ? (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-400 text-xs italic">
          Language is disabled. Existing translation records remain preserved.
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {progress.totalTemplates} Templates
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-slate-900 dark:text-white">
                {progress.percentage}%
              </span>
              {isProcessing && (
                <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
              )}
            </div>
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

          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[11px]">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
              <span className="block font-bold">{progress.completed}</span>
              <span className="text-[10px] text-emerald-600/80">Completed</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              <span className="block font-bold">{progress.pending}</span>
              <span className="text-[10px] text-amber-600/80">Pending</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">
              <span className="block font-bold">{progress.failed}</span>
              <span className="text-[10px] text-rose-600/80">Failed</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Action */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/80">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewProgress(language)}
          className="w-full text-xs font-semibold gap-1.5 rounded-xl"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>View Translation Progress</span>
        </Button>
      </div>
    </div>
  );
}

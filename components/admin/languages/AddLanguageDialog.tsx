"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, AlertCircle, Plus } from "lucide-react";

interface AddLanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLanguage: (
    name: string,
    code: string,
    enabled: boolean,
    flag: string
  ) => { success: boolean; error?: string };
}

// Preset common flags for quick suggestion
const COMMON_LOCALES: Record<string, string> = {
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇵🇹",
  ru: "🇷🇺",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  ar: "🇸🇦",
  hi: "🇮🇳",
  nl: "🇳🇱",
  tr: "🇹🇷",
  pl: "🇵🇱",
  sv: "🇸🇪",
};

export function AddLanguageDialog({
  open,
  onOpenChange,
  onAddLanguage,
}: AddLanguageDialogProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [flag, setFlag] = useState("🌐");
  const [enabled, setEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z-]/g, "");
    setCode(val);
    setErrorMessage(null);
    if (COMMON_LOCALES[val]) {
      setFlag(COMMON_LOCALES[val]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter a language name.");
      return;
    }

    if (!code.trim()) {
      setErrorMessage("Please enter an ISO language code.");
      return;
    }

    setIsSubmitting(true);
    const result = onAddLanguage(name.trim(), code.trim(), enabled, flag.trim() || "🌐");
    setIsSubmitting(false);

    if (result.success) {
      setName("");
      setCode("");
      setFlag("🌐");
      setEnabled(true);
      onOpenChange(false);
    } else {
      setErrorMessage(result.error || "Unable to add language.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#131B2A] border-slate-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Add Language
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Configure a new language locale. If enabled, AWA will automatically queue and start translating all published templates.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="my-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="lang-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Language Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="lang-name"
                type="text"
                placeholder="e.g. Spanish"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage(null);
                }}
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="lang-code" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Language Code <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="lang-code"
                  type="text"
                  placeholder="e.g. es"
                  value={code}
                  onChange={handleCodeChange}
                  maxLength={5}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lang-flag" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Flag Emoji
                </Label>
                <Input
                  id="lang-flag"
                  type="text"
                  placeholder="🇪🇸"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="text-center text-sm"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={enabled}
                  onCheckedChange={(checked) => setEnabled(Boolean(checked))}
                  className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Enable Language Immediately
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    When enabled, the background translation job will automatically queue and translate prompts for all published catalog templates.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="forest"
              size="sm"
              disabled={isSubmitting}
              className="text-xs font-bold gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Language</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

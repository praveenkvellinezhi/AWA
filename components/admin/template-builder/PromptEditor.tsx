"use client";

import React, { useRef, useState, useMemo } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Plus,
  Tag,
  Code2,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  helperText?: string;
  suggestedVariables?: string[];
  error?: string;
  minRows?: number;
  highlightCategory?: string;
}

export function PromptEditor({
  label,
  value,
  onChange,
  placeholder = "Enter your AI prompt with bracket variables like [SUBJECT] and [STYLE]...",
  helperText,
  suggestedVariables = [
    "[SUBJECT]",
    "[STYLE]",
    "[ENVIRONMENT]",
    "[LIGHTING]",
    "[CAMERA]",
    "[ASPECT_RATIO]",
    "[TOPIC]",
    "[AUDIENCE]",
  ],
  error,
  minRows = 6,
  highlightCategory,
}: PromptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [showVariableDropdown, setShowVariableDropdown] = useState(false);
  const [customVarInput, setCustomVarInput] = useState("");

  // Detect variables currently in the prompt using regex: /\[([A-Z0-9_-]+)\]/g
  const detectedVariables = useMemo(() => {
    if (!value) return [];
    const matches = value.match(/\[([A-Za-z0-9_-]+)\]/g);
    if (!matches) return [];
    return Array.from(new Set(matches));
  }, [value]);

  const insertVariable = (variableName: string) => {
    const formatted = variableName.startsWith("[") && variableName.endsWith("]")
      ? variableName
      : `[${variableName.toUpperCase().replace(/\s+/g, "_")}]`;

    if (!textareaRef.current) {
      onChange(value ? `${value} ${formatted}` : formatted);
      setShowVariableDropdown(false);
      return;
    }

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newValue = `${before}${formatted}${after}`;
    onChange(newValue);

    setShowVariableDropdown(false);
    // Reposition cursor after inserted variable
    setTimeout(() => {
      textarea.focus();
      const nextPos = start + formatted.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 10);
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const tokenEstimate = Math.ceil(wordCount * 1.3);

  return (
    <div className="space-y-2">
      {/* Header with Label & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>{label}</span>
              <span className="text-emerald-500">*</span>
            </label>
            {highlightCategory && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {highlightCategory}
              </span>
            )}
          </div>
          {helperText && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {helperText}
            </p>
          )}
        </div>

        {/* Action Controls: Variable Inserter & Copy */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowVariableDropdown(!showVariableDropdown)}
              className="h-8 text-xs font-semibold gap-1.5 rounded-lg border-emerald-600/30 text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Insert Variable</span>
            </Button>

            {/* Variable Inserter Dropdown Menu */}
            {showVariableDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-64 p-2 bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Suggested Variables
                </div>
                <div className="flex flex-wrap gap-1 p-1 max-h-40 overflow-y-auto">
                  {suggestedVariables.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      className="px-2 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 mb-1">
                    Custom Variable
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={customVarInput}
                      onChange={(e) => setCustomVarInput(e.target.value)}
                      placeholder="e.g. CAMERA_ANGLE"
                      className="flex-1 px-2 py-1 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-hidden focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customVarInput.trim()) {
                          e.preventDefault();
                          insertVariable(customVarInput.trim());
                          setCustomVarInput("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="forest"
                      disabled={!customVarInput.trim()}
                      onClick={() => {
                        insertVariable(customVarInput.trim());
                        setCustomVarInput("");
                      }}
                      className="h-7 text-xs px-2"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!value}
            className="h-8 text-xs font-medium gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Copied
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Textarea Editor Box */}
      <div
        className={`relative rounded-xl border bg-slate-50/50 dark:bg-[#0E1422] transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 ${
          error
            ? "border-rose-500 dark:border-rose-500"
            : "border-slate-200 dark:border-slate-800 focus-within:border-emerald-500"
        }`}
      >
        <textarea
          ref={textareaRef}
          rows={minRows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3.5 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 bg-transparent resize-y focus:outline-hidden leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />

        {/* Footer Bar: Metrics & Token Estimation */}
        <div className="px-3.5 py-2 border-t border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-[#111726]/50 rounded-b-xl flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>{value.length} chars</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3 h-3" />
              ~{tokenEstimate} tokens
            </span>
          </div>

          <div className="text-[10px] text-slate-400">
            Use <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-700 dark:text-slate-200 font-bold">[VARIABLE]</code> syntax
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}

      {/* Detected Variables Pill List */}
      {detectedVariables.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Detected Variables:
          </span>
          {detectedVariables.map((variable) => (
            <span
              key={variable}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60"
            >
              <span>{variable}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

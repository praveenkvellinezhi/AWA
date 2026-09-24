"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkles, Terminal } from "lucide-react";

interface PromptPreviewProps {
  prompt: string;
  categoryBadge?: string;
  label?: string;
  allowCopy?: boolean;
  className?: string;
  maxLines?: number;
}

export function PromptPreview({
  prompt,
  categoryBadge,
  label = "USABLE AI PROMPT",
  allowCopy = true,
  className = "",
  maxLines,
}: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!prompt || prompt.trim().length === 0) {
    return (
      <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-zinc-800 text-center text-xs text-slate-400 dark:text-zinc-500 font-mono">
        No prompt directive defined for this step.
      </div>
    );
  }

  // Tokenize prompt to highlight [VARIABLE] placeholders
  const parts = prompt.split(/(\[[A-Z0-9_\-\s/–—]{2,}\])/g);

  return (
    <div
      className={`relative rounded-xl bg-slate-950/95 dark:bg-[#0A0D14] border border-cyan-500/25 dark:border-cyan-500/20 text-left overflow-hidden shadow-inner font-mono text-xs ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800/80 bg-slate-900/60 dark:bg-black/40">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-cyan-400 tracking-wider font-mono">
            {categoryBadge ? `${label} — ${categoryBadge.toUpperCase()}` : label}
          </span>
        </div>

        {allowCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono flex items-center gap-1.5 transition-all shadow-xs ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-cyan-600/90 hover:bg-cyan-500 text-white hover:shadow-cyan-500/20"
            }`}
            title="Copy prompt"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Prompt Body */}
      <div className="p-3.5 select-text leading-relaxed break-words whitespace-pre-wrap">
        <pre
          className={`font-mono text-slate-200 text-xs ${
            maxLines ? `line-clamp-${maxLines}` : ""
          }`}
        >
          {parts.map((part, i) => {
            if (part.startsWith("[") && part.endsWith("]")) {
              return (
                <span
                  key={i}
                  className="px-1.5 py-0.5 mx-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 font-semibold text-[11px]"
                >
                  {part}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </pre>
      </div>
    </div>
  );
}

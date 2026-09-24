"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { useDemo } from "@/lib/demo-context";

interface FeedbackWidgetProps {
  templateId: string;
  templateName: string;
  recommendedTools?: { toolName: string; modelName: string }[];
}

export function FeedbackWidget({
  templateId,
  templateName,
  recommendedTools = [],
}: FeedbackWidgetProps) {
  const { submitFeedback, activeCustomizedPrompts, customizationHistory } = useDemo();

  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [selectedTool, setSelectedTool] = useState(
    recommendedTools[0]?.modelName || ""
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCustomized = !!activeCustomizedPrompts[templateId];
  const versions = customizationHistory[templateId] || [];
  const latestRequest = versions[0]?.requestText;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    submitFeedback({
      templateId,
      templateName,
      rating,
      comment: comment.trim() || undefined,
      toolUsed: selectedTool || undefined,
      promptType: isCustomized ? "customized" : "base",
      customizationRequestText: isCustomized ? latestRequest : undefined,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5 text-center space-y-2 animate-in fade-in duration-300">
        <CheckCircle2 className="h-7 w-7 text-emerald-400 mx-auto" />
        <h4 className="text-sm font-bold text-white">Thank You for Your Feedback!</h4>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Your feedback helps our team verify how prompts perform across external AI tools and tune prompt engineering templates.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 shadow-sm dark:shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Was this prompt useful?
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Tell us how the result looked on your external AI tool.
          </p>
        </div>

        {/* Rating Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRating("up")}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              rating === "up"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20 scale-105"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Worked Great</span>
          </button>

          <button
            type="button"
            onClick={() => setRating("down")}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              rating === "down"
                ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20 scale-105"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Had Issues</span>
          </button>
        </div>
      </div>

      {rating && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
          {/* Tool selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Which tool did you run this on? (Optional)
              </label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="">-- Select or specify --</option>
                <option value="Midjourney v6.1">Midjourney v6.1</option>
                <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha</option>
                <option value="OpenAI Sora">OpenAI Sora</option>
                <option value="FLUX.1 Schnell">FLUX.1 Schnell</option>
                <option value="Pika 1.5">Pika 1.5</option>
                <option value="v0 by Vercel">v0 by Vercel</option>
                <option value="Gamma App">Gamma App</option>
                <option value="Other">Other tool</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Prompt Version Evaluated
              </label>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300">
                {isCustomized ? "Your Customized Prompt" : "Original Base Expert Prompt"}
              </div>
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Add details or comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Lighting was spot on, but needed 2 tries to get the label text sharp..."
              rows={2}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none shadow-xs"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

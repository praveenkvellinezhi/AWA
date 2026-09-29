"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <Card className="rounded-2xl border-emerald-500/40 bg-emerald-950/20 dark:bg-emerald-950/20 p-6 text-center space-y-2 animate-in fade-in duration-300">
        <CheckCircle2 className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mx-auto" />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Thank You for Your Feedback!</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Your feedback helps our team verify how prompts perform across external AI tools and tune prompt engineering templates.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-sm dark:shadow-xl">
      <CardHeader className="p-5 sm:p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Was this prompt useful?</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Tell us how the result looked on your external AI tool.
            </CardDescription>
          </div>

          {/* Rating Toggles */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={rating === "up" ? "forest" : "outline"}
              size="sm"
              onClick={() => setRating("up")}
              className={`h-9 px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                rating === "up"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 scale-[1.02]"
                  : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Worked Great</span>
            </Button>

            <Button
              type="button"
              variant={rating === "down" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setRating("down")}
              className={`h-9 px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                rating === "down"
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 scale-[1.02]"
                  : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>Had Issues</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {rating && (
        <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t border-slate-200 dark:border-zinc-800 animate-in fade-in duration-200">
            {/* Tool selector and Prompt version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="feedback-tool-select" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Which tool did you run this on? (Optional)
                </Label>
                <Select value={selectedTool} onValueChange={setSelectedTool}>
                  <SelectTrigger id="feedback-tool-select" className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-zinc-800 text-xs">
                    <SelectValue placeholder="-- Select or specify --" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-xl rounded-xl">
                    <SelectItem value="Midjourney v6.1">Midjourney v6.1</SelectItem>
                    <SelectItem value="Runway Gen-3 Alpha">Runway Gen-3 Alpha</SelectItem>
                    <SelectItem value="OpenAI Sora">OpenAI Sora</SelectItem>
                    <SelectItem value="FLUX.1 Schnell">FLUX.1 Schnell</SelectItem>
                    <SelectItem value="Pika 1.5">Pika 1.5</SelectItem>
                    <SelectItem value="v0 by Vercel">v0 by Vercel</SelectItem>
                    <SelectItem value="Gamma App">Gamma App</SelectItem>
                    <SelectItem value="Other">Other tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Prompt Version Evaluated
                </Label>
                <div className="h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-800 dark:text-slate-300 shadow-2xs">
                  <span className="font-medium truncate">
                    {isCustomized ? "Your Customized Prompt" : "Original Base Expert Prompt"}
                  </span>
                  <Badge variant={isCustomized ? "amber" : "secondary"} className="text-[10px] uppercase font-mono font-bold tracking-wider shrink-0">
                    {isCustomized ? "Custom" : "Base"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Comment text */}
            <div className="space-y-1.5">
              <Label htmlFor="feedback-comment" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Add details or comments (Optional)
              </Label>
              <Textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Lighting was spot on, but needed 2 tries to get the label text sharp..."
                rows={3}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 resize-none shadow-2xs p-3"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Feedback</span>
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}

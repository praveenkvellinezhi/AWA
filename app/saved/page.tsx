"use client";

import React from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { TemplateCard } from "@/components/template-card";
import { Bookmark, Compass, ArrowRight, ShieldCheck } from "lucide-react";

export default function SavedTemplatesPage() {
  const { savedTemplateIds, templates, isAuthenticated, setIsDemoControlsExpanded } = useDemo();

  const savedTemplates = templates.filter((t) => savedTemplateIds.includes(t.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              Personal Collection (FEAT-040)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Bookmark className="h-7 w-7 text-amber-400 fill-amber-400" />
            My Saved Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Private bookmarks for templates you plan to reuse in future production workflows.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Compass className="h-4 w-4 text-indigo-400" />
          <span>Browse More</span>
        </Link>
      </div>

      {/* Auth requirement reminder if not signed in */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
          <span>You are currently browsing as a Public visitor. Sign in to save templates to your private account.</span>
          <button
            onClick={() => setIsDemoControlsExpanded(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0 hover:bg-amber-400"
          >
            Sign In via Demo Controls
          </button>
        </div>
      )}

      {/* Empty State per 11-UI-UX.md §16/§28 */}
      {savedTemplates.length === 0 ? (
        <div className="p-16 rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-4 max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Templates Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When you find a prompt template you love, click the bookmark icon to keep it in your personal collection for fast return access.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
            >
              <span>Explore Template Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}

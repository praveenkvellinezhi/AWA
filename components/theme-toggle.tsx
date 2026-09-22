"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  variant?: "icon" | "pill" | "row";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-full bg-zinc-800/40 border border-zinc-700/40 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  if (variant === "row") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          isDark
            ? "text-zinc-300 hover:text-white hover:bg-zinc-800"
            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
        } ${className}`}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <div className="flex items-center gap-2.5">
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-500 transition-transform duration-300 -rotate-12" />
          )}
          <span>{isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            isDark
              ? "bg-zinc-800 text-zinc-400 border-zinc-700"
              : "bg-slate-200/80 text-slate-600 border-slate-300"
          }`}
        >
          {isDark ? "Dark" : "Light"}
        </span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 active:scale-95 shadow-sm ${
          isDark
            ? "bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white shadow-black/20"
            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-950 shadow-slate-200/50"
        } ${className}`}
        title={`Current: ${isDark ? "Dark" : "Light"} Mode (Click to switch)`}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        {isDark ? (
          <>
            <Sun className="h-3.5 w-3.5 text-amber-400 transition-transform duration-300 hover:rotate-90" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Default: icon button (for navbar)
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative group flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 active:scale-90 ${
        isDark
          ? "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-700/80 text-amber-400 shadow-md shadow-black/40 hover:border-amber-500/40"
          : "bg-white hover:bg-slate-100 border-slate-200 text-amber-500 shadow-md shadow-slate-200/60 hover:border-amber-400/60"
      } ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <div className="relative flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
          <Sun className="h-4 w-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center transition-transform duration-500 group-hover:-rotate-12">
          <Moon className="h-4 w-4 text-indigo-600 drop-shadow-[0_0_6px_rgba(99,102,241,0.3)]" />
        </div>
      )}
    </button>
  );
}

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import {
  Search,
  User,
  Sliders,
  Bookmark,
  Heart,
  Shield,
  CreditCard,
  Crown,
  Terminal,
  Play,
  Layers,
  MessageSquare,
  X,
  ArrowRight,
  LogOut,
  LogIn,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    user,
    isAdmin,
    isAuthenticated,
    isSubscriber,
    logout,
    likedTemplateIds,
    savedTemplateIds,
    setIsDemoControlsExpanded,
    categories,
    templates,
  } = useDemo();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalSavedLikedCount = likedTemplateIds.length + savedTemplateIds.length;

  // Generate dynamic breadcrumb segments based on pathname
  const breadcrumbs = useMemo(() => {
    if (!pathname || pathname === "/") return [];

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [];

    // 1. Template detail: /templates/[templateId]
    if (segments[0] === "templates" && segments[1]) {
      const templateId = decodeURIComponent(segments[1]);
      const tmpl = templates.find(
        (t) =>
          t.id === templateId ||
          t.slug === templateId ||
          t.id.toLowerCase() === templateId.toLowerCase()
      );
      if (tmpl) {
        return [
          { label: tmpl.categoryName, href: `/categories/${tmpl.categoryId}` },
          { label: tmpl.name, href: `/templates/${tmpl.id}` },
        ];
      }
      return [
        { label: "Templates", href: "/" },
        { label: templateId.replace(/-/g, " "), href: `/templates/${templateId}` },
      ];
    }

    // 2. Category detail: /categories/[categoryId]
    if (segments[0] === "categories" && segments[1]) {
      const categoryId = segments[1];
      const cat = categories.find((c) => c.id === categoryId);
      if (cat) {
        return [{ label: cat.name, href: `/categories/${cat.id}` }];
      }
      return [
        {
          label: categoryId.replace(/^cat-/, "").replace(/-/g, " "),
          href: `/categories/${categoryId}`,
        },
      ];
    }

    // 3. Admin routes: /admin, /admin/[section]
    if (segments[0] === "admin") {
      const trail = [{ label: "Admin Console", href: "/admin" }];
      if (segments[1]) {
        const subLabel = segments[1]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        trail.push({ label: subLabel, href: `/admin/${segments[1]}` });
      }
      return trail;
    }

    // 4. Other known static routes
    const routeLabels: Record<string, string> = {
      unlimited: "Unlimited Plans",
      collection: "My Collection",
      saved: "Saved Templates",
      liked: "Liked Templates",
      profile: "Account Profile",
      credits: "Credits Store",
      academy: "Design Rocket Academy",
      mcp: "MCP Agent Server",
      backgrounds: "Animated Backgrounds",
      contact: "Contact & Support",
      login: "Sign In / Sign Up",
    };

    if (routeLabels[segments[0]]) {
      return [{ label: routeLabels[segments[0]], href: `/${segments[0]}` }];
    }

    // Default fallback
    return segments.map((seg, idx) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: "/" + segments.slice(0, idx + 1).join("/"),
    }));
  }, [pathname, templates, categories]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchModalOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      setSearchModalOpen(false);
      router.push(`/?search=${encodeURIComponent(navSearchQuery.trim())}#search-section`);
    }
  };

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AC";

  // Do not render the user-side navbar within the Admin Console
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0c0d0f]/95 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 1. Logo, Name & Integrated Header Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-4">
          <Link href="/" className="flex items-center group shrink-0" aria-label="AWA Home">
            <img
              src="/logo/logolight.png"
              alt="AWA"
              className="h-6 sm:h-7 w-auto object-contain block dark:hidden transition-transform group-hover:scale-105"
            />
            <img
              src="/logo/logodark.png"
              alt="AWA"
              className="h-6 sm:h-7 w-auto object-contain hidden dark:block transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Integrated Header Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb navigation"
              className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium pl-2.5 sm:pl-3 border-l border-slate-200 dark:border-zinc-800 min-w-0"
            >
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.href || i}>
                    {i > 0 && (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-600 shrink-0" />
                    )}
                    {isLast ? (
                      <span className="text-slate-900 dark:text-zinc-200 font-semibold truncate max-w-[120px] sm:max-w-[180px] md:max-w-[280px] lg:max-w-[420px]">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-colors truncate max-w-[90px] sm:max-w-[140px] md:max-w-[200px]"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}
        </div>

        {/* 2. Center Navigation Links (Home, Workflows, Templates, Pricing, Blog) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-zinc-400">
          <Link
            href="/"
            className="hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#disciplines"
            className="hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/#catalog"
            className="hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Templates
          </Link>
          {!isSubscriber && (
            <Link
              href="/unlimited"
              className="hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
          )}
          <Link
            href="/academy"
            className="hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* 3. Right Actions: Search + Collection + Theme + Sign In / Get Started */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Icon */}
          <button
            onClick={() => setSearchModalOpen(!searchModalOpen)}
            className="text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-zinc-800/80"
            title="Search templates & prompts"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme Switcher Toggle */}
          <ThemeToggle variant="icon" />

          {/* Saved & Liked Collection Navigation Link */}
          <Link
            href="/collection"
            className={`relative text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-zinc-800/80 ${
              pathname === "/collection" ? "bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-white" : ""
            }`}
            title="Saved and Liked templates"
            aria-label="View Saved and Liked Templates"
          >
            <Bookmark className="h-4 w-4" />
            {totalSavedLikedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-amber-500 px-1 text-[8.5px] font-bold text-slate-950 shadow-sm">
                {totalSavedLikedCount}
              </span>
            )}
          </Link>

          {/* User Auth Buttons when Logged Out matching Reference */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full border border-slate-300 dark:border-zinc-700/90 hover:border-slate-400 dark:hover:border-zinc-500 text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all hover:bg-slate-50 dark:hover:bg-zinc-800/60"
              >
                Sign In
              </Link>
              <Link
                href="/unlimited"
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                Get Started
              </Link>

              {/* Public Quick Menu (Ecosystem + Admin Login) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white transition-colors active:scale-95"
                  title="More Navigation & Administrator"
                  aria-label="More Navigation Menu"
                >
                  <User className="h-4 w-4" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-800 bg-[#141518] p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 border-b border-zinc-800">
                      <p className="text-xs font-bold text-white">Join AWA Community</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Explore 100+ prompt guides &amp; AI workflows</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <Link
                          href="/login"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex-1 text-center py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/login?tab=signup"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex-1 text-center py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>

                    {/* Ecosystem Links */}
                    <div className="py-1 text-xs space-y-0.5">
                      <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 px-3 py-1 block">
                        AWA Ecosystem
                      </span>

                      <Link
                        href="/mcp"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Terminal className="h-3.5 w-3.5 text-orange-400" />
                          <span>MCP Agent Server</span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          NEW
                        </span>
                      </Link>

                      <Link
                        href="/backgrounds"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Layers className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Animated Backgrounds</span>
                      </Link>

                      <Link
                        href="/academy"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Play className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Design Rocket Academy</span>
                      </Link>

                      <Link
                        href="/contact"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Contact &amp; Support</span>
                      </Link>
                    </div>

                    {/* Admin Portal Sign In */}
                    <div className="py-1 border-t border-zinc-800/80 text-xs">
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Shield className="h-4 w-4 text-slate-400" />
                        <span>Administrator Sign In</span>
                      </Link>
                    </div>

                    {/* Theme Toggle Row */}
                    <div className="py-1 border-t border-zinc-800/80">
                      <ThemeToggle variant="row" />
                    </div>

                    {/* Demo Switcher Quick Action */}
                    <div className="pt-2 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsDemoControlsExpanded(true);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-amber-300 text-xs font-mono font-bold transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Sliders className="h-3.5 w-3.5 text-amber-400" />
                          <span>Demo Role Switcher</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-sans">Open</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Profile Icon with Dropdown when Authenticated */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-xs sm:text-sm font-bold text-white transition-all shadow-sm active:scale-95"
                title="Account & Menu Options"
                aria-label="User Account Menu"
              >
                {userInitials}
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-800 bg-[#141518] p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Header */}
                  <div className="p-3 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white truncate max-w-[140px]">
                        {user?.displayName || "Alex Creator"}
                      </span>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                        isAdmin
                          ? "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                          : role === "subscriber"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      }`}>
                        {role}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {user?.email || "alex.creator@awa.guide"}
                    </p>
                  </div>

                  {/* Main Account Links */}
                  <div className="py-1 text-xs space-y-0.5">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <User className="h-4 w-4 text-cyan-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/saved"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bookmark className="h-4 w-4 text-amber-400" />
                        <span>Saved Templates</span>
                      </div>
                      {savedTemplateIds.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                          {savedTemplateIds.length}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/liked"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart className="h-4 w-4 text-rose-400" />
                        <span>Liked Templates</span>
                      </div>
                      {likedTemplateIds.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                          {likedTemplateIds.length}
                        </span>
                      )}
                    </Link>

                    {!isSubscriber && (
                      <Link
                        href="/unlimited"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 transition-colors"
                      >
                        <Crown className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span>AWA Unlimited Plans</span>
                      </Link>
                    )}
                  </div>

                  {/* Ecosystem Links */}
                  <div className="py-1 border-t border-zinc-800/80 text-xs space-y-0.5">
                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 px-3 py-1 block">
                      AWA Ecosystem
                    </span>

                    <Link
                      href="/mcp"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3.5 w-3.5 text-orange-400" />
                        <span>MCP Agent Server</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        NEW
                      </span>
                    </Link>

                    <Link
                      href="/backgrounds"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Layers className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Animated Backgrounds</span>
                    </Link>

                    <Link
                      href="/academy"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Play className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Design Rocket Academy</span>
                    </Link>

                    <Link
                      href="/contact"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Contact &amp; Support</span>
                    </Link>
                  </div>

                  {/* Admin Console (if Admin) */}
                  {isAdmin && (
                    <div className="py-1 border-t border-zinc-800/80 text-xs">
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Shield className="h-4 w-4 text-slate-400" />
                        <span>Administrator Sign In</span>
                      </Link>
                    </div>
                  )}

                  {/* Theme Toggle Row */}
                  <div className="py-1 border-t border-zinc-800/80">
                    <ThemeToggle variant="row" />
                  </div>

                  {/* Demo Switcher & Sign Out Actions */}
                  <div className="pt-2 border-t border-zinc-800 space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setIsDemoControlsExpanded(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-amber-300 text-xs font-mono font-bold transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sliders className="h-3.5 w-3.5 text-amber-400" />
                        <span>Demo Role Switcher</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-sans">Open</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 text-xs font-medium transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Search Modal / Drawer */}
      {searchModalOpen && (
        <div className="border-t border-zinc-800 bg-[#121316] px-4 py-3 sm:px-8 animate-in slide-in-from-top-2 duration-150">
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto max-w-3xl flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                placeholder="Search templates, prompts, or tools (e.g. 'ConSentinel', 'Portfolio', '3D')..."
                className="w-full bg-black/60 border border-zinc-700/80 rounded-full pl-10 pr-10 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              {navSearchQuery && (
                <button
                  type="button"
                  onClick={() => setNavSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-slate-950 text-white dark:bg-white dark:text-black text-xs font-bold hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors shrink-0"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => setSearchModalOpen(false)}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              title="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

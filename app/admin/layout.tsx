"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  LayoutDashboard,
  FolderTree,
  FileText,
  Cpu,
  Tags,
  ListOrdered,
  BarChart3,
  Terminal,
  Sliders,
  CreditCard,
  Eye,
  MessageSquare,
  Languages,
  Lock,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  Menu,
  X,
  LogOut,
  Mail,
  KeyRound,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Zap,
  Search,
  Bell,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAdmin, loginAdmin, logout } = useDemo();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalAdminSearch, setGlobalAdminSearch] = useState("");

  // Admin login form states
  const [adminEmail, setAdminEmail] = useState("admin@awa.guide");
  const [adminPassword, setAdminPassword] = useState("admin-master-2026");
  const [adminPin, setAdminPin] = useState("8921");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!adminEmail || !adminPassword) {
      setErrorMessage("Please enter administrator email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginAdmin(adminEmail);
      setLoading(false);
      setSuccessMessage("Administrator session authenticated!");
    }, 500);
  };

  const handleQuickAdminLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginAdmin("admin@awa.guide");
      setLoading(false);
    }, 300);
  };

  // If not authenticated as Admin, show Admin Login Page
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC] dark:bg-[#0B0F17] relative overflow-hidden transition-colors">
        {/* Ambient security backlights */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 transition-colors">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-[#EAF5ED] dark:bg-emerald-950/40 border border-[#D1E7DD] dark:border-emerald-500/30 text-[#15803D] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Shield className="h-7 w-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#15803D] dark:text-emerald-300 border border-[#D1E7DD] dark:border-emerald-500/30">
                Administrative Security Gateway
              </span>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                Administrator Sign In
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Sign in with administrative credentials to access platform controls, AI prompts, and engine configurations.
              </p>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="block">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400 z-10 pointer-events-none" />
                <Input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@awa.guide"
                  className="pl-10 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="block">
                Master Security Password
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400 z-10 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-10 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 z-10"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="block">
                  Security Passcode / PIN
                </Label>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Hardware Token Ready
                </span>
              </div>
              <Input
                type="text"
                maxLength={6}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="8921"
                className="font-mono tracking-widest text-center"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="forest"
              className="w-full h-11 text-xs sm:text-sm font-bold gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating Master Key...</span>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Enter Administrator Console</span>
                </>
              )}
            </Button>

            {/* Quick Demo 1-Click Login */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full py-2.5 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-[#D1E7DD] dark:border-emerald-700/50 text-[#15803D] dark:text-emerald-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                <span>1-Click Fast Admin Sign In (Demo Mode)</span>
              </button>
            </div>
          </form>

          {/* Return Links */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-center flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Public Catalog</span>
            </Link>
            <Link
              href="/login"
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold transition-colors"
            >
              User Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Categories", href: "/admin/categories", icon: <FolderTree className="h-4 w-4" /> },
    { label: "Templates & Prompts", href: "/admin/templates", icon: <FileText className="h-4 w-4" /> },
    { label: "AI Tools Master", href: "/admin/tools", icon: <Cpu className="h-4 w-4" /> },
    { label: "Reports & Analytics", href: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "AI Rewriter Prompt", href: "/admin/ai-instruction", icon: <Terminal className="h-4 w-4" /> },
    { label: "Payment Gateways", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { label: "Paywall Mode", href: "/admin/visibility", icon: <Eye className="h-4 w-4" /> },
    { label: "Users & Feedback", href: "/admin/feedback", icon: <MessageSquare className="h-4 w-4" /> },
    { label: "Languages & i18n", href: "/admin/languages", icon: <Languages className="h-4 w-4" /> },
  ];

  // Resolve current page label for breadcrumb
  const currentNavItem = navItems.find((item) => item.href === pathname);
  const currentTitle = currentNavItem ? currentNavItem.label : "Admin Console";

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Mobile Admin Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0c0d0f]/95 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">AWA Admin Console</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          {mobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation - Fixed in viewport */}
      <aside
        className={`w-64 shrink-0 border-r border-slate-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d0f]/95 py-4 flex flex-col justify-between h-full overflow-y-auto z-50 md:z-10 transition-transform md:translate-x-0 ${
          mobileSidebarOpen
            ? "fixed inset-y-0 left-0 shadow-2xl translate-x-0"
            : "hidden md:flex -translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-4">
          {/* Brand & Collapse Header matching screenshot */}
          <div className="flex items-start justify-between px-4 pb-1">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                  AWA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Admin Console
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#15803D] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-500/30">
                  v1.0 • Master Mode
                </span>
              </div>
            </div>

            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Collapse navigation"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="text-xs">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                    active
                      ? "bg-[#008235] text-white font-medium"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={active ? "text-white" : "text-slate-500 dark:text-slate-400"}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Links */}
        <div className="pt-4 mt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1 px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900 transition-colors font-medium"
          >
            <ExternalLink className="h-4 w-4 text-slate-500" />
            <span>Back to Public App</span>
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium text-left"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span>Sign Out of Console</span>
          </button>
        </div>
      </aside>

      {/* Main Column with Shared Top Header Bar - Fixed viewport with internal scroll */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar matching screenshot */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0B0F17]/70 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 z-20">
          {/* Breadcrumbs (left on desktop, hidden on tiny mobile) */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link href="/admin" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Admin Console
            </Link>
            {pathname !== "/admin" && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{currentTitle}</span>
              </>
            )}
          </div>

          {/* Search bar in center */}
          <div className="flex-1 max-w-md mx-auto relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Input
              type="text"
              value={globalAdminSearch}
              onChange={(e) => setGlobalAdminSearch(e.target.value)}
              placeholder="Search templates, categories, tools..."
              className="pl-9 h-8"
            />
          </div>

          {/* Right actions: ThemeToggle + Bell + Admin Avatar Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle variant="icon" />

            {/* Notification Bell with emerald indicator */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl h-8 w-8 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#008235] ring-2 ring-white dark:ring-[#0B0F17]" />
            </Button>

            {/* Admin Avatar Pill with Shadcn DropdownMenu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 sm:pl-2 cursor-pointer focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center shadow-xs">
                    A
                  </div>
                  <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span>Admin</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="right" className="w-48">
                <DropdownMenuLabel>Administrator</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => alert("Admin profile: master@awa.guide")}>
                  Profile &amp; Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Security status: Master Mode Active")}>
                  Security Logs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-rose-600 dark:text-rose-400">
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Admin Main Workspace Content - Only this section scrolls */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  );
}

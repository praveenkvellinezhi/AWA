"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
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
  Menu,
  X,
  LogOut,
  Mail,
  KeyRound,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAdmin, loginAdmin, logout } = useDemo();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">
        {/* Ambient security backlights */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#141021] via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/10">
              <Shield className="h-7 w-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Administrative Security Gateway
              </span>
              <h1 className="text-2xl font-black text-white mt-2">
                Administrator Sign In
              </h1>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Sign in with administrative credentials to access platform controls, AI prompts, and engine configurations.
              </p>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@awa.guide"
                  className="w-full bg-slate-900 border border-purple-900/40 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Master Security Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-purple-900/40 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
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
                <label className="block text-xs font-semibold text-slate-300">
                  Security Passcode / PIN
                </label>
                <span className="text-[10px] font-mono text-emerald-400">
                  Hardware Token Ready
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="8921"
                className="w-full bg-slate-900 border border-purple-900/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono tracking-widest text-center"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Master Key...</span>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Enter Administrator Console</span>
                </>
              )}
            </button>

            {/* Quick Demo 1-Click Login */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>1-Click Fast Admin Sign In (Demo Mode)</span>
              </button>
            </div>
          </form>

          {/* Return Links */}
          <div className="pt-3 border-t border-slate-900 text-center flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Public Catalog</span>
            </Link>
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
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
    { label: "Categories & Trees", href: "/admin/categories", icon: <FolderTree className="h-4 w-4" /> },
    { label: "Templates & Prompts", href: "/admin/templates", icon: <FileText className="h-4 w-4" /> },
    { label: "AI Tools Master", href: "/admin/tools", icon: <Cpu className="h-4 w-4" /> },
    { label: "Tool Assignments", href: "/admin/recommendations", icon: <Tags className="h-4 w-4" /> },
    { label: "Usage Guidance", href: "/admin/usage", icon: <ListOrdered className="h-4 w-4" /> },
    { label: "Customization Insights", href: "/admin/insights", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "AI Rewriter Prompt", href: "/admin/ai-instruction", icon: <Terminal className="h-4 w-4" /> },
    { label: "Engine & Spend Controls", href: "/admin/engine-config", icon: <Sliders className="h-4 w-4" /> },
    { label: "Payment Gateways", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { label: "Paywall Mode", href: "/admin/visibility", icon: <Eye className="h-4 w-4" /> },
    { label: "Users & Feedback", href: "/admin/feedback", icon: <MessageSquare className="h-4 w-4" /> },
    { label: "Languages & i18n", href: "/admin/languages", icon: <Languages className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Admin Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-purple-900/40 bg-slate-950">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-400" />
          <span className="font-bold text-sm text-white font-mono">AWA Admin Console</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`w-64 shrink-0 border-r border-purple-900/30 bg-slate-950/95 p-4 space-y-6 md:block ${
          mobileSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/50 border border-purple-800/40">
            <Shield className="h-5 w-5 text-purple-400 shrink-0" />
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-purple-200">
                AWA Admin
              </h2>
              <span className="text-[10px] text-purple-400/80 font-mono">
                Console v1.0 • Master Mode
              </span>
            </div>
          </div>
        </div>

        <nav className="space-y-1 text-xs">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  active
                    ? "bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold shadow-sm"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-900 space-y-1.5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Public App</span>
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/25 transition-colors"
          >
            <LogOut className="h-4 w-4 text-rose-400" />
            <span>Sign Out of Console</span>
          </button>
        </div>
      </aside>

      {/* Admin Main Workspace */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">{children}</main>
    </div>
  );
}

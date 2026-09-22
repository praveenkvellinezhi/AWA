"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import {
  Mail,
  KeyRound,
  User,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  Crown,
  AlertCircle,
  Shield,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser } = useDemo();

  const tabParam = searchParams.get("tab");
  const redirectParam = searchParams.get("redirect");

  // Only User Sign In and User Sign Up in this section
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(
    tabParam === "signup" ? "signup" : "signin"
  );

  // Form states - User
  const [email, setEmail] = useState("alex.creator@awa.guide");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Alex Creator");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam === "admin") {
      // If admin tab was requested, redirect to the separate admin console
      router.push("/admin");
    } else if (tabParam === "signup") {
      setActiveTab("signup");
    } else {
      setActiveTab("signin");
    }
  }, [tabParam, router]);

  const handleUserSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginUser(email, name || "Creator", false);
      setLoading(false);
      setSuccessMessage("Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push(redirectParam || "/");
      }, 700);
    }, 600);
  };

  const handleUserSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password || !name) {
      setErrorMessage("Please fill in all required registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginUser(email, name, false);
      setLoading(false);
      setSuccessMessage("Account created successfully! Welcome to AWA.");
      setTimeout(() => {
        router.push(redirectParam || "/");
      }, 700);
    }, 600);
  };

  const handleQuickSignIn = (asSubscriber: boolean) => {
    setLoading(true);
    setTimeout(() => {
      loginUser(
        asSubscriber ? "subscriber.pro@awa.guide" : "alex.creator@awa.guide",
        asSubscriber ? "Pro Subscriber" : "Alex Creator",
        asSubscriber
      );
      setLoading(false);
      setSuccessMessage(
        asSubscriber
          ? "Logged in with Unlimited Subscriber privileges!"
          : "Logged in as Free User!"
      );
      setTimeout(() => {
        router.push(redirectParam || "/");
      }, 700);
    }, 400);
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-[#0c0d0f] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Top Branding & Nav */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center group mx-auto mb-2" aria-label="AWA Home">
            <img
              src="/logo/logolight.png"
              alt="AWA"
              className="h-9 sm:h-10 w-auto object-contain block dark:hidden transition-transform group-hover:scale-105"
            />
            <img
              src="/logo/logodark.png"
              alt="AWA"
              className="h-9 sm:h-10 w-auto object-contain hidden dark:block transition-transform group-hover:scale-105"
            />
          </Link>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeTab === "signup"
              ? "Create Your AWA Account"
              : "Sign in to Your Account"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
            {activeTab === "signup"
              ? "Join creators crafting with expert prompts and AI tools."
              : "Instant prompts, recommended AI tools, and creation guides."}
          </p>
        </div>

        {/* Auth Mode Tabs (User Sign In vs User Sign Up Only) */}
        <div className="flex rounded-2xl bg-zinc-900/90 p-1.5 border border-zinc-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("signin");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "signin"
                ? "bg-zinc-800 text-white shadow-md font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("signup");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "signup"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Sign Up Free</span>
          </button>
        </div>

        {/* Main Form Container */}
        <div className="rounded-3xl border border-zinc-800 bg-[#121316] p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: USER SIGN IN */}
          {activeTab === "signin" && (
            <form onSubmit={handleUserSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.creator@awa.guide"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Password reset is simulated in this demo. Use password 'password123' or 1-click login below."
                      )
                    }
                    className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-0"
                  />
                  <span>Remember this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-black font-bold text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* 1-Click Fast Logins for Testing */}
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block text-center">
                  Instant 1-Click Simulation Sign In
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickSignIn(false)}
                    className="py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-zinc-700/50"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Free Creator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickSignIn(true)}
                    className="py-2 px-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-indigo-700/50"
                  >
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                    <span>Subscriber</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: USER SIGN UP */}
          {activeTab === "signup" && (
            <form onSubmit={handleUserSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Creator"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.creator@awa.guide"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Free Benefits Checklist */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="text-[11px] font-bold text-zinc-300 block">
                  Free Member Perks Included:
                </span>
                <ul className="text-xs text-zinc-400 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Browse 100+ expert prompt template previews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Save &amp; like favorite templates to personal library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Access Design Rocket Academy video guides</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info and switch link */}
        <div className="text-center text-xs text-zinc-500 space-y-3">
          {activeTab === "signin" ? (
            <p>
              Don&apos;t have an account yet?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2"
              >
                Create one now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2"
              >
                Sign in to your account
              </button>
            </p>
          )}

          {/* Separate Admin Console Link */}
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400/80 hover:text-purple-300 hover:underline transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-purple-400" />
              <span>Are you an administrator? Sign in to Admin Console &rarr;</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] pt-1 text-zinc-600">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Return Home
            </Link>
            <span>•</span>
            <Link href="/unlimited" className="hover:text-zinc-300 transition-colors">
              Unlimited Plans
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-zinc-300 transition-colors">
              Need Help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-zinc-400 font-mono text-xs">
          Loading authentication portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

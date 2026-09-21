"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { Shield, ArrowRight, LogOut, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, user, logout } = useDemo();

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/10">
        <Shield className="h-8 w-8" />
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Active Administrator Session</span>
        </div>
        <h1 className="text-2xl font-black text-white">Administrator Access Active</h1>
        <p className="text-xs text-slate-400 mt-2">
          Signed in as <strong className="text-purple-300">{user?.email || "admin@awa.guide"}</strong> with full platform and catalog control privileges.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/admin"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-lg shadow-purple-600/25"
        >
          <span>Open Admin Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <button
          onClick={() => {
            logout();
            router.push("/admin");
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-semibold transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

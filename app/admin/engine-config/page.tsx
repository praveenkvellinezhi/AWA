"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sliders, ArrowRight } from "lucide-react";

export default function AdminEngineConfigPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="p-8 max-w-md mx-auto text-center space-y-4">
      <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
        <Sliders className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Redirecting to Admin Dashboard...
      </h2>
      <p className="text-xs text-slate-500">
        Engine and spend controls have been removed from the platform administration.
      </p>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008235] text-white text-xs font-semibold"
      >
        <span>Return to Dashboard</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

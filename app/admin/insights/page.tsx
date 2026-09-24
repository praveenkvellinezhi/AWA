"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";

export default function AdminInsightsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/reports");
  }, [router]);

  return (
    <div className="p-8 max-w-md mx-auto text-center space-y-4">
      <div className="h-12 w-12 rounded-2xl bg-[#EAF5ED] text-[#008235] flex items-center justify-center mx-auto">
        <BarChart3 className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Redirecting to Reports &amp; Analytics...
      </h2>
      <p className="text-xs text-slate-500">
        Customization insights are now integrated into the comprehensive platform reports section.
      </p>
      <Link
        href="/admin/reports"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008235] text-white text-xs font-semibold"
      >
        <span>Open Reports</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

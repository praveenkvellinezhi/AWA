"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function AdminRecommendationsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/templates");
  }, [router]);

  return (
    <div className="p-8 max-w-md mx-auto text-center space-y-4">
      <div className="h-12 w-12 rounded-2xl bg-[#EAF5ED] text-[#008235] flex items-center justify-center mx-auto">
        <FileText className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Redirecting to Templates &amp; Prompts...
      </h2>
      <p className="text-xs text-slate-500">
        AI model and tool assignments are managed directly inside the template creation and edit workflow.
      </p>
      <Link
        href="/admin/templates"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008235] text-white text-xs font-semibold"
      >
        <span>Open Templates &amp; Prompts</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

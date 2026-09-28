"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSupport } from "@/lib/support-context";
import { SupportSummaryCards } from "@/components/admin/support/SupportSummaryCards";
import { SupportFilters, SupportFilterValues } from "@/components/admin/support/SupportFilters";
import { SupportRequestTable } from "@/components/admin/support/SupportRequestTable";
import { SupportRequestDetail } from "@/components/admin/support/SupportRequestDetail";
import { SupportResolutionModal } from "@/components/admin/support/SupportResolutionModal";
import { SupportRequest, SupportStatus, SupportPriority, SupportCategory } from "@/lib/types";
import { Headphones, LifeBuoy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_FILTERS: SupportFilterValues = {
  searchQuery: "",
  status: "all",
  category: "all",
  priority: "all",
  assignedTo: "all",
};

export default function AdminSupportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketIdParam = searchParams.get("id");

  const {
    requests,
    isLoading,
    selectedRequestId,
    setSelectedRequestId,
    updateStatus,
    updatePriority,
    updateCategory,
    assignRequest,
    addMessage,
    addInternalNote,
    resetSupportData,
  } = useSupport();

  // Filters state
  const [filters, setFilters] = useState<SupportFilterValues>(DEFAULT_FILTERS);

  // Active resolution modal state
  const [resolvingRequest, setResolvingRequest] = useState<SupportRequest | null>(null);

  // Sync selected request with URL param or internal state
  const activeRequestId = ticketIdParam || selectedRequestId;
  const activeRequest = useMemo(() => {
    if (!activeRequestId) return null;
    return requests.find((r) => r.id === activeRequestId) || null;
  }, [requests, activeRequestId]);

  const handleSelectRequest = (req: SupportRequest) => {
    setSelectedRequestId(req.id);
    router.push(`/admin/support?id=${req.id}`);
  };

  const handleBackToList = () => {
    setSelectedRequestId(null);
    router.push("/admin/support");
  };

  // Filter requests based on search query, status, category, priority, assignee
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // 1. Search query (User name, email, subject, ID, message contents)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesUser = r.user.name.toLowerCase().includes(q);
        const matchesEmail = r.user.email.toLowerCase().includes(q);
        const matchesSubject = r.subject.toLowerCase().includes(q);
        const matchesMessages = r.messages.some((m) =>
          m.message.toLowerCase().includes(q)
        );

        if (!matchesId && !matchesUser && !matchesEmail && !matchesSubject && !matchesMessages) {
          return false;
        }
      }

      // 2. Status filter
      if (filters.status !== "all" && r.status !== filters.status) {
        return false;
      }

      // 3. Category filter
      if (filters.category !== "all" && r.category !== filters.category) {
        return false;
      }

      // 4. Priority filter
      if (filters.priority !== "all" && r.priority !== filters.priority) {
        return false;
      }

      // 5. Assigned To filter
      if (filters.assignedTo !== "all") {
        if (filters.assignedTo === "unassigned") {
          if (r.assignedTo && r.assignedTo !== "unassigned") return false;
        } else {
          if (r.assignedTo !== filters.assignedTo) return false;
        }
      }

      return true;
    });
  }, [requests, filters]);

  // If viewing a single request detail, render Detail View (Fit to screen, zero outer scrolling)
  if (activeRequest) {
    return (
      <div className="w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden p-2 sm:p-3 bg-slate-50/60 dark:bg-[#0B0F17]">
        <SupportRequestDetail
          request={activeRequest}
          onBack={handleBackToList}
          onUpdateStatus={updateStatus}
          onUpdatePriority={updatePriority}
          onUpdateCategory={updateCategory}
          onAssign={assignRequest}
          onSendMessage={addMessage}
          onAddInternalNote={addInternalNote}
          onRequestResolve={(req) => setResolvingRequest(req)}
        />

        {/* Resolution Modal */}
        <SupportResolutionModal
          request={resolvingRequest}
          isOpen={Boolean(resolvingRequest)}
          onClose={() => setResolvingRequest(null)}
          onConfirmResolve={(reqId, summary) => updateStatus(reqId, "resolved", summary)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
      {/* =================================================================== */}
      {/* PAGE HEADER */}
      {/* =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Contact & Support
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
              Manage user requests, issues, and support conversations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetSupportData}
            title="Reset support tickets to initial mock dataset"
            className="h-9 px-3.5 text-xs gap-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/70 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </Button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 1. SUMMARY CARDS (SECTION 4) */}
      {/* =================================================================== */}
      <SupportSummaryCards
        requests={requests}
        selectedStatus={filters.status}
        onSelectStatus={(st) => setFilters((prev) => ({ ...prev, status: st }))}
      />

      {/* =================================================================== */}
      {/* 2. FILTERS & SEARCH BAR (SECTION 7 & 8) */}
      {/* =================================================================== */}
      <SupportFilters
        filters={filters}
        onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onClear={() => setFilters(DEFAULT_FILTERS)}
        totalFiltered={filteredRequests.length}
      />

      {/* =================================================================== */}
      {/* 3. SUPPORT REQUEST LIST: TABLE & MOBILE CARDS (SECTION 5 & 6) */}
      {/* =================================================================== */}
      <SupportRequestTable
        requests={filteredRequests}
        onSelectRequest={handleSelectRequest}
        onUpdateStatus={updateStatus}
        onUpdatePriority={updatePriority}
        onAssign={assignRequest}
        onRequestResolve={(req) => setResolvingRequest(req)}
      />

      {/* Resolution Modal */}
      <SupportResolutionModal
        request={resolvingRequest}
        isOpen={Boolean(resolvingRequest)}
        onClose={() => setResolvingRequest(null)}
        onConfirmResolve={(reqId, summary) => updateStatus(reqId, "resolved", summary)}
      />
    </div>
  );
}

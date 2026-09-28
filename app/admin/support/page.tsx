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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* If viewing a single request detail, render Detail View */}
      {activeRequest ? (
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
      ) : (
        <>
          {/* =================================================================== */}
          {/* PAGE HEADER */}
          {/* =================================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Headphones className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Contact & Support
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Manage user requests, issues, and support conversations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetSupportData}
                title="Reset support tickets to initial mock dataset"
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
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
        </>
      )}

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

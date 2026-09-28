"use client";

import React, { useState } from "react";
import {
  AdminCollection,
  UserCollection,
  CollectionStatus,
  CreateAdminCollectionDTO,
  UpdateAdminCollectionDTO,
} from "@/lib/types/collection";
import {
  useAdminCollections,
  useUserCollections,
  useCollectionMutations,
  useRecommendedCollections,
  useAuditLogs,
} from "@/lib/hooks/use-collections";
import { CollectionTabs } from "@/components/admin/collections/CollectionTabs";
import { AdminCollectionList } from "@/components/admin/collections/AdminCollectionList";
import { AdminCollectionForm } from "@/components/admin/collections/AdminCollectionForm";
import { AdminCollectionDetail } from "@/components/admin/collections/AdminCollectionDetail";
import { UserCollectionList } from "@/components/admin/collections/UserCollectionList";
import { UserCollectionDetail } from "@/components/admin/collections/UserCollectionDetail";
import { AuditLogModal } from "@/components/admin/collections/AuditLogModal";
import { Button } from "@/components/ui/button";
import { Layers, Sparkles, X, CheckCircle2 } from "lucide-react";

export default function AdminCollectionsPage() {
  const [activeTab, setActiveTab] = useState<"admin" | "user">("admin");

  // Admin filter states
  const [adminSearch, setAdminSearch] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState<"all" | CollectionStatus>("all");

  // User filter states
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("all");
  const [userDateRange, setUserDateRange] = useState<"all" | "last7days" | "last30days" | "thisYear">("all");

  // Form Mode: "list" | "create" | "edit"
  const [formMode, setFormMode] = useState<"list" | "create" | "edit">("list");
  const [editingCollection, setEditingCollection] = useState<AdminCollection | null>(null);

  // Dedicated separate page views (no modals)
  const [viewingAdminCollection, setViewingAdminCollection] = useState<AdminCollection | null>(null);
  const [viewingUserCollection, setViewingUserCollection] = useState<UserCollection | null>(null);

  // Audit modal state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Toast message banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Hooks & Service Layer
  const {
    collections: adminCollections,
    isLoading: isAdminLoading,
    refetch: refetchAdmin,
  } = useAdminCollections({
    searchQuery: adminSearch,
    status: adminStatusFilter,
  });

  const {
    userCollections,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useUserCollections({
    searchQuery: userSearch,
    userId: selectedUserId,
    dateRange: userDateRange,
  });

  const { recommendedCollections } = useRecommendedCollections();
  const { logs } = useAuditLogs();

  const {
    createCollection,
    updateCollection,
    updateStatus,
    resetData,
    isSubmitting,
  } = useCollectionMutations();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartCreate = () => {
    setViewingAdminCollection(null);
    setViewingUserCollection(null);
    setEditingCollection(null);
    setFormMode("create");
  };

  const handleStartEdit = (col: AdminCollection) => {
    setViewingAdminCollection(null);
    setViewingUserCollection(null);
    setEditingCollection(col);
    setFormMode("edit");
  };

  const handleFormCancel = () => {
    setFormMode("list");
    setEditingCollection(null);
  };

  const handleFormSubmit = async (dto: CreateAdminCollectionDTO | UpdateAdminCollectionDTO) => {
    if (formMode === "create") {
      await createCollection(dto as CreateAdminCollectionDTO);
      showToast(`Collection "${dto.name}" created successfully.`);
    } else if (formMode === "edit" && editingCollection) {
      await updateCollection(editingCollection.id, dto);
      showToast(`Collection "${dto.name}" updated successfully.`);
    }
    setFormMode("list");
    setEditingCollection(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: CollectionStatus) => {
    const updated = await updateStatus(id, newStatus);
    showToast(
      newStatus === "active"
        ? `"${updated.name}" is now Active and featured in recommendations.`
        : `"${updated.name}" has been deactivated from recommendations.`
    );
    return updated;
  };

  const handleResetDemoData = () => {
    if (confirm("Reset all collections to initial demo mock dataset?")) {
      resetData();
      showToast("Collections restored to default mock dataset.");
    }
  };

  // Dedicated Separate Page View for User Collection (Not a modal!)
  if (viewingUserCollection) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          </div>
        )}
        <UserCollectionDetail
          collection={viewingUserCollection}
          onBack={() => setViewingUserCollection(null)}
        />
      </div>
    );
  }

  // Dedicated Separate Page View for Admin Collection (Not a modal!)
  if (viewingAdminCollection) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          </div>
        )}
        <AdminCollectionDetail
          collection={viewingAdminCollection}
          onBack={() => setViewingAdminCollection(null)}
          onEdit={(col) => {
            setViewingAdminCollection(null);
            handleStartEdit(col);
          }}
          onToggleStatus={async (col) => {
            const nextStatus = col.status === "active" ? "inactive" : "active";
            const updated = await handleUpdateStatus(col.id, nextStatus);
            setViewingAdminCollection(updated);
          }}
        />
      </div>
    );
  }

  // Dedicated Separate Page View for Create / Edit Form
  if (formMode === "create" || formMode === "edit") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        <AdminCollectionForm
          initialCollection={editingCollection}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white dark:hover:text-slate-900 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header (Full Width without max-w) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Collection Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
              Curate recommended template groups for users and audit user-saved collections.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace with Two Clear Tabs */}
      <div className="space-y-5 w-full">
        <CollectionTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          adminCount={adminCollections.length}
          userCount={userCollections.length}
          activeRecommendedCount={recommendedCollections.length}
          onOpenAuditLogs={() => setIsAuditModalOpen(true)}
          onResetDemo={handleResetDemoData}
        />

        {/* Tab 1: Admin Collections */}
        {activeTab === "admin" && (
          <AdminCollectionList
            collections={adminCollections}
            isLoading={isAdminLoading}
            searchQuery={adminSearch}
            onSearchChange={setAdminSearch}
            statusFilter={adminStatusFilter}
            onStatusFilterChange={setAdminStatusFilter}
            onCreateNew={handleStartCreate}
            onEdit={handleStartEdit}
            onView={(col) => setViewingAdminCollection(col)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {/* Tab 2: User Collections (READ-ONLY) */}
        {activeTab === "user" && (
          <UserCollectionList
            collections={userCollections}
            isLoading={isUserLoading}
            searchQuery={userSearch}
            onSearchChange={setUserSearch}
            selectedUserId={selectedUserId}
            onUserFilterChange={setSelectedUserId}
            dateRange={userDateRange}
            onDateRangeChange={setUserDateRange}
            onSelectCollection={(col) => setViewingUserCollection(col)}
          />
        )}
      </div>

      {/* Audit Log Modal */}
      <AuditLogModal
        logs={logs}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}

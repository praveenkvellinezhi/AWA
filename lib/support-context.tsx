"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  SupportRequest,
  SupportStatus,
  SupportPriority,
  SupportCategory,
  SupportMessage,
  SupportInternalNote,
  SupportAttachment,
} from "./types";
import { initialSupportRequests } from "./mock-data/support";
import { useDemo } from "./demo-context";

interface CreateRequestParams {
  category: SupportCategory;
  subject: string;
  message: string;
  attachments?: SupportAttachment[];
  userName?: string;
  userEmail?: string;
}

interface SupportContextType {
  requests: SupportRequest[];
  isLoading: boolean;
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  selectedRequest: SupportRequest | null;
  createRequest: (params: CreateRequestParams) => Promise<string>;
  updateStatus: (requestId: string, status: SupportStatus, resolutionSummary?: string) => void;
  updatePriority: (requestId: string, priority: SupportPriority) => void;
  updateCategory: (requestId: string, category: SupportCategory) => void;
  assignRequest: (requestId: string, assignedTo: string, assignedAdminName?: string) => void;
  addMessage: (
    requestId: string,
    message: string,
    senderType?: "admin" | "user",
    attachments?: SupportAttachment[]
  ) => Promise<void>;
  addInternalNote: (requestId: string, note: string, author?: string) => void;
  getUserRequests: (email?: string) => SupportRequest[];
  resetSupportData: () => void;
}

const SUPPORT_STORAGE_KEY = "awa_support_requests_v3";

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useDemo();
  const [requests, setRequests] = useState<SupportRequest[]>(initialSupportRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SUPPORT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRequests(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load support requests from localStorage:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever requests change
  const saveRequests = (updated: SupportRequest[]) => {
    setRequests(updated);
    try {
      localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save support requests:", e);
    }
  };

  const selectedRequest = useMemo(() => {
    if (!selectedRequestId) return null;
    return requests.find((r) => r.id === selectedRequestId) || null;
  }, [requests, selectedRequestId]);

  // Create new support request (User or Admin)
  const createRequest = async (params: CreateRequestParams): Promise<string> => {
    // Generate new sequential ID (e.g. SUP-000134)
    const existingNums = requests.map((r) => {
      const match = r.id.match(/SUP-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums, 133) : 133;
    const newId = `SUP-${String(maxNum + 1).padStart(6, "0")}`;

    const now = new Date().toISOString();

    const requesterName = params.userName || user?.displayName || "AWA Creator";
    const requesterEmail = params.userEmail || user?.email || "user@example.com";

    const initialMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: requesterName,
      senderType: "user",
      message: params.message,
      attachments: params.attachments || [],
      createdAt: now,
    };

    const newRequest: SupportRequest = {
      id: newId,
      subject: params.subject,
      category: params.category,
      priority: "medium",
      status: "open",
      user: {
        id: user?.id || `usr-${Date.now()}`,
        name: requesterName,
        email: requesterEmail,
        avatarUrl:
          user?.avatarUrl ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
        plan: "Monthly Unlimited",
        country: "United States",
      },
      assignedTo: "unassigned",
      assignedAdminName: "Unassigned",
      messages: [initialMessage],
      internalNotes: [],
      attachments: params.attachments || [],
      createdAt: now,
      updatedAt: now,
    };

    const nextRequests = [newRequest, ...requests];
    saveRequests(nextRequests);
    return newId;
  };

  // Update Status with optional resolution summary
  const updateStatus = (
    requestId: string,
    status: SupportStatus,
    resolutionSummary?: string
  ) => {
    const now = new Date().toISOString();
    const nextRequests = requests.map((r) => {
      if (r.id !== requestId) return r;

      const updates: Partial<SupportRequest> = {
        status,
        updatedAt: now,
      };

      if (status === "resolved") {
        updates.resolvedAt = now;
        if (resolutionSummary) {
          updates.resolutionSummary = resolutionSummary;
        }
      } else if (status === "closed") {
        updates.closedAt = now;
      }

      return { ...r, ...updates };
    });

    saveRequests(nextRequests);
  };

  // Update Priority
  const updatePriority = (requestId: string, priority: SupportPriority) => {
    const nextRequests = requests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            priority,
            updatedAt: new Date().toISOString(),
          }
        : r
    );
    saveRequests(nextRequests);
  };

  // Update Category
  const updateCategory = (requestId: string, category: SupportCategory) => {
    const nextRequests = requests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            category,
            updatedAt: new Date().toISOString(),
          }
        : r
    );
    saveRequests(nextRequests);
  };

  // Assign Request
  const assignRequest = (
    requestId: string,
    assignedTo: string,
    assignedAdminName?: string
  ) => {
    const nextRequests = requests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            assignedTo,
            assignedAdminName:
              assignedAdminName ||
              (assignedTo === "unassigned"
                ? "Unassigned"
                : assignedTo === "adm-1"
                ? "Praveen (Lead Admin)"
                : assignedTo === "adm-2"
                ? "Alex (Engineering Lead)"
                : assignedTo === "adm-3"
                ? "Sarah (Support Specialist)"
                : "Support Team"),
            updatedAt: new Date().toISOString(),
          }
        : r
    );
    saveRequests(nextRequests);
  };

  // Add Message (User or Admin Reply)
  const addMessage = async (
    requestId: string,
    messageText: string,
    senderType: "admin" | "user" = isAdmin ? "admin" : "user",
    attachments?: SupportAttachment[]
  ) => {
    const now = new Date().toISOString();
    const senderName =
      senderType === "admin"
        ? "AWA Support Team"
        : user?.displayName || "You";

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: senderName,
      senderType,
      message: messageText,
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      createdAt: now,
    };

    const nextRequests = requests.map((r) => {
      if (r.id !== requestId) return r;

      // If admin replies and ticket was open, move to in-progress
      let nextStatus = r.status;
      if (senderType === "admin" && r.status === "open") {
        nextStatus = "in-progress";
      }

      return {
        ...r,
        status: nextStatus,
        messages: [...r.messages, newMessage],
        updatedAt: now,
      };
    });

    saveRequests(nextRequests);
  };

  // Add Internal Admin Note (Strictly not visible to users)
  const addInternalNote = (
    requestId: string,
    noteText: string,
    authorName: string = "Admin Team"
  ) => {
    const now = new Date().toISOString();
    const newNote: SupportInternalNote = {
      id: `note-${Date.now()}`,
      author: authorName,
      note: noteText,
      createdAt: now,
    };

    const nextRequests = requests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            internalNotes: [newNote, ...r.internalNotes],
            updatedAt: now,
          }
        : r
    );

    saveRequests(nextRequests);
  };

  // Get user-specific requests
  const getUserRequests = (email?: string): SupportRequest[] => {
    const targetEmail = (email || user?.email || "").toLowerCase().trim();
    if (!targetEmail) return requests.slice(0, 3); // Fallback demo subset
    return requests.filter(
      (r) => r.user.email.toLowerCase().trim() === targetEmail
    );
  };

  // Reset to initial mock data
  const resetSupportData = () => {
    localStorage.removeItem(SUPPORT_STORAGE_KEY);
    setRequests(initialSupportRequests);
    setSelectedRequestId(null);
  };

  return (
    <SupportContext.Provider
      value={{
        requests,
        isLoading,
        selectedRequestId,
        setSelectedRequestId,
        selectedRequest,
        createRequest,
        updateStatus,
        updatePriority,
        updateCategory,
        assignRequest,
        addMessage,
        addInternalNote,
        getUserRequests,
        resetSupportData,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error("useSupport must be used within a SupportProvider");
  }
  return context;
}

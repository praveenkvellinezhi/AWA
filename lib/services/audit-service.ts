import { AuditLogEntry } from "../types/collection";

class ClientAuditService {
  private logs: AuditLogEntry[] = [];
  private listeners: ((logs: AuditLogEntry[]) => void)[] = [];

  constructor() {
    // Seed with a few recent initial events
    this.logs = [
      {
        id: "audit-001",
        action: "create",
        collectionId: "col-admin-001",
        collectionName: "Business Templates",
        timestamp: "2026-09-10T08:30:00Z",
        details: "Admin initialized curated collection with 4 templates",
      },
      {
        id: "audit-002",
        action: "deactivate",
        collectionId: "col-admin-005",
        collectionName: "Product Photography",
        timestamp: "2026-09-25T11:30:00Z",
        details: "Collection deactivated from user recommendations",
      },
      {
        id: "audit-003",
        action: "update",
        collectionId: "col-admin-002",
        collectionName: "Marketing Ideas",
        timestamp: "2026-09-27T14:40:00Z",
        details: "Reordered templates and updated description",
      },
    ];
  }

  log(entry: Omit<AuditLogEntry, "id">): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    this.logs = [newEntry, ...this.logs].slice(0, 50); // Keep last 50
    this.notify();
    return newEntry;
  }

  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  subscribe(listener: (logs: AuditLogEntry[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l([...this.logs]));
  }
}

export const auditService = new ClientAuditService();

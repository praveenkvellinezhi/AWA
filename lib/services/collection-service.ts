import {
  AdminCollection,
  UserCollection,
  AdminCollectionFilters,
  UserCollectionFilters,
  CreateAdminCollectionDTO,
  UpdateAdminCollectionDTO,
  CollectionStatus,
  CollectionTemplateItem,
} from "../types/collection";
import {
  initialAdminCollections,
  initialUserCollections,
  mockTemplatesCatalog,
} from "../mock-data/collections";
import { auditService } from "./audit-service";

const STORAGE_KEY_ADMIN = "awa_admin_collections_v2";
const STORAGE_KEY_USER = "awa_user_collections_v2";

type CollectionListener = () => void;

class CollectionService {
  private adminCollections: AdminCollection[] = [];
  private userCollections: UserCollection[] = [];
  private listeners: CollectionListener[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private sanitizeUserCollections(list: UserCollection[]): UserCollection[] {
    const seen = new Set<string>();
    return list.map((col, idx) => {
      let uniqueId = col.id;
      if (seen.has(uniqueId)) {
        uniqueId = `col-user-00${idx + 1}`;
      }
      seen.add(uniqueId);
      return { ...col, id: uniqueId };
    });
  }

  private init() {
    if (typeof window !== "undefined") {
      try {
        const savedAdmin = localStorage.getItem(STORAGE_KEY_ADMIN);
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);

        if (savedAdmin) {
          this.adminCollections = JSON.parse(savedAdmin);
        } else {
          this.adminCollections = [...initialAdminCollections];
          this.persistAdmin();
        }

        if (savedUser) {
          this.userCollections = this.sanitizeUserCollections(JSON.parse(savedUser));
        } else {
          this.userCollections = this.sanitizeUserCollections([...initialUserCollections]);
          this.persistUser();
        }
      } catch (err) {
        console.warn("Storage access failed, using in-memory mock data:", err);
        this.adminCollections = [...initialAdminCollections];
        this.userCollections = this.sanitizeUserCollections([...initialUserCollections]);
      }
    } else {
      this.adminCollections = [...initialAdminCollections];
      this.userCollections = this.sanitizeUserCollections([...initialUserCollections]);
    }
    this.isInitialized = true;
  }

  private persistAdmin() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(this.adminCollections));
      } catch (e) {
        console.warn("Failed to persist admin collections:", e);
      }
    }
    this.notify();
  }

  private persistUser() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.userCollections));
      } catch (e) {
        console.warn("Failed to persist user collections:", e);
      }
    }
    this.notify();
  }

  subscribe(listener: CollectionListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // =========================================================================
  // TEMPLATES CATALOG (Available for selection)
  // =========================================================================
  async getAvailableTemplates(searchQuery?: string): Promise<CollectionTemplateItem[]> {
    await this.simulateLatency();
    if (!searchQuery?.trim()) return [...mockTemplatesCatalog];
    const q = searchQuery.toLowerCase().trim();
    return mockTemplatesCatalog.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }

  // =========================================================================
  // ADMIN COLLECTIONS
  // =========================================================================

  async getAdminCollections(filters?: AdminCollectionFilters): Promise<AdminCollection[]> {
    await this.simulateLatency();
    let result = [...this.adminCollections];

    if (filters?.status && filters.status !== "all") {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.templates.some((t) => t.name.toLowerCase().includes(q))
      );
    }

    return result;
  }

  async getAdminCollectionById(id: string): Promise<AdminCollection | null> {
    await this.simulateLatency();
    const found = this.adminCollections.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async createAdminCollection(dto: CreateAdminCollectionDTO): Promise<AdminCollection> {
    await this.simulateLatency();

    // Check duplicate templates in payload
    const seenIds = new Set<string>();
    for (const t of dto.templates) {
      if (seenIds.has(t.id)) {
        throw new Error("This template is already included in this collection.");
      }
      seenIds.add(t.id);
    }

    const newCollection: AdminCollection = {
      id: `col-admin-${Date.now()}`,
      name: dto.name.trim(),
      description: dto.description.trim(),
      status: dto.status,
      templates: [...dto.templates],
      templateCount: dto.templates.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.adminCollections = [newCollection, ...this.adminCollections];
    this.persistAdmin();

    auditService.log({
      action: "create",
      collectionId: newCollection.id,
      collectionName: newCollection.name,
      timestamp: new Date().toISOString(),
      details: `Created collection with ${newCollection.templateCount} templates in ${newCollection.status} status.`,
    });

    return newCollection;
  }

  async updateAdminCollection(id: string, dto: UpdateAdminCollectionDTO): Promise<AdminCollection> {
    await this.simulateLatency();
    const index = this.adminCollections.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Admin collection with ID ${id} not found.`);
    }

    const current = this.adminCollections[index];

    // If templates provided, validate no duplicates
    if (dto.templates) {
      const seenIds = new Set<string>();
      for (const t of dto.templates) {
        if (seenIds.has(t.id)) {
          throw new Error("This template is already included in this collection.");
        }
        seenIds.add(t.id);
      }
    }

    const updated: AdminCollection = {
      ...current,
      name: dto.name !== undefined ? dto.name.trim() : current.name,
      description: dto.description !== undefined ? dto.description.trim() : current.description,
      status: dto.status !== undefined ? dto.status : current.status,
      templates: dto.templates !== undefined ? [...dto.templates] : current.templates,
      templateCount: dto.templates !== undefined ? dto.templates.length : current.templates.length,
      updatedAt: new Date().toISOString(),
    };

    this.adminCollections[index] = updated;
    this.persistAdmin();

    auditService.log({
      action: "update",
      collectionId: id,
      collectionName: updated.name,
      timestamp: new Date().toISOString(),
      details: `Updated collection parameters (${updated.templateCount} templates, status: ${updated.status}).`,
    });

    return updated;
  }

  async updateCollectionStatus(id: string, status: CollectionStatus): Promise<AdminCollection> {
    await this.simulateLatency();
    const index = this.adminCollections.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Collection not found.`);
    }

    const col = this.adminCollections[index];
    col.status = status;
    col.updatedAt = new Date().toISOString();

    this.persistAdmin();

    auditService.log({
      action: status === "active" ? "activate" : "deactivate",
      collectionId: id,
      collectionName: col.name,
      timestamp: new Date().toISOString(),
      details:
        status === "active"
          ? "Collection activated and made visible in recommendation feed."
          : "Collection deactivated and removed from recommendation feed.",
    });

    return { ...col };
  }

  async reorderCollectionTemplates(id: string, orderedTemplateIds: string[]): Promise<AdminCollection> {
    await this.simulateLatency();
    const index = this.adminCollections.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Collection not found.`);
    }

    const col = this.adminCollections[index];
    const templateMap = new Map(col.templates.map((t) => [t.id, t]));

    const reordered: CollectionTemplateItem[] = [];
    for (const tid of orderedTemplateIds) {
      const item = templateMap.get(tid);
      if (item) reordered.push(item);
    }

    col.templates = reordered;
    col.updatedAt = new Date().toISOString();
    this.persistAdmin();

    auditService.log({
      action: "reorder",
      collectionId: id,
      collectionName: col.name,
      timestamp: new Date().toISOString(),
      details: "Reordered templates in collection.",
    });

    return { ...col };
  }

  // =========================================================================
  // USER COLLECTIONS (READ-ONLY FOR ADMIN)
  // =========================================================================

  async getUserCollections(filters?: UserCollectionFilters): Promise<UserCollection[]> {
    await this.simulateLatency();
    let result = [...this.userCollections];

    if (filters?.userId && filters.userId !== "all") {
      result = result.filter((c) => c.userId === filters.userId);
    }

    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.userName.toLowerCase().includes(q) ||
          c.userEmail.toLowerCase().includes(q) ||
          c.templates.some((t) => t.name.toLowerCase().includes(q))
      );
    }

    if (filters?.dateRange && filters.dateRange !== "all") {
      const now = new Date().getTime();
      const dayMs = 24 * 60 * 60 * 1000;
      if (filters.dateRange === "last7days") {
        result = result.filter((c) => now - new Date(c.createdAt).getTime() <= 7 * dayMs);
      } else if (filters.dateRange === "last30days") {
        result = result.filter((c) => now - new Date(c.createdAt).getTime() <= 30 * dayMs);
      } else if (filters.dateRange === "thisYear") {
        const currentYear = new Date().getFullYear();
        result = result.filter((c) => new Date(c.createdAt).getFullYear() === currentYear);
      }
    }

    return result;
  }

  async getUserCollectionById(id: string): Promise<UserCollection | null> {
    await this.simulateLatency();
    const found = this.userCollections.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  // Reset to initial demo mock data
  resetDemoData() {
    this.adminCollections = [...initialAdminCollections];
    this.userCollections = [...initialUserCollections];
    this.persistAdmin();
    this.persistUser();
  }

  // Small latency simulation to verify loading states cleanly
  private simulateLatency(ms: number = 80): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const collectionService = new CollectionService();

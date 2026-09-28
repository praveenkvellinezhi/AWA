export type CollectionStatus = "active" | "inactive";

export interface CollectionTemplateItem {
  id: string;
  name: string;
  category: string;
  thumbnail?: string;
  description?: string;
}

export interface AdminCollection {
  id: string;
  name: string;
  description: string;
  status: CollectionStatus;
  templates: CollectionTemplateItem[];
  templateCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserCollection {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  name: string;
  description?: string;
  templates: CollectionTemplateItem[];
  templateCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCollectionFilters {
  searchQuery?: string;
  status?: "all" | CollectionStatus;
}

export interface UserCollectionFilters {
  searchQuery?: string;
  userId?: string;
  dateRange?: "all" | "last7days" | "last30days" | "thisYear";
}

export interface CreateAdminCollectionDTO {
  name: string;
  description: string;
  status: CollectionStatus;
  templates: CollectionTemplateItem[];
}

export interface UpdateAdminCollectionDTO {
  name?: string;
  description?: string;
  status?: CollectionStatus;
  templates?: CollectionTemplateItem[];
}

export interface AuditLogEntry {
  id: string;
  action: "create" | "update" | "activate" | "deactivate" | "reorder" | "remove_template" | "add_template";
  collectionId: string;
  collectionName?: string;
  timestamp: string;
  details?: string;
}

export type EngagementDateRange =
  | "today"
  | "last7days"
  | "last30days"
  | "last90days"
  | "thisYear"
  | "allTime";

export type EngagementSortOption = "likes" | "saves" | "engagement" | "recent";

export interface TemplateEngagementItem {
  templateId: string;
  templateName: string;
  category: string;
  categoryId?: string;
  thumbnail?: string;
  likes: number;
  saves: number;
  totalEngagement: number; // likes + saves
  likeSaveRatio: number; // likes / (saves || 1)
  createdAt: string;
  updatedAt: string;
  associatedCollections?: string[]; // Read-only collection references
}

export interface EngagementSummary {
  totalLikes: number;
  totalSaves: number;
  templatesLikedCount: number;
  templatesSavedCount: number;
  totalEngagement: number;
  topCategory?: string;
}

export interface EngagementFilters {
  searchQuery?: string;
  category?: string;
  dateRange?: EngagementDateRange;
  sortBy?: EngagementSortOption;
  page?: number;
  pageSize?: number;
}

export interface PaginatedEngagementResponse {
  items: TemplateEngagementItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

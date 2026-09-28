import {
  TemplateEngagementItem,
  EngagementSummary,
  EngagementFilters,
  PaginatedEngagementResponse,
  EngagementDateRange,
} from "../types/template-engagement";
import {
  initialTemplateEngagement,
  applyDateRangeFactor,
} from "../mock-data/template-engagement";
import { initialCategories } from "../mock-data/categories";

class TemplateEngagementService {
  private baseData: TemplateEngagementItem[] = [...initialTemplateEngagement];

  // =========================================================================
  // SUMMARY KPI METRICS
  // =========================================================================
  async getEngagementSummary(dateRange: EngagementDateRange = "allTime"): Promise<EngagementSummary> {
    await this.simulateLatency();
    const items = applyDateRangeFactor(this.baseData, dateRange);

    const totalLikes = items.reduce((acc, curr) => acc + curr.likes, 0);
    const totalSaves = items.reduce((acc, curr) => acc + curr.saves, 0);
    const templatesLikedCount = items.filter((i) => i.likes > 0).length;
    const templatesSavedCount = items.filter((i) => i.saves > 0).length;
    const totalEngagement = totalLikes + totalSaves;

    // Determine top category
    const categoryTotals = new Map<string, number>();
    items.forEach((item) => {
      const current = categoryTotals.get(item.category) || 0;
      categoryTotals.set(item.category, current + item.totalEngagement);
    });
    let topCategory = "General";
    let maxEng = 0;
    categoryTotals.forEach((total, cat) => {
      if (total > maxEng) {
        maxEng = total;
        topCategory = cat;
      }
    });

    return {
      totalLikes,
      totalSaves,
      templatesLikedCount,
      templatesSavedCount,
      totalEngagement,
      topCategory,
    };
  }

  // =========================================================================
  // PAGINATED / FILTERED ENGAGEMENT LIST
  // =========================================================================
  async getTemplateEngagement(filters: EngagementFilters = {}): Promise<PaginatedEngagementResponse> {
    await this.simulateLatency();
    const dateRange = filters.dateRange || "allTime";
    let items = applyDateRangeFactor(this.baseData, dateRange);

    // 1. Search Query
    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.templateName.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (filters.category && filters.category !== "all") {
      items = items.filter((item) => item.category === filters.category);
    }

    // 3. Sorting
    const sortBy = filters.sortBy || "likes";
    items.sort((a, b) => {
      switch (sortBy) {
        case "likes":
          return b.likes - a.likes;
        case "saves":
          return b.saves - a.saves;
        case "engagement":
          return b.totalEngagement - a.totalEngagement;
        case "recent":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return b.likes - a.likes;
      }
    });

    // 4. Pagination
    const total = items.length;
    const page = Math.max(1, filters.page || 1);
    const pageSize = filters.pageSize || 10;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // =========================================================================
  // TOP RANKINGS
  // =========================================================================
  async getMostLikedTemplates(
    limit: number = 5,
    dateRange: EngagementDateRange = "allTime"
  ): Promise<TemplateEngagementItem[]> {
    await this.simulateLatency();
    const items = applyDateRangeFactor(this.baseData, dateRange);
    return [...items].sort((a, b) => b.likes - a.likes).slice(0, limit);
  }

  async getMostSavedTemplates(
    limit: number = 5,
    dateRange: EngagementDateRange = "allTime"
  ): Promise<TemplateEngagementItem[]> {
    await this.simulateLatency();
    const items = applyDateRangeFactor(this.baseData, dateRange);
    return [...items].sort((a, b) => b.saves - a.saves).slice(0, limit);
  }

  // =========================================================================
  // SINGLE TEMPLATE ENGAGEMENT DETAIL
  // =========================================================================
  async getTemplateEngagementById(
    templateId: string,
    dateRange: EngagementDateRange = "allTime"
  ): Promise<TemplateEngagementItem | null> {
    await this.simulateLatency();
    const items = applyDateRangeFactor(this.baseData, dateRange);
    const found = items.find((i) => i.templateId === templateId);
    return found ? { ...found } : null;
  }

  // =========================================================================
  // AVAILABLE CATEGORIES
  // =========================================================================
  getCategories(): string[] {
    const fromCategories = initialCategories.map((c) => c.name);
    const fromEngagement = Array.from(new Set(this.baseData.map((b) => b.category)));
    return Array.from(new Set([...fromCategories, ...fromEngagement]));
  }

  // =========================================================================
  // EXPORT CSV (AGGREGATED - PRIVACY COMPLIANT)
  // =========================================================================
  async exportEngagementCSV(filters: EngagementFilters = {}): Promise<string> {
    const res = await this.getTemplateEngagement({ ...filters, page: 1, pageSize: 1000 });
    const headers = ["Template Name", "Category", "Likes", "Saves", "Total Engagement", "Like/Save Ratio", "Last Updated"];
    const rows = res.items.map((item) => [
      `"${item.templateName.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.likes,
      item.saves,
      item.totalEngagement,
      item.likeSaveRatio,
      `"${item.updatedAt}"`,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  private simulateLatency(ms: number = 70): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const templateEngagementService = new TemplateEngagementService();

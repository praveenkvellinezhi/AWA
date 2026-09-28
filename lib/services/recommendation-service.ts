import { AdminCollection } from "../types/collection";
import { collectionService } from "./collection-service";

class MockRecommendationService {
  /**
   * Returns ONLY collections where status === 'active'
   * Deactivated collections are strictly excluded from recommendation feeds.
   */
  async getRecommendedCollections(): Promise<AdminCollection[]> {
    const adminCollections = await collectionService.getAdminCollections();
    return adminCollections.filter((c) => c.status === "active");
  }

  /**
   * Synchronous accessor for fast client preview
   */
  filterRecommended(collections: AdminCollection[]): AdminCollection[] {
    return collections.filter((c) => c.status === "active");
  }
}

export const recommendationService = new MockRecommendationService();

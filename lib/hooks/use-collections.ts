"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AdminCollection,
  UserCollection,
  AdminCollectionFilters,
  UserCollectionFilters,
  CreateAdminCollectionDTO,
  UpdateAdminCollectionDTO,
  CollectionStatus,
  CollectionTemplateItem,
  AuditLogEntry,
} from "../types/collection";
import { collectionService } from "../services/collection-service";
import { recommendationService } from "../services/recommendation-service";
import { auditService } from "../services/audit-service";

/**
 * Hook to retrieve and filter Admin Collections
 */
export function useAdminCollections(filters?: AdminCollectionFilters) {
  const [data, setData] = useState<AdminCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await collectionService.getAdminCollections(filters);
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load collections.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.searchQuery]);

  useEffect(() => {
    fetchCollections();
    const unsubscribe = collectionService.subscribe(() => {
      fetchCollections();
    });
    return unsubscribe;
  }, [fetchCollections]);

  return {
    collections: data,
    isLoading,
    error,
    refetch: fetchCollections,
  };
}

/**
 * Hook to retrieve single Admin Collection by ID
 */
export function useAdminCollection(id: string | null) {
  const [data, setData] = useState<AdminCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await collectionService.getAdminCollectionById(id);
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load collection detail.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollection();
    const unsubscribe = collectionService.subscribe(() => {
      fetchCollection();
    });
    return unsubscribe;
  }, [fetchCollection]);

  return {
    collection: data,
    isLoading,
    error,
    refetch: fetchCollection,
  };
}

/**
 * Hook to mutate (create/update/activate/deactivate/reorder) Admin Collections
 */
export function useCollectionMutations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const createCollection = useCallback(async (dto: CreateAdminCollectionDTO) => {
    try {
      setIsSubmitting(true);
      setMutationError(null);
      const created = await collectionService.createAdminCollection(dto);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to save collection.";
      setMutationError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateCollection = useCallback(async (id: string, dto: UpdateAdminCollectionDTO) => {
    try {
      setIsSubmitting(true);
      setMutationError(null);
      const updated = await collectionService.updateAdminCollection(id, dto);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to save collection.";
      setMutationError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: CollectionStatus) => {
    try {
      setIsSubmitting(true);
      setMutationError(null);
      const updated = await collectionService.updateCollectionStatus(id, status);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to update collection status.";
      setMutationError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const reorderTemplates = useCallback(async (id: string, orderedIds: string[]) => {
    try {
      setIsSubmitting(true);
      setMutationError(null);
      const updated = await collectionService.reorderCollectionTemplates(id, orderedIds);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to reorder templates.";
      setMutationError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetData = useCallback(() => {
    collectionService.resetDemoData();
  }, []);

  return {
    createCollection,
    updateCollection,
    updateStatus,
    reorderTemplates,
    resetData,
    isSubmitting,
    mutationError,
    clearError: () => setMutationError(null),
  };
}

/**
 * Hook to retrieve available template catalogue for selection
 */
export function useAvailableTemplates(searchQuery?: string) {
  const [templates, setTemplates] = useState<CollectionTemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await collectionService.getAvailableTemplates(searchQuery);
        if (!isCancelled) setTemplates(list);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      isCancelled = true;
    };
  }, [searchQuery]);

  return {
    templates,
    isLoading,
  };
}

/**
 * Hook to retrieve and filter User Collections (Read Only)
 */
export function useUserCollections(filters?: UserCollectionFilters) {
  const [data, setData] = useState<UserCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await collectionService.getUserCollections(filters);
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load user collections.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.userId, filters?.searchQuery, filters?.dateRange]);

  useEffect(() => {
    fetchUserCollections();
    const unsubscribe = collectionService.subscribe(() => {
      fetchUserCollections();
    });
    return unsubscribe;
  }, [fetchUserCollections]);

  return {
    userCollections: data,
    isLoading,
    error,
    refetch: fetchUserCollections,
  };
}

/**
 * Hook to query active recommendation feed (Requirement 15)
 */
export function useRecommendedCollections() {
  const [data, setData] = useState<AdminCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const active = await recommendationService.getRecommendedCollections();
      setData(active);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
    const unsubscribe = collectionService.subscribe(() => {
      fetchRecommendations();
    });
    return unsubscribe;
  }, [fetchRecommendations]);

  return {
    recommendedCollections: data,
    isLoading,
    refetch: fetchRecommendations,
  };
}

/**
 * Hook to monitor mock audit logs
 */
export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => auditService.getLogs());

  useEffect(() => {
    const unsub = auditService.subscribe((updated) => setLogs(updated));
    return unsub;
  }, []);

  return { logs };
}

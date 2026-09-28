"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TemplateEngagementItem,
  EngagementSummary,
  EngagementFilters,
  PaginatedEngagementResponse,
  EngagementDateRange,
} from "../types/template-engagement";
import { templateEngagementService } from "../services/template-engagement-service";

/**
 * Hook to retrieve engagement summary KPI metrics
 */
export function useEngagementSummary(dateRange: EngagementDateRange = "allTime") {
  const [summary, setSummary] = useState<EngagementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await templateEngagementService.getEngagementSummary(dateRange);
      setSummary(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load template engagement data.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    isLoading,
    error,
    refetch: fetchSummary,
  };
}

/**
 * Hook to retrieve paginated and filtered template engagement data
 */
export function useTemplateEngagement(filters: EngagementFilters = {}) {
  const [data, setData] = useState<PaginatedEngagementResponse>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { searchQuery, category, dateRange, sortBy, page, pageSize } = filters;

  const fetchEngagement = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await templateEngagementService.getTemplateEngagement({
        searchQuery,
        category,
        dateRange,
        sortBy,
        page,
        pageSize,
      });
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load template engagement data.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, category, dateRange, sortBy, page, pageSize]);

  useEffect(() => {
    fetchEngagement();
  }, [fetchEngagement]);

  return {
    data,
    items: data.items,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    totalPages: data.totalPages,
    isLoading,
    error,
    refetch: fetchEngagement,
  };
}

/**
 * Hook to retrieve most liked templates
 */
export function useMostLikedTemplates(limit: number = 5, dateRange: EngagementDateRange = "allTime") {
  const [items, setItems] = useState<TemplateEngagementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopLiked = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await templateEngagementService.getMostLikedTemplates(limit, dateRange);
      setItems(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load top liked templates.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [limit, dateRange]);

  useEffect(() => {
    fetchTopLiked();
  }, [fetchTopLiked]);

  return { items, isLoading, error, refetch: fetchTopLiked };
}

/**
 * Hook to retrieve most saved templates
 */
export function useMostSavedTemplates(limit: number = 5, dateRange: EngagementDateRange = "allTime") {
  const [items, setItems] = useState<TemplateEngagementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopSaved = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await templateEngagementService.getMostSavedTemplates(limit, dateRange);
      setItems(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load top saved templates.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [limit, dateRange]);

  useEffect(() => {
    fetchTopSaved();
  }, [fetchTopSaved]);

  return { items, isLoading, error, refetch: fetchTopSaved };
}

/**
 * Hook to retrieve a single template engagement item by ID
 */
export function useTemplateEngagementDetail(
  templateId: string | null,
  dateRange: EngagementDateRange = "allTime"
) {
  const [item, setItem] = useState<TemplateEngagementItem | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(templateId));
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!templateId) {
      setItem(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await templateEngagementService.getTemplateEngagementById(templateId, dateRange);
      setItem(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load template engagement detail.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [templateId, dateRange]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { item, isLoading, error, refetch: fetchDetail };
}

/**
 * Hook to retrieve available categories
 */
export function useEngagementCategories(): string[] {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories(templateEngagementService.getCategories());
  }, []);

  return categories;
}

"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, qs } from "@/lib/api";

/** Thin React Query wrappers so components never hand-roll fetch/loading state. */

export const useProducts = (params) =>
  useQuery({ queryKey: ["products", params], queryFn: ({ signal }) => api(`/products${qs(params)}`, { auth: false, signal }), placeholderData: keepPreviousData });

export const useFeaturedProducts = () =>
  useQuery({ queryKey: ["products", "featured"], queryFn: () => api("/products/featured", { auth: false }) });

export const useFilterOptions = () =>
  useQuery({ queryKey: ["products", "filters"], queryFn: () => api("/products/filters", { auth: false }), staleTime: 5 * 60_000 });

export const useCategories = () =>
  useQuery({ queryKey: ["categories"], queryFn: () => api("/categories", { auth: false }), staleTime: 5 * 60_000 });

export const usePublicStats = () =>
  useQuery({ queryKey: ["stats", "public"], queryFn: () => api("/stats/public", { auth: false }) });

export const useTopReviews = () =>
  useQuery({ queryKey: ["reviews", "top"], queryFn: () => api("/reviews/top", { auth: false }) });

export const usePosts = (params = {}) =>
  useQuery({ queryKey: ["posts", params], queryFn: () => api(`/posts${qs(params)}`, { auth: false }) });

export const useSettings = () =>
  useQuery({ queryKey: ["settings"], queryFn: () => api("/settings", { auth: false }), staleTime: 10 * 60_000 });

export const useReviews = (productId, page) =>
  useQuery({
    queryKey: ["reviews", productId, page],
    queryFn: () => api(`/reviews/product/${productId}${qs({ page })}`, { auth: false }),
    enabled: Boolean(productId),
    placeholderData: keepPreviousData,
  });

export const useRelated = (slug) =>
  useQuery({ queryKey: ["related", slug], queryFn: () => api(`/products/${slug}/related`, { auth: false }), enabled: Boolean(slug) });

/** Authenticated table endpoint (my listings, admin users, orders...). */
export const useTable = (key, path, params, enabled = true) =>
  useQuery({ queryKey: [key, params], queryFn: ({ signal }) => api(`${path}${qs(params)}`, { signal }), placeholderData: keepPreviousData, enabled });

export const useAuthed = (key, path, enabled = true) =>
  useQuery({ queryKey: Array.isArray(key) ? key : [key], queryFn: () => api(path), enabled });

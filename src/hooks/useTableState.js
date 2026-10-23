"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "./useDebounce";

/**
 * State for a server-driven data table: search (debounced), filters, sort and page.
 * Changing anything but the page resets to page 1.
 */
export function useTableState({ sort: initialSort = "-createdAt", filters: initialFilters = {}, limit = 10 } = {}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSortState] = useState(initialSort);
  const [page, setPage] = useState(1);
  const q = useDebounce(search);

  const setFilter = useCallback((key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }, []);

  const onSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const setSort = useCallback((value) => {
    setSortState(value);
    setPage(1);
  }, []);

  return {
    search,
    setSearch: onSearch,
    filters,
    setFilter,
    sort,
    setSort,
    page,
    setPage,
    params: { q, sort, page, limit, ...filters },
  };
}

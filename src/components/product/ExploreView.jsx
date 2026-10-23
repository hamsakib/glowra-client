"use client";

import { Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Checkbox, Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { useFilterOptions, useProducts } from "@/hooks/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { CONCERNS, SKIN_TYPES, cn } from "@/lib/format";
import { ProductGrid } from "./ProductCard";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Best selling" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const LIST_KEYS = ["category", "brand", "skinType", "concern"];

/** All filter state lives in the URL, so results are shareable and the back button works. */
function useUrlState() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const state = useMemo(() => {
    const read = (k) => params.get(k) || "";
    const list = (k) => (params.get(k) ? params.get(k).split(",") : []);
    return {
      q: read("q"),
      category: list("category"),
      brand: list("brand"),
      skinType: list("skinType"),
      concern: list("concern"),
      minPrice: read("minPrice"),
      maxPrice: read("maxPrice"),
      rating: read("rating"),
      inStock: read("inStock"),
      sort: read("sort") || "newest",
      page: Number(read("page")) || 1,
    };
  }, [params]);

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        const v = Array.isArray(value) ? value.join(",") : value;
        if (v === "" || v === undefined || v === null || (key === "sort" && v === "newest")) next.delete(key);
        else next.set(key, String(v));
      }
      if (resetPage && !("page" in patch)) next.delete("page");
      if (next.get("page") === "1") next.delete("page");
      const s = next.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return [state, update];
}

function FilterGroup({ title, children }) {
  return (
    <fieldset className="border-b border-border pb-6">
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      <div className="space-y-2.5">{children}</div>
    </fieldset>
  );
}

function PriceFilter({ state, update, options }) {
  const [min, setMin] = useState(state.minPrice);
  const [max, setMax] = useState(state.maxPrice);
  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        update({ minPrice: min, maxPrice: max });
      }}
    >
      <label className="flex-1 text-xs text-muted-fg">
        Min
        <input type="number" inputMode="numeric" min="0" value={min} onChange={(e) => setMin(e.target.value)} placeholder={options?.price?.min ?? 0} className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg outline-none focus:border-primary" />
      </label>
      <label className="flex-1 text-xs text-muted-fg">
        Max
        <input type="number" inputMode="numeric" min="0" value={max} onChange={(e) => setMax(e.target.value)} placeholder={options?.price?.max ?? ""} className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg outline-none focus:border-primary" />
      </label>
      <Button type="submit" variant="outline" size="sm" className="h-10">Go</Button>
    </form>
  );
}

function Filters({ state, update, options }) {
  const toggle = (key, value) => {
    const list = state[key];
    update({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  return (
    <div className="space-y-6">
      <FilterGroup title="Category">
        {(options?.categories || []).map((c) => (
          <Checkbox key={c._id} label={c.name} checked={state.category.includes(c.slug)} onChange={() => toggle("category", c.slug)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Price (৳)">
        {/* Keyed by the URL values so clearing a chip resets the inputs. */}
        <PriceFilter key={`${state.minPrice}-${state.maxPrice}`} state={state} update={update} options={options} />
      </FilterGroup>
      <FilterGroup title="Rating">
        {[4.5, 4, 3].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-3 text-sm">
            <input type="radio" name="rating" className="h-4 w-4 accent-[var(--primary)]" checked={state.rating === String(r)} onChange={() => update({ rating: r })} />
            {r}★ & up
          </label>
        ))}
        {state.rating && (
          <button type="button" onClick={() => update({ rating: "" })} className="text-xs font-semibold text-primary hover:underline">Any rating</button>
        )}
      </FilterGroup>
      <FilterGroup title="Skin type">
        {SKIN_TYPES.map((s) => (
          <Checkbox key={s.value} label={s.label} checked={state.skinType.includes(s.value)} onChange={() => toggle("skinType", s.value)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Concern">
        {CONCERNS.map((c) => (
          <Checkbox key={c.value} label={c.label} checked={state.concern.includes(c.value)} onChange={() => toggle("concern", c.value)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Brand">
        {(options?.brands || []).map((b) => (
          <Checkbox key={b.name} label={`${b.name} (${b.count})`} checked={state.brand.includes(b.name)} onChange={() => toggle("brand", b.name)} />
        ))}
      </FilterGroup>
      <Checkbox label="In stock only" checked={state.inStock === "true"} onChange={(e) => update({ inStock: e.target.checked ? "true" : "" })} />
    </div>
  );
}

export function ExploreView() {
  const [state, update] = useUrlState();
  const [search, setSearch] = useState(state.q);
  const debounced = useDebounce(search, 400);
  const [drawer, setDrawer] = useState(false);
  const { data: options } = useFilterOptions();

  useEffect(() => {
    if (debounced !== state.q) update({ q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const { data, isLoading, isFetching, isError, refetch } = useProducts({ ...state, limit: 12 });

  const activeChips = [
    ...LIST_KEYS.flatMap((k) =>
      state[k].map((v) => ({
        key: k,
        value: v,
        label:
          k === "category" ? options?.categories?.find((c) => c.slug === v)?.name || v
          : k === "skinType" ? SKIN_TYPES.find((s) => s.value === v)?.label || v
          : k === "concern" ? CONCERNS.find((s) => s.value === v)?.label || v
          : v,
      })),
    ),
    ...(state.minPrice || state.maxPrice ? [{ key: "price", label: `৳${state.minPrice || 0} – ${state.maxPrice ? `৳${state.maxPrice}` : "any"}` }] : []),
    ...(state.rating ? [{ key: "rating", label: `${state.rating}★ & up` }] : []),
    ...(state.inStock ? [{ key: "inStock", label: "In stock" }] : []),
  ];

  const removeChip = (chip) => {
    if (chip.key === "price") update({ minPrice: "", maxPrice: "" });
    else if (LIST_KEYS.includes(chip.key)) update({ [chip.key]: state[chip.key].filter((v) => v !== chip.value) });
    else update({ [chip.key]: "" });
  };

  const clearAll = () => {
    setSearch("");
    update({ q: "", category: "", brand: "", skinType: "", concern: "", minPrice: "", maxPrice: "", rating: "", inStock: "" });
  };

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="explore-search" className="sr-only">Search products</label>
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-fg" aria-hidden="true" />
          <input
            id="explore-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands or ingredients (e.g. niacinamide)"
            className="h-12 w-full rounded-xl border border-border bg-surface pr-4 pl-12 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="lg:hidden" onClick={() => setDrawer(true)} aria-expanded={drawer} aria-controls="filter-drawer">
            <Filter className="h-4 w-4" /> Filters {activeChips.length > 0 && `(${activeChips.length})`}
          </Button>
          <Select aria-label="Sort products" value={state.sort} onChange={(e) => update({ sort: e.target.value })} className="min-w-48">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button key={`${chip.key}-${chip.value || ""}`} type="button" onClick={() => removeChip(chip)} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-soft-fg hover:opacity-80">
              {chip.label} <X className="h-3.5 w-3.5" aria-label="Remove filter" />
            </button>
          ))}
          <button type="button" onClick={clearAll} className="text-xs font-semibold text-muted-fg hover:text-fg hover:underline">Clear all</button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <Filters state={state} update={update} options={options} />
        </aside>

        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters" id="filter-drawer">
            <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} aria-label="Close filters" />
            <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-surface">
              <div className="flex items-center justify-between border-b border-border p-4">
                <p className="heading-3">Filters</p>
                <button type="button" onClick={() => setDrawer(false)} className="rounded-xl p-2 hover:bg-muted" aria-label="Close filters"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4"><Filters state={state} update={update} options={options} /></div>
              <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
                <Button variant="outline" onClick={clearAll}>Clear</Button>
                <Button onClick={() => setDrawer(false)}>Show {data?.total ?? ""} results</Button>
              </div>
            </div>
          </div>
        )}

        <div className="min-w-0">
          <p className="mb-4 text-sm text-muted-fg" aria-live="polite">
            {isLoading ? "Loading products…" : `${data?.total ?? 0} product${data?.total === 1 ? "" : "s"} found`}
          </p>
          {isError ? (
            <EmptyState title="Couldn't load products" description="The server may be waking up. Please try again." action={<Button variant="outline" onClick={() => refetch()}>Retry</Button>} />
          ) : !isLoading && data?.items.length === 0 ? (
            <EmptyState icon={Search} title="No products match those filters" description="Try removing a filter or searching for something broader." action={<Button variant="outline" onClick={clearAll}>Clear filters</Button>} />
          ) : (
            <div className={cn("transition-opacity", isFetching && !isLoading && "opacity-60")}>
              <ProductGrid products={data?.items || []} loading={isLoading} skeletons={12} className="lg:grid-cols-3 xl:grid-cols-4" />
            </div>
          )}
          {data && (
            <Pagination
              className="mt-10"
              page={data.page}
              pages={data.pages}
              total={data.total}
              limit={data.limit}
              onChange={(p) => {
                update({ page: p }, { resetPage: false });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

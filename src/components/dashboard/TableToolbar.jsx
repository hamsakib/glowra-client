"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Select } from "@/components/ui/Input";

/** Search box + any number of select filters, shared by every dashboard table. */
export function TableToolbar({ search, onSearch, placeholder = "Search…", filters = [] }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <label className="sr-only" htmlFor="table-search">{placeholder}</label>
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-fg" aria-hidden="true" />
        <input
          id="table-search"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-border bg-surface pr-3 pl-10 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </div>
      {filters.map((f) => (
        <Select key={f.label} aria-label={f.label} value={f.value} onChange={(e) => f.onChange(e.target.value)} className="sm:w-44">
          <option value="">{f.allLabel || `All ${f.label.toLowerCase()}`}</option>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      ))}
    </div>
  );
}

export function IconAction({ label, onClick, href, icon: Icon, danger }) {
  const cls = `inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${danger ? "text-danger hover:bg-danger-soft" : "text-muted-fg hover:bg-muted hover:text-fg"}`;
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={label} title={label}>
        <Icon className="h-4 w-4" />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={label} title={label}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

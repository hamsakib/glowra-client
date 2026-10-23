"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/format";

function pageList(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push("…" + p);
    out.push(p);
  });
  return out;
}

export function Pagination({ page, pages, total, limit, onChange, className }) {
  if (!pages || pages <= 1) {
    return total ? <p className={cn("text-sm text-muted-fg", className)}>Showing all {total} results</p> : null;
  }
  const from = (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  const btn = "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition";
  return (
    <nav aria-label="Pagination" className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      <p className="text-sm text-muted-fg">
        Showing <span className="font-semibold text-fg">{from}–{to}</span> of <span className="font-semibold text-fg">{total}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button type="button" className={cn(btn, "border-border bg-surface hover:bg-muted disabled:opacity-40")} onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageList(page, pages).map((p) =>
          typeof p === "string" ? (
            <span key={p} className="px-1 text-muted-fg">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(btn, p === page ? "border-primary bg-primary text-primary-fg" : "hidden border-border bg-surface hover:bg-muted sm:flex")}
            >
              {p}
            </button>
          ),
        )}
        <button type="button" className={cn(btn, "border-border bg-surface hover:bg-muted disabled:opacity-40")} onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

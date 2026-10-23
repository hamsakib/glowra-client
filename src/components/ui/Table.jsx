"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/format";
import { EmptyState } from "./EmptyState";

/**
 * Data table. Columns: { key, header, sortKey?, className?, render(row) }.
 * Sorting is controlled by the parent (server-side), `sort` is "field" or "-field".
 */
export function Table({ columns, rows, loading, sort, onSort, empty, rowKey = "_id", caption }) {
  return (
    <div className="relative overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-muted/60 text-xs text-muted-fg uppercase">
          <tr>
            {columns.map((col) => {
              const active = sort?.replace(/^-/, "") === col.sortKey;
              const desc = sort?.startsWith("-");
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={cn("px-4 py-3 font-semibold tracking-wide whitespace-nowrap", col.className)}
                  aria-sort={active ? (desc ? "descending" : "ascending") : undefined}
                >
                  {col.sortKey && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(active && !desc ? `-${col.sortKey}` : col.sortKey)}
                      className="inline-flex items-center gap-1 rounded-xl uppercase hover:text-fg"
                    >
                      {col.header}
                      {active ? (desc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {loading
            ? Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="skeleton h-4 w-full max-w-40" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={row[rowKey]} className="transition hover:bg-muted/40">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 align-middle", col.className)}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {!loading && rows.length === 0 && <EmptyState className="border-t border-border" {...(empty || {})} />}
    </div>
  );
}

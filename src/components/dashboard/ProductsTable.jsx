"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { SmartImage } from "@/components/ui/SmartImage";
import { Table } from "@/components/ui/Table";
import { useCategories, useTable } from "@/hooks/queries";
import { useTableState } from "@/hooks/useTableState";
import { api } from "@/lib/api";
import { cn, formatPrice } from "@/lib/format";
import { DashboardHeader } from "./DashboardShell";
import { IconAction, TableToolbar } from "./TableToolbar";

/** Shared by "My Listings" (scope=mine) and admin "Manage Products" (scope=admin). */
export function ProductsTable({ scope }) {
  const admin = scope === "admin";
  const key = admin ? "admin-products" : "my-listings";
  const table = useTableState({ sort: "-createdAt" });
  const { data, isLoading } = useTable(key, admin ? "/products/admin/all" : "/products/mine", table.params);
  const { data: cats } = useCategories();
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [key] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = useMutation({
    mutationFn: (id) => api(`/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Listing deleted");
      setToDelete(null);
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const patch = useMutation({
    mutationFn: ({ id, body }) => api(`/products/${id}/admin`, { method: "PATCH", body }),
    onSuccess: (res) => {
      toast.success(`Updated ${res.item.title}`);
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const columns = [
    {
      key: "title",
      header: "Product",
      sortKey: "title",
      render: (p) => (
        <div className="flex min-w-56 items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
            <SmartImage src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />
          </span>
          <span className="min-w-0">
            <span className="line-clamp-1 font-semibold">{p.title}</span>
            <span className="text-xs text-muted-fg">{p.brand} · {p.category?.name}</span>
          </span>
        </div>
      ),
    },
    ...(admin ? [{ key: "seller", header: "Seller", render: (p) => <span className="text-sm whitespace-nowrap">{p.seller?.name}</span> }] : []),
    { key: "price", header: "Price", sortKey: "price", render: (p) => <span className="font-medium whitespace-nowrap">{formatPrice(p.price)}</span> },
    { key: "stock", header: "Stock", sortKey: "stock", render: (p) => <span className={cn("font-medium", p.stock === 0 ? "text-danger" : p.stock < 10 ? "text-accent" : "")}>{p.stock}</span> },
    { key: "soldCount", header: "Sold", sortKey: "soldCount" },
    { key: "rating", header: "Rating", sortKey: "rating", render: (p) => (p.rating ? `${p.rating.toFixed(1)}★` : "–") },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end gap-1">
          <IconAction label={`View ${p.title}`} href={`/products/${p.slug}`} icon={Eye} />
          <IconAction label={`Edit ${p.title}`} href={`/dashboard/listings/${p._id}/edit`} icon={Pencil} />
          {admin && (
            <IconAction
              label={p.featured ? "Remove from featured" : "Mark as featured"}
              onClick={() => patch.mutate({ id: p._id, body: { featured: !p.featured } })}
              icon={(props) => <Star {...props} className={cn(props.className, p.featured && "fill-accent text-accent")} />}
            />
          )}
          <IconAction label={`Delete ${p.title}`} onClick={() => setToDelete(p)} icon={Trash2} danger />
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader
        title={admin ? "Manage products" : "My listings"}
        description={admin ? "Every listing on the marketplace. Star a product to feature it on the homepage." : "Products you're selling on Glowra."}
        action={<Button href="/dashboard/listings/new"><Plus className="h-4 w-4" /> {admin ? "Add product" : "Add listing"}</Button>}
      />
      <TableToolbar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search by title or brand"
        filters={[
          { label: "Categories", value: table.filters.category || "", onChange: (v) => table.setFilter("category", v), options: (cats?.items || []).map((c) => ({ value: c._id, label: c.name })) },
          { label: "Status", allLabel: "Any status", value: table.filters.status || "", onChange: (v) => table.setFilter("status", v), options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
        ]}
      />
      <Table
        caption={admin ? "All products" : "My listings"}
        columns={columns}
        rows={data?.items || []}
        loading={isLoading}
        sort={table.sort}
        onSort={table.setSort}
        empty={{ title: "No listings found", description: table.search ? "Try a different search." : "Add your first product to start selling.", action: <Button href="/dashboard/listings/new" size="sm">Add listing</Button> }}
      />
      {data && <Pagination className="mt-4" page={data.page} pages={data.pages} total={data.total} limit={data.limit} onChange={table.setPage} />}
      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => remove.mutate(toDelete._id)}
        loading={remove.isPending}
        title="Delete this listing?"
        description={<>“{toDelete?.title}” and its reviews will be removed permanently. <Link href={`/products/${toDelete?.slug}`} className="text-primary underline">View it first</Link>.</>}
      />
    </>
  );
}

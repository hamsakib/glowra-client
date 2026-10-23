"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { SmartImage } from "@/components/ui/SmartImage";
import { Table } from "@/components/ui/Table";
import { useTable } from "@/hooks/queries";
import { useTableState } from "@/hooks/useTableState";
import { api } from "@/lib/api";
import { ORDER_STATUSES, formatDate, formatPrice } from "@/lib/format";
import { DashboardHeader } from "./DashboardShell";
import { IconAction, TableToolbar } from "./TableToolbar";

function OrderDetails({ order }) {
  return (
    <div className="space-y-6 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-fg">Placed {formatDate(order.createdAt, { dateStyle: "medium", timeStyle: "short" })}</p>
        <StatusBadge status={order.status} />
      </div>
      <ul className="divide-y divide-border rounded-xl border border-border">
        {order.items.map((it) => (
          <li key={it.product} className="flex items-center gap-3 p-3">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
              <SmartImage src={it.image} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="line-clamp-1 font-medium">{it.title}</span>
              <span className="text-xs text-muted-fg">{formatPrice(it.price)} × {it.quantity}</span>
            </span>
            <span className="font-semibold">{formatPrice(it.price * it.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="space-y-2">
        <div className="flex justify-between"><dt className="text-muted-fg">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-fg">Delivery</dt><dd>{order.shippingFee ? formatPrice(order.shippingFee) : "Free"}</dd></div>
        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><dt>Total (cash on delivery)</dt><dd>{formatPrice(order.total)}</dd></div>
      </dl>
      <div className="rounded-xl bg-muted p-4">
        <p className="font-semibold">Deliver to</p>
        <p className="mt-1 text-muted-fg">{order.shipping.name} · {order.shipping.phone}</p>
        <p className="text-muted-fg">{order.shipping.address}, {order.shipping.city}</p>
        {order.shipping.note && <p className="mt-1 text-muted-fg italic">“{order.shipping.note}”</p>}
        {order.user?.email && <p className="mt-2 text-xs text-muted-fg">Account: {order.user.name} ({order.user.email})</p>}
      </div>
    </div>
  );
}

/** "My orders" for customers, "Orders" for admins (with inline status updates). */
export function OrdersTable({ scope }) {
  const admin = scope === "admin";
  const key = admin ? "admin-orders" : "my-orders";
  const table = useTableState({ sort: "-createdAt" });
  const { data, isLoading } = useTable(key, admin ? "/orders" : "/orders/mine", table.params);
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [key] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  const setStatus = useMutation({
    mutationFn: ({ id, status }) => api(`/orders/${id}/status`, { method: "PATCH", body: { status } }),
    onSuccess: (res) => {
      toast.success(`${res.item.orderNumber} marked ${res.item.status}`);
      refresh();
    },
    onError: (err) => toast.error(err.message),
  });

  const cancel = useMutation({
    mutationFn: (id) => api(`/orders/${id}/cancel`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("Order cancelled");
      setCancelling(null);
      refresh();
    },
    onError: (err) => toast.error(err.message),
  });

  const columns = [
    { key: "orderNumber", header: "Order", render: (o) => <span className="font-semibold whitespace-nowrap">{o.orderNumber}</span> },
    ...(admin ? [{ key: "user", header: "Customer", render: (o) => <span className="whitespace-nowrap">{o.user?.name || "Deleted user"}</span> }] : []),
    { key: "createdAt", header: "Date", sortKey: "createdAt", render: (o) => <span className="whitespace-nowrap">{formatDate(o.createdAt)}</span> },
    { key: "items", header: "Items", render: (o) => o.items.reduce((s, i) => s + i.quantity, 0) },
    { key: "total", header: "Total", sortKey: "total", render: (o) => <span className="font-medium whitespace-nowrap">{formatPrice(o.total)}</span> },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      render: (o) =>
        admin ? (
          <select
            aria-label={`Status of ${o.orderNumber}`}
            value={o.status}
            disabled={setStatus.isPending}
            onChange={(e) => setStatus.mutate({ id: o._id, status: e.target.value })}
            className="h-9 rounded-xl border border-border bg-surface px-2 text-sm capitalize outline-none focus:border-primary"
          >
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : (
          <StatusBadge status={o.status} />
        ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (o) => (
        <div className="flex justify-end gap-1">
          <IconAction label={`View ${o.orderNumber}`} onClick={() => setViewing(o)} icon={Eye} />
          {!admin && o.status === "pending" && <IconAction label={`Cancel ${o.orderNumber}`} onClick={() => setCancelling(o)} icon={Ban} danger />}
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title={admin ? "Orders" : "My orders"} description={admin ? "Update an order's status from the dropdown. Cancelling returns stock." : "Track your orders. Pending orders can be cancelled."} />
      <TableToolbar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search by order number (e.g. GLW-2026-00012)"
        filters={[{ label: "Status", allLabel: "Any status", value: table.filters.status || "", onChange: (v) => table.setFilter("status", v), options: ORDER_STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) })) }]}
      />
      <Table
        caption="Orders"
        columns={columns}
        rows={data?.items || []}
        loading={isLoading}
        sort={table.sort}
        onSort={table.setSort}
        empty={{ title: "No orders found", description: admin ? "Try a different filter." : "When you place an order it will appear here.", action: !admin && <Button href="/explore" size="sm">Start shopping</Button> }}
      />
      {data && <Pagination className="mt-4" page={data.page} pages={data.pages} total={data.total} limit={data.limit} onChange={table.setPage} />}
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing ? `Order ${viewing.orderNumber}` : ""} size="lg">
        {viewing && <OrderDetails order={viewing} />}
      </Modal>
      <ConfirmModal
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        onConfirm={() => cancel.mutate(cancelling._id)}
        loading={cancel.isPending}
        title="Cancel this order?"
        confirmLabel="Cancel order"
        description={`Order ${cancelling?.orderNumber} for ${formatPrice(cancelling?.total)} will be cancelled.`}
      />
    </>
  );
}

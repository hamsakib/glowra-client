"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { IconAction, TableToolbar } from "@/components/dashboard/TableToolbar";
import { Avatar } from "@/components/layout/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Table } from "@/components/ui/Table";
import { useTable } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { useTableState } from "@/hooks/useTableState";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

function UserDetails({ id }) {
  const { data, isLoading } = useQuery({ queryKey: ["admin-user", id], queryFn: () => api(`/users/${id}`) });
  if (isLoading) return <div className="skeleton h-48" />;
  const u = data.item;
  return (
    <div className="space-y-5 text-sm">
      <div className="flex items-center gap-4">
        <Avatar user={u} size="h-14 w-14" />
        <div>
          <p className="font-semibold">{u.name}</p>
          <p className="text-muted-fg">{u.email}</p>
          <div className="mt-1 flex gap-2"><StatusBadge status={u.role} /><StatusBadge status={u.status} /></div>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 rounded-xl bg-muted p-4">
        <div><dt className="text-muted-fg">Joined</dt><dd className="font-medium">{formatDate(u.createdAt)}</dd></div>
        <div><dt className="text-muted-fg">Last login</dt><dd className="font-medium">{u.lastLoginAt ? formatDate(u.lastLoginAt) : "Never"}</dd></div>
        <div><dt className="text-muted-fg">City</dt><dd className="font-medium">{u.city || "–"}</dd></div>
        <div><dt className="text-muted-fg">Phone</dt><dd className="font-medium">{u.phone || "–"}</dd></div>
        <div><dt className="text-muted-fg">Listings</dt><dd className="font-medium">{u.listings}</dd></div>
        <div><dt className="text-muted-fg">Reviews</dt><dd className="font-medium">{u.reviews}</dd></div>
      </dl>
      <div>
        <p className="mb-2 font-semibold">Recent orders</p>
        {u.recentOrders.length ? (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {u.recentOrders.map((o) => (
              <li key={o._id} className="flex items-center justify-between p-3">
                <span>{o.orderNumber} · {formatDate(o.createdAt)}</span>
                <span className="flex items-center gap-2">{formatPrice(o.total)} <StatusBadge status={o.status} /></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-fg">No orders yet.</p>
        )}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const table = useTableState({ sort: "-createdAt" });
  const { data, isLoading } = useTable("admin-users", "/users", table.params);
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const update = useMutation({
    mutationFn: ({ id, body }) => api(`/users/${id}`, { method: "PATCH", body }),
    onSuccess: (res) => {
      toast.success(`${res.item.name} updated`);
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => toast.error(err.message),
  });
  const remove = useMutation({
    mutationFn: (id) => api(`/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("User deleted");
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      toast.error(err.message);
      setDeleting(null);
    },
  });

  const columns = [
    {
      key: "name",
      header: "User",
      sortKey: "name",
      render: (u) => (
        <div className="flex min-w-52 items-center gap-3">
          <Avatar user={u} />
          <div className="min-w-0">
            <p className="truncate font-semibold">{u.name}{u._id === me._id && <span className="ml-1 text-xs text-muted-fg">(you)</span>}</p>
            <p className="truncate text-xs text-muted-fg">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", sortKey: "role", render: (u) => <StatusBadge status={u.role} /> },
    { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
    { key: "orders", header: "Orders" },
    { key: "spent", header: "Spent", render: (u) => <span className="whitespace-nowrap">{formatPrice(u.spent)}</span> },
    { key: "createdAt", header: "Joined", sortKey: "createdAt", render: (u) => <span className="whitespace-nowrap">{formatDate(u.createdAt)}</span> },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-1">
          <IconAction label={`View ${u.name}`} onClick={() => setViewing(u)} icon={Eye} />
          {u._id !== me._id && (
            <>
              <IconAction label={`Edit ${u.name}`} onClick={() => setEditing({ ...u })} icon={Pencil} />
              <IconAction label={`Delete ${u.name}`} onClick={() => setDeleting(u)} icon={Trash2} danger />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title="Manage users" description="Change roles, block accounts or remove users without orders." />
      <TableToolbar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search by name or email"
        filters={[
          { label: "Roles", value: table.filters.role || "", onChange: (v) => table.setFilter("role", v), options: [{ value: "user", label: "User" }, { value: "admin", label: "Admin" }] },
          { label: "Status", allLabel: "Any status", value: table.filters.status || "", onChange: (v) => table.setFilter("status", v), options: [{ value: "active", label: "Active" }, { value: "blocked", label: "Blocked" }] },
        ]}
      />
      <Table caption="Users" columns={columns} rows={data?.items || []} loading={isLoading} sort={table.sort} onSort={table.setSort} empty={{ title: "No users found" }} />
      {data && <Pagination className="mt-4" page={data.page} pages={data.pages} total={data.total} limit={data.limit} onChange={table.setPage} />}

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="User details" size="lg">
        {viewing && <UserDetails id={viewing._id} />}
      </Modal>
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={`Edit ${editing?.name || ""}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button loading={update.isPending} onClick={() => update.mutate({ id: editing._id, body: { role: editing.role, status: editing.status } })}>Save</Button>
          </>
        }
      >
        {editing && (
          <div className="grid gap-4">
            <Select label="Role" value={editing.role} onChange={(e) => setEditing((u) => ({ ...u, role: e.target.value }))}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
            <Select label="Status" value={editing.status} onChange={(e) => setEditing((u) => ({ ...u, status: e.target.value }))} hint="Blocked users can't log in.">
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </Select>
          </div>
        )}
      </Modal>
      <ConfirmModal open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting._id)} loading={remove.isPending} title="Delete this user?" description={`${deleting?.name}'s account, listings and reviews will be removed. Users with orders can only be blocked.`} />
    </>
  );
}

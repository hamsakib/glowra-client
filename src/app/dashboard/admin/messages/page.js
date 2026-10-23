"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { IconAction, TableToolbar } from "@/components/dashboard/TableToolbar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Table } from "@/components/ui/Table";
import { useTable } from "@/hooks/queries";
import { useTableState } from "@/hooks/useTableState";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function AdminMessagesPage() {
  const table = useTableState({ sort: "-createdAt" });
  const { data, isLoading } = useTable("admin-messages", "/messages", table.params);
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const setStatus = useMutation({
    mutationFn: ({ id, status }) => api(`/messages/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
    onError: (err) => toast.error(err.message),
  });
  const remove = useMutation({
    mutationFn: (id) => api(`/messages/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Message deleted");
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });

  const open = (m) => {
    setViewing(m);
    if (m.status === "new") setStatus.mutate({ id: m._id, status: "read" });
  };

  const columns = [
    { key: "name", header: "From", sortKey: "name", render: (m) => <div className="min-w-40"><p className="font-semibold">{m.name}</p><p className="text-xs text-muted-fg">{m.email}</p></div> },
    { key: "subject", header: "Subject", render: (m) => <span className="line-clamp-1 max-w-xs">{m.subject}</span> },
    { key: "createdAt", header: "Received", sortKey: "createdAt", render: (m) => <span className="whitespace-nowrap">{formatDate(m.createdAt)}</span> },
    { key: "status", header: "Status", sortKey: "status", render: (m) => <StatusBadge status={m.status} /> },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (m) => (
        <div className="flex justify-end gap-1">
          <IconAction label={`Read message from ${m.name}`} onClick={() => open(m)} icon={Eye} />
          {m.status !== "resolved" && <IconAction label="Mark resolved" onClick={() => setStatus.mutate({ id: m._id, status: "resolved" }, { onSuccess: () => toast.success("Marked resolved") })} icon={CheckCheck} />}
          <IconAction label={`Delete message from ${m.name}`} onClick={() => setDeleting(m)} icon={Trash2} danger />
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title="Messages" description="Submissions from the contact form, stored in the database." />
      <TableToolbar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search name, email or subject"
        filters={[{ label: "Status", allLabel: "Any status", value: table.filters.status || "", onChange: (v) => table.setFilter("status", v), options: [{ value: "new", label: "New" }, { value: "read", label: "Read" }, { value: "resolved", label: "Resolved" }] }]}
      />
      <Table caption="Contact messages" columns={columns} rows={data?.items || []} loading={isLoading} sort={table.sort} onSort={table.setSort} empty={{ title: "No messages" }} />
      {data && <Pagination className="mt-4" page={data.page} pages={data.pages} total={data.total} limit={data.limit} onChange={table.setPage} />}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.subject}
        description={viewing && `${viewing.name} · ${viewing.email} · ${formatDate(viewing.createdAt)}`}
        size="lg"
        footer={viewing && (
          <>
            <Button variant="outline" href={`mailto:${viewing.email}?subject=${encodeURIComponent(`Re: ${viewing.subject}`)}`}>Reply by email</Button>
            <Button onClick={() => setStatus.mutate({ id: viewing._id, status: "resolved" }, { onSuccess: () => { toast.success("Marked resolved"); setViewing(null); } })}>Mark resolved</Button>
          </>
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-line">{viewing?.message}</p>
      </Modal>
      <ConfirmModal open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting._id)} loading={remove.isPending} title="Delete this message?" description="This can't be undone." />
    </>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { IconAction } from "@/components/dashboard/TableToolbar";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { SmartImage } from "@/components/ui/SmartImage";
import { Table } from "@/components/ui/Table";
import { useCategories } from "@/hooks/queries";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(40),
  description: z.string().trim().max(200, "200 characters max").optional(),
  image: z.union([z.literal(""), z.url("Enter a valid image URL")]).optional(),
  order: z.coerce.number().int().min(0).max(100),
});

function CategoryForm({ category, onDone }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  useEffect(() => {
    reset({ name: category?.name || "", description: category?.description || "", image: category?.image || "", order: category?.order ?? 0 });
  }, [category, reset]);

  const submit = async (values) => {
    try {
      await api(category?._id ? `/categories/${category._id}` : "/categories", { method: category?._id ? "PUT" : "POST", body: values });
      toast.success(category?._id ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onDone();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <form id="category-form" onSubmit={handleSubmit(submit)} noValidate className="grid gap-4">
      <Input label="Name" required error={errors.name?.message} {...register("name")} />
      <Textarea label="Description" rows={3} error={errors.description?.message} {...register("description")} />
      <Input label="Cover image URL" type="url" error={errors.image?.message} {...register("image")} />
      <Input label="Sort order" type="number" min="0" error={errors.order?.message} {...register("order")} />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onDone}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>Save</Button>
      </div>
    </form>
  );
}

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null = closed, {} = new
  const [deleting, setDeleting] = useState(null);
  const remove = useMutation({
    mutationFn: (id) => api(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleting(null);
    },
    onError: (err) => {
      toast.error(err.message);
      setDeleting(null);
    },
  });

  const columns = [
    {
      key: "name",
      header: "Category",
      render: (c) => (
        <div className="flex items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">{c.image && <SmartImage src={c.image} alt="" fill sizes="48px" className="object-cover" />}</span>
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-xs text-muted-fg">/{c.slug}</p>
          </div>
        </div>
      ),
    },
    { key: "description", header: "Description", render: (c) => <span className="line-clamp-2 max-w-sm text-muted-fg">{c.description}</span> },
    { key: "productCount", header: "Products" },
    { key: "order", header: "Order" },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <IconAction label={`View ${c.name}`} href={`/explore?category=${c.slug}`} icon={Eye} />
          <IconAction label={`Edit ${c.name}`} onClick={() => setEditing(c)} icon={Pencil} />
          <IconAction label={`Delete ${c.name}`} onClick={() => setDeleting(c)} icon={Trash2} danger />
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title="Categories" description="Categories organise the catalogue and the explore filters." action={<Button onClick={() => setEditing({})}><Plus className="h-4 w-4" /> New category</Button>} />
      <Table caption="Categories" columns={columns} rows={data?.items || []} loading={isLoading} empty={{ title: "No categories yet" }} />
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?._id ? `Edit ${editing.name}` : "New category"}>
        {editing && <CategoryForm category={editing} onDone={() => setEditing(null)} />}
      </Modal>
      <ConfirmModal open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting._id)} loading={remove.isPending} title={`Delete ${deleting?.name}?`} description="Categories that still contain products can't be deleted." />
    </>
  );
}

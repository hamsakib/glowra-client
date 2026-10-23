"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useCategories } from "@/hooks/queries";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";
import { CONCERNS, SKIN_TYPES, cn } from "@/lib/format";
import { ImageUploader } from "./ImageUploader";

const int = (msg) => z.coerce.number({ error: msg }).int("Use a whole number");

const schema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
    brand: z.string().trim().min(2, "Brand is required").max(40),
    category: z.string().min(1, "Choose a category"),
    size: z.string().trim().max(20).optional(),
    shortDescription: z.string().trim().min(20, "At least 20 characters").max(160, "160 characters max"),
    description: z.string().trim().min(60, "At least 60 characters").max(4000),
    howToUse: z.string().trim().max(1000).optional(),
    ingredients: z.string().trim().max(400).optional(),
    price: int("Enter a price").min(50, "Price must be at least ৳50").max(100000),
    compareAtPrice: z.union([z.literal(""), int("Enter a number").min(0)]).optional(),
    stock: int("Enter stock").min(0, "Stock cannot be negative").max(10000),
    skinTypes: z.array(z.string()).optional(),
    concerns: z.array(z.string()).optional(),
    images: z.array(z.string()).min(1, "Add at least one photo").max(6),
    status: z.enum(["published", "draft"]),
  })
  .refine((d) => !d.compareAtPrice || Number(d.compareAtPrice) > d.price, {
    path: ["compareAtPrice"],
    message: "Compare-at price must be higher than the price",
  });

function toDefaults(p) {
  return {
    title: p?.title || "",
    brand: p?.brand || "",
    category: p?.category?._id || p?.category || "",
    size: p?.size || "",
    shortDescription: p?.shortDescription || "",
    description: p?.description || "",
    howToUse: p?.howToUse || "",
    ingredients: (p?.keyIngredients || []).join(", "),
    price: p?.price ?? "",
    compareAtPrice: p?.compareAtPrice || "",
    stock: p?.stock ?? "",
    skinTypes: p?.skinTypes || [],
    concerns: p?.concerns || [],
    images: p?.images || [],
    status: p?.status || "published",
  };
}

function ChipGroup({ legend, options, value = [], onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])}
              className={cn("rounded-xl border px-3 py-1.5 text-sm font-medium transition", on ? "border-primary bg-primary-soft text-primary-soft-fg" : "border-border hover:bg-muted")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Create / edit listing. `product` present = edit mode. */
export function ProductForm({ product, backHref = "/dashboard/listings" }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const editing = Boolean(product);
  const { register, control, handleSubmit, setError, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(product),
  });

  const onSubmit = async ({ ingredients, compareAtPrice, ...values }) => {
    const body = {
      ...values,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : 0,
      keyIngredients: (ingredients || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8),
    };
    try {
      const res = await api(editing ? `/products/${product._id}` : "/products", { method: editing ? "PUT" : "POST", body });
      toast.success(editing ? "Listing updated" : "Listing created", { description: res.item.title });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push(backHref);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card className="space-y-5 p-6">
          <h2 className="heading-3">Basics</h2>
          <Input label="Product title" required placeholder="e.g. COSRX Low pH Good Morning Gel Cleanser" error={errors.title?.message} {...register("title")} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Input label="Brand" required error={errors.brand?.message} {...register("brand")} />
            <Select label="Category" required error={errors.category?.message} {...register("category")}>
              <option value="">Choose…</option>
              {(categories?.items || []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
            <Input label="Size" placeholder="150ml" error={errors.size?.message} {...register("size")} />
          </div>
          <Input label="Short description" required hint="Shown on product cards. 20–160 characters." error={errors.shortDescription?.message} {...register("shortDescription")} />
          <Textarea label="Full description" required rows={6} hint="What it is, who it's for and what it does. At least 60 characters." error={errors.description?.message} {...register("description")} />
          <Textarea label="How to use" rows={3} error={errors.howToUse?.message} {...register("howToUse")} />
          <Input label="Key ingredients" placeholder="Niacinamide, Hyaluronic Acid, Centella" hint="Comma separated, up to 8." error={errors.ingredients?.message} {...register("ingredients")} />
        </Card>
        <Card className="p-6">
          <Controller name="images" control={control} render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} error={errors.images?.message} />} />
        </Card>
        <Card className="space-y-5 p-6">
          <h2 className="heading-3">Who it&apos;s for</h2>
          <Controller name="skinTypes" control={control} render={({ field }) => <ChipGroup legend="Skin types" options={SKIN_TYPES} value={field.value} onChange={field.onChange} />} />
          <Controller name="concerns" control={control} render={({ field }) => <ChipGroup legend="Concerns" options={CONCERNS} value={field.value} onChange={field.onChange} />} />
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="space-y-5 p-6 xl:sticky xl:top-24">
          <h2 className="heading-3">Price & stock</h2>
          <Input label="Price (৳)" type="number" inputMode="numeric" required min="50" error={errors.price?.message} {...register("price")} />
          <Input label="Compare-at price (৳)" type="number" inputMode="numeric" min="0" hint="Optional. Original price, shown crossed out." error={errors.compareAtPrice?.message} {...register("compareAtPrice")} />
          <Input label="Stock" type="number" inputMode="numeric" required min="0" error={errors.stock?.message} {...register("stock")} />
          <Select label="Visibility" {...register("status")}>
            <option value="published">Published</option>
            <option value="draft">Draft (hidden)</option>
          </Select>
          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" loading={isSubmitting} disabled={editing && !isDirty}>{editing ? "Save changes" : "Create listing"}</Button>
            <Button variant="ghost" onClick={() => router.push(backHref)}>Cancel</Button>
          </div>
        </Card>
      </div>
    </form>
  );
}

"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthed } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";

export default function EditListingPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { data, isLoading, error } = useAuthed(["product-edit", id], `/products/id/${id}`);
  const back = isAdmin ? "/dashboard/admin/products" : "/dashboard/listings";

  return (
    <>
      <DashboardHeader title="Edit listing" description={data?.item?.title} />
      {isLoading ? (
        <div className="skeleton h-[600px]" />
      ) : error ? (
        <EmptyState title="Can't edit this listing" description={error.message} action={<Button href={back} variant="outline">Back</Button>} />
      ) : (
        <ProductForm product={data.item} backHref={back} />
      )}
    </>
  );
}

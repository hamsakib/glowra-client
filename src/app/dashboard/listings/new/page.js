"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { useAuth } from "@/hooks/useAuth";

export default function NewListingPage() {
  const { isAdmin } = useAuth();
  return (
    <>
      <DashboardHeader title={isAdmin ? "Add product" : "Add a listing"} description="Fields marked * are required. Listings go live as soon as they're published." />
      <ProductForm backHref={isAdmin ? "/dashboard/admin/products" : "/dashboard/listings"} />
    </>
  );
}

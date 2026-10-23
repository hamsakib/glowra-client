import { Suspense } from "react";
import { PageHeader } from "@/components/layout/Section";
import { ProductGrid } from "@/components/product/ProductCard";
import { ExploreView } from "@/components/product/ExploreView";

export const metadata = {
  title: "Explore Korean skincare",
  description: "Search and filter authentic Korean skincare by category, brand, skin type, concern, price and rating.",
};

export default function ExplorePage() {
  return (
    <>
      <PageHeader eyebrow="Explore" title="Find the right product for your skin" description="Search by name or ingredient, then narrow down by category, brand, skin type, concern, price and rating." />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><ProductGrid loading products={[]} skeletons={12} /></div>}>
        <ExploreView />
      </Suspense>
    </>
  );
}

import Link from "next/link";
import { memo } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Stars } from "@/components/ui/Stars";
import { discountPercent, formatPrice } from "@/lib/format";

/** Uniform product card: fixed image ratio, clamped text, footer pinned to the bottom. */
export const ProductCard = memo(function ProductCard({ product, priority = false }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 focus-within:border-primary/40">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted" tabIndex={-1} aria-hidden="true">
        <SmartImage
          src={product.images?.[0]}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {off > 0 && <Badge tone="primary" className="shadow-sm">-{off}%</Badge>}
          {product.stock === 0 && <Badge tone="danger">Sold out</Badge>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold tracking-wide text-secondary uppercase">{product.brand}</span>
          {product.size && <span className="text-muted-fg">{product.size}</span>}
        </div>
        <h3 className="line-clamp-2 h-10 text-sm leading-5 font-semibold">
          <Link href={`/products/${product.slug}`} className="hover:text-primary">
            {product.title}
          </Link>
        </h3>
        <p className="line-clamp-2 h-10 text-xs leading-5 text-muted-fg">{product.shortDescription}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-fg">
          <Stars value={product.rating} size="h-3.5 w-3.5" />
          <span>
            {product.rating ? product.rating.toFixed(1) : "New"} {product.reviewCount ? `(${product.reviewCount})` : ""}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-base font-bold">{formatPrice(product.price)}</p>
            {off > 0 && <p className="text-xs text-muted-fg line-through">{formatPrice(product.compareAtPrice)}</p>}
          </div>
          <Link href={`/products/${product.slug}`} className={buttonClasses({ variant: "soft", size: "sm" })}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
});

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface" aria-hidden="true">
      <div className="skeleton aspect-square rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/2" />
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, loading, skeletons = 8, className = "" }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 ${className}`} aria-busy={loading || undefined}>
      {loading
        ? Array.from({ length: skeletons }, (_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p, i) => <ProductCard key={p._id} product={p} priority={i < 4} />)}
    </div>
  );
}

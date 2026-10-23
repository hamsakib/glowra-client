"use client";

import { ArrowLeft, Check, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { useRelated } from "@/hooks/queries";
import { useCart } from "@/hooks/useCart";
import { CONCERNS, SKIN_TYPES, cn, discountPercent, formatDate, formatPrice } from "@/lib/format";
import { Gallery } from "./Gallery";
import { ProductGrid } from "./ProductCard";
import { Reviews } from "./Reviews";

const label = (list, value) => list.find((x) => x.value === value)?.label || value;

function QuantityPicker({ value, onChange, max }) {
  return (
    <div className="flex h-12 items-center rounded-xl border border-border bg-surface" role="group" aria-label="Quantity">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} className="flex h-full w-11 items-center justify-center rounded-xl hover:bg-muted disabled:opacity-40" aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center font-semibold" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="flex h-full w-11 items-center justify-center rounded-xl hover:bg-muted disabled:opacity-40" aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ProductDetail({ product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("overview");
  const related = useRelated(product.slug);
  const off = discountPercent(product.price, product.compareAtPrice);
  const max = Math.min(10, product.stock);

  const specs = [
    ["Brand", product.brand],
    ["Category", product.category?.name],
    ["Size", product.size],
    ["Origin", product.origin],
    ["Skin types", product.skinTypes?.map((s) => label(SKIN_TYPES, s)).join(", ")],
    ["Good for", product.concerns?.map((c) => label(CONCERNS, c)).join(", ")],
    ["Sold by", product.seller?.role === "admin" ? "Glowra" : product.seller?.name],
    ["Listed", formatDate(product.createdAt)],
  ].filter(([, v]) => v);

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "how", label: "How to use" },
    { id: "specs", label: "Specifications" },
  ];

  return (
    <>
      <Container className="py-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-fg">
          <Link href="/explore" className="inline-flex items-center gap-1 rounded-xl font-medium hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to explore
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/explore?category=${product.category?.slug}`} className="hover:text-primary">{product.category?.name}</Link>
          <span aria-hidden="true">/</span>
          <span className="line-clamp-1 text-fg">{product.title}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Gallery images={product.images} title={product.title} />

          <div>
            <p className="text-sm font-semibold tracking-wide text-secondary uppercase">{product.brand}</p>
            <h1 className="heading-1 mt-2">{product.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Stars value={product.rating} />
              <a href="#reviews" className="text-muted-fg hover:text-primary">
                {product.rating ? `${product.rating.toFixed(1)} · ${product.reviewCount} review${product.reviewCount === 1 ? "" : "s"}` : "No reviews yet"}
              </a>
              {product.soldCount > 0 && <span className="text-muted-fg">· {product.soldCount} sold</span>}
            </div>
            <p className="body-lg mt-5">{product.shortDescription}</p>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-3xl font-semibold">{formatPrice(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="pb-1 text-muted-fg line-through">{formatPrice(product.compareAtPrice)}</span>
                  <Badge tone="primary" className="mb-1">Save {off}%</Badge>
                </>
              )}
            </div>
            <p className={cn("mt-2 text-sm font-medium", product.stock > 10 ? "text-secondary" : product.stock > 0 ? "text-accent" : "text-danger")}>
              {product.stock > 10 ? "In stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of stock"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {product.stock > 0 && <QuantityPicker value={qty} onChange={setQty} max={max} />}
              <Button size="lg" className="flex-1" disabled={product.stock === 0} onClick={() => add(product, qty)}>
                <ShoppingBag className="h-5 w-5" /> {product.stock === 0 ? "Sold out" : "Add to cart"}
              </Button>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface p-5 text-sm sm:grid-cols-3">
              <li className="flex items-center gap-2"><Truck className="h-5 w-5 shrink-0 text-secondary" /> Dhaka in 1–2 days</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-secondary" /> Authentic stock</li>
              <li className="flex items-center gap-2"><RotateCcw className="h-5 w-5 shrink-0 text-secondary" /> 7-day sealed returns</li>
            </ul>

            {product.keyIngredients?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold">Key ingredients</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.keyIngredients.map((ing) => (
                    <li key={ing}><Badge tone="secondary"><Check className="h-3.5 w-3.5" /> {ing}</Badge></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <section className="mt-16" aria-label="Product information">
          <div role="tablist" aria-label="Product information" className="relative flex gap-1 overflow-x-auto border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn("-mb-px rounded-t-xl border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition", tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-fg hover:text-fg")}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="max-w-3xl py-8">
            <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" hidden={tab !== "overview"}>
              <p className="leading-relaxed whitespace-pre-line text-muted-fg">{product.description}</p>
            </div>
            <div role="tabpanel" id="panel-how" aria-labelledby="tab-how" hidden={tab !== "how"}>
              <p className="leading-relaxed text-muted-fg">{product.howToUse || "Follow the directions on the pack."}</p>
            </div>
            <div role="tabpanel" id="panel-specs" aria-labelledby="tab-specs" hidden={tab !== "specs"}>
              <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 bg-surface px-5 py-3 text-sm">
                    <dt className="font-medium text-muted-fg">{k}</dt>
                    <dd className="col-span-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <Reviews product={product} />
      </Container>

      <section className="border-t border-border bg-muted/50 py-16" aria-labelledby="related-title">
        <Container>
          <h2 id="related-title" className="heading-2 mb-8">You may also like</h2>
          {related.data?.items?.length === 0 ? (
            <p className="text-muted-fg">No related products yet.</p>
          ) : (
            <ProductGrid products={related.data?.items || []} loading={related.isLoading} skeletons={4} />
          )}
        </Container>
      </section>
    </>
  );
}

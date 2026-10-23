"use client";

import { ChevronLeft, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Stars } from "@/components/ui/Stars";
import { useFeaturedProducts, usePublicStats } from "@/hooks/queries";
import { useCountUp } from "@/hooks/useCountUp";
import { cn, formatNumber, formatPrice } from "@/lib/format";

function Stat({ value, label, decimals = 0, suffix = "" }) {
  const n = useCountUp(value, { decimals });
  return (
    <div>
      <dt className="text-xs text-muted-fg">{label}</dt>
      <dd className="font-display text-2xl font-semibold">
        {decimals ? n.toFixed(decimals) : formatNumber(n)}
        {suffix}
      </dd>
    </div>
  );
}

/** Auto-advancing carousel of featured products; pauses on hover/focus, swipeable via buttons and dots. */
function FeaturedCarousel() {
  const { data, isLoading } = useFeaturedProducts();
  const items = data?.items?.slice(0, 5) || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((n) => setIndex((n + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  if (isLoading || !items.length) return <div className="skeleton aspect-[4/5] w-full max-w-md justify-self-center lg:aspect-square" />;

  return (
    <div
      className="relative mx-auto w-full max-w-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-muted shadow-card sm:aspect-square">
        {items.map((p, i) => (
          <div
            key={p._id}
            className={cn("absolute inset-0 transition-opacity duration-700", i === index ? "opacity-100" : "pointer-events-none opacity-0")}
            aria-hidden={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
          >
            <SmartImage src={p.images[0]} alt={p.title} fill priority={i === 0} sizes="(min-width: 1024px) 448px, 90vw" className="object-cover" />
            <div className="absolute inset-x-3 bottom-3 rounded-xl bg-surface/90 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold tracking-wide text-secondary uppercase">{p.brand}</p>
              <Link href={`/products/${p.slug}`} tabIndex={i === index ? 0 : -1} className="mt-1 line-clamp-1 font-semibold hover:text-primary">
                {p.title}
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <Stars value={p.rating} size="h-3.5 w-3.5" />
                <span className="font-bold">{formatPrice(p.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {items.map((p, i) => (
            <button
              key={p._id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-fg")}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => go(index - 1)} aria-label="Previous slide">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => go(index + 1)} aria-label="Next slide">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { data } = usePublicStats();
  const s = data?.stats;
  return (
    <section className="relative overflow-hidden border-b border-border lg:min-h-[60vh] lg:max-h-[70vh]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_20%,var(--primary-soft),transparent_70%),radial-gradient(50%_50%_at_10%_90%,var(--secondary-soft),transparent_70%)]" />
      <Container className="grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-2 lg:py-14">
        <div className="animate-fade-up">
          <p className="eyebrow mb-4">Authentic K-beauty · Delivered in Bangladesh</p>
          <h1 className="text-display">
            Skincare that works in <span className="text-primary">real</span> weather.
          </h1>
          <p className="body-lg mt-5 max-w-xl">
            Korean cleansers, serums and sunscreens chosen for heat and humidity, with honest descriptions and reviews from people who use them. Pay when it arrives.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/explore" size="lg">Shop the collection</Button>
            <Button href="/blog/korean-skincare-routine-order" size="lg" variant="outline">Build a routine</Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {s ? (
              <>
                <Stat value={s.products} label="Products" />
                <Stat value={s.brands} label="Korean brands" />
                <Stat value={s.averageRating} label="Avg. rating" decimals={1} suffix="★" />
              </>
            ) : (
              [0, 1, 2].map((i) => <div key={i} className="skeleton h-12" />)
            )}
          </dl>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-fg">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-secondary" /> Sourced from authorised importers</li>
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-secondary" /> Cash on delivery nationwide</li>
          </ul>
        </div>
        <FeaturedCarousel />
      </Container>
    </section>
  );
}

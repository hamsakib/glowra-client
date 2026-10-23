"use client";

import { ChevronDown, Droplets, Quote, Search, ShoppingBag, Sparkles, Sun, Truck, Wind, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Section } from "@/components/layout/Section";
import { Avatar } from "@/components/layout/Avatar";
import { ProductGrid } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SmartImage } from "@/components/ui/SmartImage";
import { Stars } from "@/components/ui/Stars";
import { useCategories, useFeaturedProducts, useFilterOptions, usePosts, usePublicStats, useTopReviews } from "@/hooks/queries";
import { useCountUp } from "@/hooks/useCountUp";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";
import { formatDate, formatNumber } from "@/lib/format";

/* 2. Categories */
export function CategoriesSection() {
  const { data, isLoading } = useCategories();
  return (
    <Section id="categories" eyebrow="Shop by step" title="Every step of a routine" description="Start with a cleanser and sunscreen, then add what your skin is asking for." action={{ href: "/explore", label: "Browse all" }}>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton aspect-[3/4]" />)
          : data.items.map((c) => (
              <Link key={c._id} href={`/explore?category=${c.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-muted">
                <SmartImage src={c.image} alt="" fill sizes="(min-width: 1024px) 200px, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-white/80">{c.productCount} products</p>
                </div>
              </Link>
            ))}
      </div>
    </Section>
  );
}

/* 3. Featured */
export function FeaturedSection() {
  const { data, isLoading } = useFeaturedProducts();
  return (
    <Section id="featured" tone="muted" eyebrow="Best sellers" title="What people reorder" description="Our most reordered products, ranked by units sold." action={{ href: "/explore?sort=popular", label: "See all best sellers" }}>
      <ProductGrid products={data?.items || []} loading={isLoading} />
    </Section>
  );
}

/* 4. Concerns */
const CONCERN_TILES = [
  { value: "acne", label: "Acne & breakouts", text: "Gentle acids, tea tree and patches.", icon: Zap },
  { value: "dark-spots", label: "Dark spots", text: "Niacinamide and brighteners, plus SPF.", icon: Sparkles },
  { value: "dehydration", label: "Dehydration", text: "Layers of hyaluronic acid and ceramides.", icon: Droplets },
  { value: "redness", label: "Redness", text: "Centella, heartleaf and calming creams.", icon: Wind },
  { value: "sun-protection", label: "Sun protection", text: "Light SPF50+ that you will reapply.", icon: Sun },
  { value: "pores", label: "Pores & texture", text: "Oil cleansers and clarifying toners.", icon: Search },
];

export function ConcernsSection() {
  return (
    <Section id="concerns" eyebrow="Shop by concern" title="Start with what bothers you" description="Pick a concern and we filter the catalogue for products made for it.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {CONCERN_TILES.map(({ value, label, text, icon: Icon }) => (
          <Link key={value} href={`/explore?concern=${value}`} className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-fg transition group-hover:bg-primary group-hover:text-primary-fg">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">{label}</span>
              <span className="mt-1 block text-sm text-muted-fg">{text}</span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* 5. How it works */
const STEPS = [
  { icon: Search, title: "Find your match", text: "Filter by skin type, concern, brand or price. Every product page lists key ingredients and how to use it." },
  { icon: ShoppingBag, title: "Order in a minute", text: "Add to cart and check out with your address. No card needed: you pay cash when the parcel arrives." },
  { icon: Truck, title: "Delivered to your door", text: "Inside Dhaka in 1 to 2 days, elsewhere in 2 to 4. Track the status from your dashboard." },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" tone="muted" eyebrow="How it works" title="From browsing to your bathroom shelf">
      <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title}>
            <Card className="h-full p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-soft text-secondary-soft-fg">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-3xl font-semibold text-border">0{i + 1}</span>
              </div>
              <h3 className="heading-3 mt-5">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-fg">{text}</p>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* 6. Statistics (dynamic) */
function BigStat({ value, label, decimals = 0, suffix = "" }) {
  const n = useCountUp(value, { decimals });
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-center">
      <dd className="font-display text-4xl font-semibold">
        {decimals ? n.toFixed(decimals) : formatNumber(n)}
        {suffix}
      </dd>
      <dt className="mt-1 text-sm text-white/75">{label}</dt>
    </div>
  );
}

export function StatsSection() {
  const { data } = usePublicStats();
  const s = data?.stats;
  return (
    <section className="bg-secondary py-16 text-white dark:bg-secondary-soft sm:py-20" aria-labelledby="stats-title">
      <Container>
        <h2 id="stats-title" className="heading-1 text-center">Glowra by the numbers</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-white/80">Live figures from our store database.</p>
        <dl className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {s ? (
            <>
              <BigStat value={s.ordersDelivered} label="Orders delivered" />
              <BigStat value={s.customers} label="Registered customers" />
              <BigStat value={s.reviews} label="Product reviews" />
              <BigStat value={s.averageRating} label="Average rating" decimals={1} suffix=" / 5" />
            </>
          ) : (
            [0, 1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-white/10" />)
          )}
        </dl>
      </Container>
    </section>
  );
}

/* 7. Testimonials (top reviews) */
export function TestimonialsSection() {
  const { data, isLoading } = useTopReviews();
  return (
    <Section id="reviews" eyebrow="Customer reviews" title="In their own words" description="Recent five-star reviews left on product pages.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-56" />)
          : data.items.slice(0, 6).map((r) => (
              <Card key={r._id} as="figure" className="flex h-full flex-col p-6">
                <Quote className="h-6 w-6 text-primary" aria-hidden="true" />
                <Stars value={r.rating} className="mt-3" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-fg">“{r.comment}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar user={r.user} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{r.user?.name}</p>
                    <Link href={`/products/${r.product?.slug}`} className="line-clamp-1 text-xs text-muted-fg hover:text-primary">
                      on {r.product?.title}
                    </Link>
                  </div>
                </figcaption>
              </Card>
            ))}
      </div>
    </Section>
  );
}

/* 8. Brands (partners) */
export function BrandsSection() {
  const { data, isLoading } = useFilterOptions();
  return (
    <section className="border-y border-border bg-surface py-12" aria-labelledby="brands-title">
      <Container>
        <h2 id="brands-title" className="text-center text-sm font-semibold text-muted-fg">Brands we stock</h2>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {isLoading
            ? Array.from({ length: 10 }, (_, i) => <li key={i} className="skeleton h-10 w-28" />)
            : data.brands.map((b) => (
                <li key={b.name}>
                  <Link href={`/explore?brand=${encodeURIComponent(b.name)}`} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 font-display text-base font-semibold text-muted-fg transition hover:border-primary hover:text-primary">
                    {b.name}
                    <span className="font-sans text-xs font-normal">{b.count}</span>
                  </Link>
                </li>
              ))}
        </ul>
      </Container>
    </section>
  );
}

/* 9. Journal preview */
export function BlogPreviewSection() {
  const { data, isLoading } = usePosts({ limit: 3 });
  return (
    <Section id="journal" eyebrow="Skincare journal" title="Learn before you buy" action={{ href: "/blog", label: "All articles" }}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-80" />)
          : data.items.map((p) => <PostCard key={p._id} post={p} />)}
      </div>
    </Section>
  );
}

export function PostCard({ post }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-muted" tabIndex={-1} aria-hidden="true">
        <SmartImage src={post.cover} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs text-muted-fg">
          {formatDate(post.publishedAt)} · {post.readMinutes} min read
        </p>
        <h3 className="heading-3 mt-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-fg">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="mt-auto pt-4 text-sm font-semibold text-primary hover:underline">
          Read article →
        </Link>
      </div>
    </article>
  );
}

/* 10. FAQ */
export const FAQS = [
  ["Are your products authentic?", "Yes. We buy from authorised importers and distributors, never from grey-market resellers. Every product page lists the brand and country of origin, and we accept returns on any sealed item you have doubts about."],
  ["How does cash on delivery work?", "Place your order online without paying. When the courier hands you the parcel, you pay the amount shown on your order. There is no extra fee for cash on delivery."],
  ["How long does delivery take?", "Inside Dhaka, 1 to 2 working days. Outside Dhaka, 2 to 4 working days. You can follow the status of every order from your dashboard."],
  ["How much is delivery?", "Delivery fees are set by the store and shown at checkout before you confirm. Orders above the free-shipping threshold ship free anywhere in Bangladesh."],
  ["Can I return a product?", "Unopened, sealed products can be returned within 7 days of delivery. If a product arrives damaged, tell us within 48 hours and we will replace it."],
  ["Can I sell on Glowra?", "Yes. Create an account, open your dashboard and add a listing under My Listings. Listings can be edited or removed at any time."],
];

export function FaqSection({ limit = FAQS.length }) {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" tone="muted" eyebrow="FAQ" title="Questions, answered">
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-surface">
        {FAQS.slice(0, limit).map(([q, a], i) => (
          <div key={q}>
            <h3>
              <button
                type="button"
                id={`faq-${i}`}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-6 py-5 text-left font-semibold transition hover:text-primary"
              >
                {q}
                <ChevronDown className={`h-5 w-5 shrink-0 text-muted-fg transition ${open === i ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            </h3>
            <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-${i}`} hidden={open !== i} className="px-6 pb-5 text-sm leading-relaxed text-muted-fg">
              {a}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* 11. Newsletter */
const newsletterSchema = z.object({ email: z.email("Enter a valid email address") });

export function NewsletterSection() {
  const [done, setDone] = useState("");
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(newsletterSchema) });
  const onSubmit = async (values) => {
    try {
      const res = await api("/newsletter", { method: "POST", body: values, auth: false });
      setDone(res.message);
      toast.success(res.message);
      reset();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };
  return (
    <section className="py-16 sm:py-24" aria-labelledby="newsletter-title">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 rounded-xl bg-primary px-6 py-12 text-primary-fg sm:px-12 lg:grid-cols-2">
          <div>
            <h2 id="newsletter-title" className="heading-1">One useful skincare letter a month</h2>
            <p className="mt-3 opacity-90">New arrivals, restocks and a short guide. No spam, unsubscribe anytime.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "newsletter-error" : done ? "newsletter-done" : undefined}
                className="h-12 w-full rounded-xl border border-white/30 bg-white px-4 text-sm text-[#1c1917] outline-none placeholder:text-stone-500 focus:ring-4 focus:ring-white/40"
                {...register("email")}
              />
              {errors.email && <p id="newsletter-error" role="alert" className="mt-2 text-sm font-medium">{errors.email.message}</p>}
              {done && !errors.email && <p id="newsletter-done" role="status" className="mt-2 text-sm font-medium">{done}</p>}
            </div>
            <Button type="submit" size="lg" loading={isSubmitting} className="bg-[#1c1917] text-white hover:opacity-90 dark:bg-[#1c1917] dark:text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}

/* 12. CTA */
export function CtaSection() {
  return (
    <section className="pb-16 sm:pb-24" aria-labelledby="cta-title">
      <Container>
        <Card className="grid grid-cols-1 items-center gap-6 p-8 sm:p-12 md:grid-cols-[1fr_auto]">
          <div>
            <h2 id="cta-title" className="heading-1">Have products to sell?</h2>
            <p className="body-lg mt-2">Open a free account and list authentic skincare in minutes. Manage stock, prices and orders from your dashboard.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/register" size="lg">Create an account</Button>
            <Button href="/help" size="lg" variant="outline">How selling works</Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

export function SectionError({ onRetry }) {
  return <EmptyState title="Couldn't load this section" description="The server may be waking up. Try again in a moment." action={onRetry && <Button variant="outline" onClick={onRetry}>Retry</Button>} />;
}

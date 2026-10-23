"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SmartImage } from "@/components/ui/SmartImage";
import { useSettings } from "@/hooks/queries";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export function CartSummary({ subtotal, city = "Dhaka", children }) {
  const { data } = useSettings();
  const s = data?.item;
  const free = s && subtotal >= s.freeShippingThreshold;
  const fee = !s ? 0 : free ? 0 : /dhaka/i.test(city) ? s.shippingFeeDhaka : s.shippingFeeOutside;
  return (
    <Card className="h-fit p-6 lg:sticky lg:top-24">
      <h2 className="heading-3">Order summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-muted-fg">Subtotal</dt><dd className="font-medium">{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-muted-fg">Delivery ({/dhaka/i.test(city) ? "inside Dhaka" : "outside Dhaka"})</dt>
          <dd className="font-medium">{free ? "Free" : formatPrice(fee)}</dd>
        </div>
        {s && !free && (
          <p className="rounded-xl bg-secondary-soft px-3 py-2 text-xs text-secondary-soft-fg">
            Add {formatPrice(s.freeShippingThreshold - subtotal)} more for free delivery.
          </p>
        )}
        <div className="flex justify-between border-t border-border pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold">{formatPrice(subtotal + fee)}</dd></div>
      </dl>
      <p className="mt-2 text-xs text-muted-fg">Pay in cash when your order arrives.</p>
      <div className="mt-6">{children}</div>
    </Card>
  );
}

export function CartView() {
  const { items, subtotal, update, remove, ready } = useCart();

  if (!ready) return <Container className="py-12"><div className="skeleton h-64" /></Container>;
  if (!items.length) {
    return (
      <Container className="py-12">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Browse the catalogue and add something your skin will thank you for." action={<Button href="/explore">Start shopping</Button>} />
      </Container>
    );
  }

  return (
    <Container className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1fr_360px]">
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 p-4 sm:p-6">
            <Link href={`/products/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
              <SmartImage src={item.image} alt="" fill sizes="96px" className="object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link href={`/products/${item.slug}`} className="line-clamp-2 font-semibold hover:text-primary">{item.title}</Link>
              <p className="mt-1 text-sm text-muted-fg">{formatPrice(item.price)} each</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                <div className="flex h-10 items-center rounded-xl border border-border" role="group" aria-label={`Quantity for ${item.title}`}>
                  <button type="button" onClick={() => update(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="flex h-full w-10 items-center justify-center rounded-xl hover:bg-muted disabled:opacity-40" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button type="button" onClick={() => update(item.id, item.quantity + 1)} disabled={item.quantity >= Math.min(10, item.stock)} className="flex h-full w-10 items-center justify-center rounded-xl hover:bg-muted disabled:opacity-40" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                  <button type="button" onClick={() => remove(item.id)} className="rounded-xl p-2 text-muted-fg hover:bg-danger-soft hover:text-danger" aria-label={`Remove ${item.title}`}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <CartSummary subtotal={subtotal}>
        <Button href="/checkout" size="lg" className="w-full">Checkout</Button>
        <Button href="/explore" variant="ghost" className="mt-2 w-full">Continue shopping</Button>
      </CartSummary>
    </Container>
  );
}

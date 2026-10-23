"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Container } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";
import { formatPrice } from "@/lib/format";
import { CartSummary } from "./CartView";

export const BD_CITIES = ["Dhaka", "Gazipur", "Narayanganj", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh", "Cumilla", "Bogura", "Cox's Bazar"];
export const bdPhone = z.string().trim().regex(/^(\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number (e.g. 01712345678)");

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(60),
  phone: bdPhone,
  city: z.string().min(2, "Choose your city"),
  address: z.string().trim().min(10, "Enter your full address (house, road, area)").max(200),
  note: z.string().trim().max(200).optional(),
});

export function CheckoutForm() {
  const { user } = useAuth();
  const { items, subtotal, clear, ready } = useCart();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState(null);
  const { register, control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    values: { name: user?.name || "", phone: user?.phone || "", city: user?.city || "Dhaka", address: user?.address || "", note: "" },
    resetOptions: { keepDirtyValues: true },
  });
  const city = useWatch({ control, name: "city" });

  const onSubmit = async (shipping) => {
    try {
      const { item } = await api("/orders", { method: "POST", body: { items: items.map((i) => ({ product: i.id, quantity: i.quantity })), shipping } });
      setOrder(item);
      clear();
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  if (order) {
    return (
      <Container className="py-12">
        <Card className="mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center" role="status">
          <CheckCircle2 className="h-14 w-14 text-secondary" />
          <h2 className="heading-2">Order placed!</h2>
          <p className="text-muted-fg">
            Your order <span className="font-semibold text-fg">{order.orderNumber}</span> for {formatPrice(order.total)} is confirmed. We&apos;ll call {order.shipping.phone} before delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/dashboard/orders">Track my orders</Button>
            <Button href="/explore" variant="outline">Keep shopping</Button>
          </div>
        </Card>
      </Container>
    );
  }

  if (ready && !items.length) {
    return (
      <Container className="py-12">
        <EmptyState title="Nothing to check out" description="Your cart is empty." action={<Button href="/explore">Browse products</Button>} />
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <Card className="p-6 sm:p-8">
          <h2 className="heading-3">Delivery details</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Full name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
            <Input label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="01712345678" error={errors.phone?.message} {...register("phone")} />
            <Select label="City" required error={errors.city?.message} {...register("city")}>
              {BD_CITIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Input label="Full address" required autoComplete="street-address" placeholder="House, road, area" error={errors.address?.message} {...register("address")} />
            <Textarea label="Delivery note" rows={3} className="sm:col-span-2" placeholder="Landmark or best time to call (optional)" error={errors.note?.message} {...register("note")} />
          </div>
          <h3 className="heading-3 mt-10">Items</h3>
          <ul className="mt-4 divide-y divide-border text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 py-3">
                <span className="min-w-0 truncate">{i.title} × {i.quantity}</span>
                <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <CartSummary subtotal={subtotal} city={city}>
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>{isSubmitting ? "Placing order…" : "Place order"}</Button>
          <p className="mt-3 text-center text-xs text-muted-fg">Prices and stock are re-checked by the server when you place the order.</p>
        </CartSummary>
      </form>
    </Container>
  );
}

import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/layout/Section";

export const metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <PageHeader title="Your cart" />
      <CartView />
    </>
  );
}

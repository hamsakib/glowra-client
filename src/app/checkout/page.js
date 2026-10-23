import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageHeader } from "@/components/layout/Section";

export const metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title="Checkout" description="Cash on delivery. You pay when the parcel arrives." />
      <CheckoutForm />
    </>
  );
}

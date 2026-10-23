import { FaqSection } from "@/components/home/Sections";
import { Container, PageHeader } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Help & FAQ",
  description: "Answers about orders, delivery, returns, authenticity and selling on Glowra.",
};

const GUIDES = [
  {
    id: "ordering",
    title: "Placing an order",
    steps: ["Add products to your cart from any product page.", "Open the cart and press Checkout. You'll be asked to log in or create an account.", "Enter your delivery address and phone number and confirm. Payment is cash on delivery."],
  },
  {
    id: "delivery",
    title: "Delivery & returns",
    steps: ["Inside Dhaka: 1 to 2 working days. Outside Dhaka: 2 to 4 working days.", "You can cancel an order from your dashboard while it is still pending.", "Sealed, unopened products can be returned within 7 days. Damaged items are replaced if reported within 48 hours."],
  },
  {
    id: "selling",
    title: "Selling on Glowra",
    steps: ["Create an account and open Dashboard → My Listings.", "Press Add listing and fill in the title, description, price, stock and photos.", "Edit or delete your listings at any time. Admins may unpublish listings that break our authenticity rules."],
  },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader eyebrow="Help centre" title="How can we help?" description="Guides to ordering, delivery and selling, plus answers to the questions we hear most." />
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <Card key={g.id} id={g.id} className="scroll-mt-24 p-6">
              <h2 className="heading-3">{g.title}</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-fg marker:font-semibold marker:text-primary">
                {g.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </Card>
          ))}
        </div>
      </Container>
      <FaqSection />
      <Container className="py-16 text-center">
        <h2 className="heading-2">Still stuck?</h2>
        <p className="body-lg mt-2">Send us a message and a real person will reply.</p>
        <Button href="/contact" className="mt-6">Contact support</Button>
      </Container>
    </>
  );
}

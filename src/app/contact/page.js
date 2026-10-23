import { ContactForm } from "@/components/forms/ContactForm";
import { Container, PageHeader } from "@/components/layout/Section";

export const metadata = {
  title: "Contact us",
  description: "Questions about an order, a product or selling on Glowra? Send us a message.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="We're here to help" description="Ask about an order, a product, delivery or selling on Glowra. We reply within one working day." />
      <Container className="py-12">
        <ContactForm />
      </Container>
    </>
  );
}

import { HeartHandshake, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Container, PageHeader, Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";

export const metadata = {
  title: "About us",
  description: "Why Glowra exists, how we choose products and what we promise every customer.",
};

const VALUES = [
  { icon: ShieldCheck, title: "Authentic or nothing", text: "We buy from authorised importers only. If we can't trace a product back to the brand, we don't sell it." },
  { icon: Leaf, title: "Chosen for our climate", text: "Heat, humidity and strong sun change what works. We favour light textures, high SPF and gentle formulas." },
  { icon: Sparkles, title: "Honest descriptions", text: "Every product page says what an ingredient can do and what it can't. No miracle claims, no whitening promises." },
  { icon: HeartHandshake, title: "Pay when it arrives", text: "Cash on delivery everywhere in Bangladesh, and easy returns on sealed products within seven days." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About Glowra" title="Korean skincare, without the guesswork" description="Glowra is a Dhaka-based skincare marketplace built around one idea: people should understand what they're putting on their skin before they pay for it." />
      <Section>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
            <SmartImage src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=75" alt="Skincare bottles and a jade roller on a striped towel" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="heading-1">Why we started</h2>
            <div className="body-lg mt-4 space-y-4">
              <p>
                Korean skincare is popular in Bangladesh for good reason: it is gentle, affordable and designed for daily use. But buying it has been confusing. Counterfeits are common, product descriptions are copied from elsewhere, and most advice ignores what our weather does to skin.
              </p>
              <p>
                Glowra brings a small, carefully chosen catalogue together with plain-language guides and reviews from real customers. Sellers can list products too, and every listing is held to the same standard.
              </p>
            </div>
            <Button href="/explore" className="mt-8">Browse the catalogue</Button>
          </div>
        </div>
      </Section>
      <Section tone="muted" eyebrow="What we promise" title="Four things we won't compromise on">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="h-full p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-fg"><Icon className="h-5 w-5" /></span>
              <h3 className="heading-3 mt-5">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-fg">{text}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Container className="py-16 text-center">
        <h2 className="heading-1">Questions about a product?</h2>
        <p className="body-lg mx-auto mt-3 max-w-xl">Our team answers every message within one working day.</p>
        <Button href="/contact" className="mt-6" size="lg">Contact us</Button>
      </Container>
    </>
  );
}

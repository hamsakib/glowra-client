import { Container } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-7xl font-semibold text-primary">404</p>
      <h1 className="heading-1 mt-4">We couldn&apos;t find that page</h1>
      <p className="body-lg mt-3 max-w-md">The link may be old or the product may no longer be listed.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Go home</Button>
        <Button href="/explore" variant="outline">Browse products</Button>
      </div>
    </Container>
  );
}

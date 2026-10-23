"use client";

import { Container } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

export default function Error({ reset }) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="heading-1">Something went wrong</h1>
      <p className="body-lg mt-3 max-w-md">The server may be waking up after a quiet spell. Give it a few seconds and try again.</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button href="/" variant="outline">Go home</Button>
      </div>
    </Container>
  );
}

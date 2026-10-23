import Link from "next/link";
import { cn } from "@/lib/format";

export function Container({ className, children }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

/** Standard section rhythm: 64px / 96px vertical padding, eyebrow + heading + optional link. */
export function Section({ id, eyebrow, title, description, action, className, children, tone }) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", tone === "muted" && "bg-muted/50", className)} aria-labelledby={id ? `${id}-title` : undefined}>
      <Container>
        {(title || eyebrow) && (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
              {title && <h2 id={id ? `${id}-title` : undefined} className="heading-1">{title}</h2>}
              {description && <p className="body-lg mt-3">{description}</p>}
            </div>
            {action && (
              <Link href={action.href} className="rounded-xl text-sm font-semibold text-primary hover:underline">
                {action.label} →
              </Link>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="border-b border-border bg-gradient-to-b from-primary-soft/60 to-transparent">
      <Container className="py-12 sm:py-16">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="heading-1">{title}</h1>
        {description && <p className="body-lg mt-3 max-w-2xl">{description}</p>}
        {children}
      </Container>
    </div>
  );
}

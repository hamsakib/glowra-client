import { cn } from "@/lib/format";

export function Card({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag className={cn("rounded-xl border border-border bg-surface shadow-card", className)} {...props}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4 border-b border-border p-6", className)}>
      <div>
        <h2 className="heading-3">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-fg">{description}</p>}
      </div>
      {action}
    </div>
  );
}

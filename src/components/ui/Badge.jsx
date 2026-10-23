import { cn } from "@/lib/format";

const TONES = {
  neutral: "bg-muted text-muted-fg",
  primary: "bg-primary-soft text-primary-soft-fg",
  secondary: "bg-secondary-soft text-secondary-soft-fg",
  accent: "bg-accent-soft text-accent-soft-fg",
  danger: "bg-danger-soft text-danger",
};

export const STATUS_TONE = {
  pending: "accent",
  confirmed: "primary",
  shipped: "secondary",
  delivered: "secondary",
  cancelled: "danger",
  published: "secondary",
  draft: "neutral",
  active: "secondary",
  blocked: "danger",
  admin: "primary",
  user: "neutral",
  new: "accent",
  read: "neutral",
  resolved: "secondary",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold capitalize", TONES[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  return <Badge tone={STATUS_TONE[status] || "neutral"}>{status}</Badge>;
}

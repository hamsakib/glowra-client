import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/format";

export function EmptyState({ icon: Icon = PackageOpen, title = "Nothing here yet", description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-fg">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="font-semibold">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-fg">{description}</p>}
      {action}
    </div>
  );
}

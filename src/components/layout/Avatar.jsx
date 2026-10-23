import { cn, initials } from "@/lib/format";

export function Avatar({ user, size = "h-9 w-9", className }) {
  if (user?.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={user.avatar} alt="" className={cn(size, "shrink-0 rounded-full object-cover", className)} loading="lazy" />
    );
  }
  return (
    <span className={cn(size, "flex shrink-0 items-center justify-center rounded-full bg-secondary-soft text-sm font-semibold text-secondary-soft-fg", className)} aria-hidden="true">
      {initials(user?.name) || "?"}
    </span>
  );
}

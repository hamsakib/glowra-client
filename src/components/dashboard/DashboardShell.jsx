"use client";

import {
  BarChart3,
  FolderTree,
  LayoutDashboard,
  ListPlus,
  Mail,
  Package,
  PackageSearch,
  Settings,
  ShoppingCart,
  Store,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/layout/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/format";

const USER_MENU = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "My Orders", icon: ShoppingCart },
  { href: "/dashboard/listings", label: "My Listings", icon: Package },
  { href: "/dashboard/listings/new", label: "Add Listing", icon: ListPlus },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const ADMIN_MENU = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/products", label: "Manage Products", icon: PackageSearch },
  { href: "/dashboard/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/dashboard/admin/messages", label: "Messages", icon: Mail },
  { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/admin/settings", label: "Store Settings", icon: Store },
];

const ADMIN_PERSONAL = [
  { href: "/dashboard/listings/new", label: "Add Product", icon: ListPlus },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Account Settings", icon: Settings },
];

function isActive(pathname, href) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname === href || (pathname.startsWith(`${href}/`) && !pathname.endsWith("/new"));
}

function NavList({ items, pathname }) {
  return (
    <ul className="flex gap-1 lg:flex-col">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition",
                active ? "bg-primary text-primary-fg" : "text-muted-fg hover:bg-muted hover:text-fg",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardShell({ children }) {
  const { user, isAdmin, status } = useAuth();
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("denied")) toast.error("That page is for admins only.", { id: "denied" });
  }, [params]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading your dashboard…" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
      <aside className="min-w-0 lg:sticky lg:top-24 lg:h-fit" aria-label="Dashboard">
        <div className="mb-4 hidden items-center gap-3 rounded-xl border border-border bg-surface p-4 lg:flex">
          <Avatar user={user} size="h-11 w-11" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-fg capitalize">{user.role} account</p>
          </div>
        </div>
        <nav className="overflow-x-auto pb-2 lg:overflow-visible lg:rounded-xl lg:border lg:border-border lg:bg-surface lg:p-3">
          {isAdmin ? (
            <>
              <p className="mb-2 hidden px-3 text-xs font-semibold tracking-wider text-muted-fg uppercase lg:block">Admin</p>
              <div className="flex gap-1 lg:block">
                <NavList items={ADMIN_MENU} pathname={pathname} />
                <p className="mt-4 mb-2 hidden px-3 text-xs font-semibold tracking-wider text-muted-fg uppercase lg:block">Personal</p>
                <NavList items={ADMIN_PERSONAL} pathname={pathname} />
              </div>
            </>
          ) : (
            <NavList items={USER_MENU} pathname={pathname} />
          )}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
    </div>
  );
}

export function DashboardHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="heading-2">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-fg">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint, tone = "primary", loading }) {
  const tones = {
    primary: "bg-primary-soft text-primary-soft-fg",
    secondary: "bg-secondary-soft text-secondary-soft-fg",
    accent: "bg-accent-soft text-accent-soft-fg",
  };
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-fg">{label}</p>
        {Icon && (
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tones[tone])}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </div>
      {loading ? <div className="skeleton mt-2 h-8 w-24" /> : <p className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{value}</p>}
      {hint && <p className="mt-1 text-xs text-muted-fg">{hint}</p>}
    </div>
  );
}

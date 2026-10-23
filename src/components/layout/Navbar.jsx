"use client";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCategories } from "@/hooks/queries";
import { cn } from "@/lib/format";
import { Avatar } from "./Avatar";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const GUEST_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore", mega: true },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const MEMBER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore", mega: true },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Mega menu: categories (live from the API) + shortcuts by concern. */
function ExploreMega({ active }) {
  const [open, setOpen] = useState(false);
  const { data } = useCategories();
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className={cn(
          "flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition hover:text-fg",
          active ? "text-primary" : "text-muted-fg",
        )}
      >
        Explore <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 z-50 w-[640px] -translate-x-1/2 pt-2" onClick={(e) => e.target.closest("a") && setOpen(false)}>
          <div className="grid animate-fade-up grid-cols-3 gap-6 rounded-xl border border-border bg-surface p-6 shadow-card">
            <div className="col-span-2">
              <p className="eyebrow mb-3">Shop by category</p>
              <ul className="grid grid-cols-2 gap-1">
                {(data?.items || []).map((c) => (
                  <li key={c._id}>
                    <Link href={`/explore?category=${c.slug}`} className="block rounded-xl p-3 transition hover:bg-muted">
                      <span className="block text-sm font-semibold">{c.name}</span>
                      <span className="text-xs text-muted-fg">{c.productCount} products</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-primary-soft p-4">
              <p className="eyebrow mb-3">Shop by concern</p>
              <ul className="space-y-1 text-sm">
                {[
                  ["acne", "Acne & breakouts"],
                  ["dark-spots", "Dark spots"],
                  ["dehydration", "Dehydration"],
                  ["sun-protection", "Sun protection"],
                ].map(([value, label]) => (
                  <li key={value}>
                    <Link href={`/explore?concern=${value}`} className="block rounded-xl px-2 py-1.5 font-medium text-primary-soft-fg hover:bg-surface/60">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/explore" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                View all products →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CartButton() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-fg transition hover:bg-muted hover:text-fg" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-fg">
          {count}
        </span>
      )}
    </Link>
  );
}

function ProfileMenu() {
  const { user, isAdmin, logout } = useAuth();
  return (
    <Dropdown
      label="Open profile menu"
      trigger={
        <span className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-muted">
          <Avatar user={user} />
          <ChevronDown className="hidden h-4 w-4 text-muted-fg sm:block" />
        </span>
      }
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <Avatar user={user} size="h-10 w-10" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-fg">{user.email}</p>
        </div>
      </div>
      {isAdmin && (
        <span className="mx-3 mb-1 inline-flex items-center gap-1 rounded-xl bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-soft-fg">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin
        </span>
      )}
      <DropdownSeparator />
      <DropdownItem href="/dashboard" icon={LayoutDashboard}>Dashboard</DropdownItem>
      <DropdownItem href="/dashboard/profile" icon={User}>My profile</DropdownItem>
      <DropdownItem href="/dashboard/orders" icon={Package}>My orders</DropdownItem>
      <DropdownItem href="/dashboard/settings" icon={Settings}>Settings</DropdownItem>
      <DropdownSeparator />
      <DropdownItem onClick={logout} icon={LogOut} danger>Log out</DropdownItem>
    </Dropdown>
  );
}

export function Navbar() {
  const { isAuthenticated, status, logout } = useAuth();
  const pathname = usePathname();
  // The mobile menu remembers the path it was opened on, so navigating closes it.
  const [menuPath, setMenuPath] = useState(null);
  const mobileOpen = menuPath === pathname;
  const links = isAuthenticated ? MEMBER_LINKS : GUEST_LINKS;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/85 backdrop-blur-md">
      <a href="#main" className="sr-only rounded-xl bg-primary px-4 py-2 text-primary-fg focus:not-sr-only focus:absolute focus:top-2 focus:left-2">
        Skip to content
      </a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) =>
            link.mega ? (
              <li key={link.href}>
                <ExploreMega active={isActive(pathname, link.href)} />
              </li>
            ) : (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition hover:text-fg",
                    isActive(pathname, link.href) ? "text-primary" : "text-muted-fg",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <CartButton />
          {status === "loading" ? (
            <span className="skeleton ml-1 h-9 w-9 rounded-full" />
          ) : isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <div className="ml-1 hidden items-center gap-2 sm:flex">
              <Button href="/login" variant="ghost" size="sm">Log in</Button>
              <Button href="/register" size="sm">Sign up</Button>
            </div>
          )}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-fg hover:bg-muted lg:hidden"
            onClick={() => setMenuPath(mobileOpen ? null : pathname)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-surface px-4 pt-4 pb-8 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-medium",
                    isActive(pathname, link.href) ? "bg-primary-soft text-primary-soft-fg" : "hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/help" className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-muted">Help & FAQ</Link>
            </li>
          </ul>
          <div className="mt-6 border-t border-border pt-6">
            {isAuthenticated ? (
              <div className="grid gap-2">
                <Button href="/dashboard/profile" variant="outline">My profile</Button>
                <Button variant="soft" onClick={logout}>Log out</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button href="/login" variant="outline">Log in</Button>
                <Button href="/register">Sign up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

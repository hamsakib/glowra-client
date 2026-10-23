"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/format";

const DropdownContext = createContext(null);

/**
 * Accessible menu button: opens on click, closes on outside click / Esc / selection,
 * and supports arrow-key navigation between items.
 */
export function Dropdown({ trigger, children, align = "right", className, label = "Open menu" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = [...(menuRef.current?.querySelectorAll("[role=menuitem]") || [])];
        const index = items.indexOf(document.activeElement);
        const next = e.key === "ArrowDown" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
        items[next]?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    menuRef.current?.querySelector("[role=menuitem]")?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ close: () => setOpen(false) }}>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={label}
          onClick={() => setOpen((o) => !o)}
          className="flex items-center rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
        >
          {trigger}
        </button>
        {open && (
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            className={cn(
              "absolute z-50 mt-2 min-w-56 animate-fade-up rounded-xl border border-border bg-surface p-2 shadow-card",
              align === "right" ? "right-0" : "left-0",
              className,
            )}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownItem({ href, onClick, icon: Icon, children, danger }) {
  const { close } = useContext(DropdownContext);
  const classes = cn(
    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium outline-none transition",
    "hover:bg-muted focus:bg-muted",
    danger ? "text-danger" : "text-fg",
  );
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 text-muted-fg" aria-hidden="true" />}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} role="menuitem" className={classes} onClick={close}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" role="menuitem" className={classes} onClick={() => { close(); onClick?.(); }}>
      {content}
    </button>
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-2 h-px bg-border" />;
}

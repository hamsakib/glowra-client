import Link from "next/link";
import { cn } from "@/lib/format";
import { Spinner } from "./Spinner";

const VARIANTS = {
  primary: "bg-primary text-primary-fg hover:opacity-90",
  secondary: "bg-secondary text-secondary-fg hover:opacity-90",
  outline: "border border-border bg-surface text-fg hover:bg-muted",
  ghost: "text-fg hover:bg-muted",
  soft: "bg-primary-soft text-primary-soft-fg hover:opacity-90",
  danger: "bg-danger text-white hover:opacity-90 dark:text-[#1c1917]",
};

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10",
};

export function buttonClasses({ variant = "primary", size = "md", className } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-xl font-semibold transition duration-200 select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

/** Button that renders a Next <Link> when `href` is given. Shows a spinner and disables itself while `loading`. */
export function Button({ href, variant, size, className, loading = false, disabled, children, type = "button", ...props }) {
  const classes = buttonClasses({ variant, size, className });
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

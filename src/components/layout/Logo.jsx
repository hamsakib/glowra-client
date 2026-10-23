import Link from "next/link";

export function Logo({ className = "" }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 rounded-xl ${className}`} aria-label="Glowra home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-fg">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3c-3 4-6 6.5-6 10a6 6 0 0 0 12 0c0-3.5-3-6-6-10Z" />
          <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">Glowra</span>
    </Link>
  );
}

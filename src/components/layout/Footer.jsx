"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/queries";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      ["/explore", "All products"],
      ["/explore?category=sunscreen", "Sunscreen"],
      ["/explore?category=serums", "Serums & ampoules"],
      ["/explore?sort=popular", "Best sellers"],
    ],
  },
  {
    title: "Company",
    links: [
      ["/about", "About us"],
      ["/blog", "Skincare journal"],
      ["/contact", "Contact"],
      ["/help", "Help & FAQ"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["/privacy", "Privacy policy"],
      ["/terms", "Terms & conditions"],
      ["/help#delivery", "Delivery & returns"],
    ],
  },
];

function SocialIcon({ name }) {
  const paths = {
    Facebook: "M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.7-.6Z",
    Instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
    YouTube: "M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15V9l5.2 3L10 15Z",
    TikTok: "M16.5 3c.4 2.2 1.8 3.7 4 3.9v3.3a7.4 7.4 0 0 1-4-1.2v6.3a6 6 0 1 1-6-6h.6v3.3a2.8 2.8 0 1 0 2.2 2.7V3h3.2Z",
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

const SOCIALS = [
  ["Facebook", "https://www.facebook.com/"],
  ["Instagram", "https://www.instagram.com/"],
  ["YouTube", "https://www.youtube.com/"],
  ["TikTok", "https://www.tiktok.com/"],
];

export function Footer() {
  const { data } = useSettings();
  const s = data?.item;
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-fg">
            Authentic Korean skincare, explained honestly and delivered across Bangladesh. Cash on delivery, no surprises.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3 text-muted-fg">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{s?.address || "Dhaka, Bangladesh"}</span>
            </li>
            <li>
              <a href={`tel:${(s?.supportPhone || "").replace(/[^+\d]/g, "")}`} className="flex items-center gap-3 text-muted-fg hover:text-fg">
                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {s?.supportPhone || "Loading…"}
              </a>
            </li>
            <li>
              <a href={`mailto:${s?.supportEmail || ""}`} className="flex items-center gap-3 text-muted-fg hover:text-fg">
                <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {s?.supportEmail || "Loading…"}
              </a>
            </li>
          </ul>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-muted-fg transition hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-fg sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Glowra. All rights reserved. Portfolio project: orders, customers and reviews are sample data.</p>
          <ul className="flex items-center gap-2">
            {SOCIALS.map(([name, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Glowra on ${name}`} className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-muted hover:text-primary">
                  <SocialIcon name={name} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

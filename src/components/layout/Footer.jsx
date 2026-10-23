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
    GitHub: "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3",
    LinkedIn: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z",
    WhatsApp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.2Z",
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

// The developer's own profiles: Glowra is a portfolio project with no brand accounts of its own.
const SOCIALS = [
  ["GitHub", "https://github.com/hamsakib/glowra-client"],
  ["LinkedIn", "https://www.linkedin.com/in/hasan-al-mahmud-89a504240/"],
  ["WhatsApp", "https://wa.me/8801842001223"],
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
          <p>© {new Date().getFullYear()} Glowra. All rights reserved. Portfolio project by Hasan Al Mahmud: orders, customers and reviews are sample data.</p>
          <ul className="flex items-center gap-2">
            {SOCIALS.map(([name, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Developer on ${name}`} className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-muted hover:text-primary">
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

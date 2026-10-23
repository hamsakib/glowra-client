import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", weight: ["500", "600", "700"] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Glowra | Authentic Korean Skincare in Bangladesh", template: "%s | Glowra" },
  description: "Shop authentic Korean skincare from COSRX, Anua, Beauty of Joseon, SKIN1004 and more. Honest guides, real reviews and cash on delivery across Bangladesh.",
  openGraph: { type: "website", siteName: "Glowra" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#121010" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

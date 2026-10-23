import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
    qualities: [60, 75],
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    // Strip console.* from the production bundle (keeps console.error for real failures).
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;

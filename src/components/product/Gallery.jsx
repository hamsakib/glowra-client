"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/format";

/** Main image + thumbnail strip. Arrow keys move between images when the gallery is focused. */
export function Gallery({ images, title }) {
  const [index, setIndex] = useState(0);
  const go = (n) => setIndex((n + images.length) % images.length);

  return (
    <div
      className="flex flex-col gap-4"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
        {images.map((src, i) => (
          <div key={src} className={cn("absolute inset-0 transition-opacity duration-500", i === index ? "opacity-100" : "opacity-0")} aria-hidden={i !== index}>
            <SmartImage src={src} alt={`${title}, photo ${i + 1} of ${images.length}`} fill priority={i === 0} sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
        ))}
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-surface/90 shadow-card backdrop-blur hover:bg-surface">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-surface/90 shadow-card backdrop-blur hover:bg-surface">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute right-3 bottom-3 rounded-xl bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn("relative aspect-square overflow-hidden rounded-xl border-2 bg-muted transition", i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}
            >
              <SmartImage src={src} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

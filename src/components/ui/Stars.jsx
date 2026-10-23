import { Star } from "lucide-react";
import { cn } from "@/lib/format";

export function Stars({ value = 0, size = "h-4 w-4", className, showValue = false }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Rated ${value} out of 5`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={cn(size, n <= Math.round(value) ? "fill-accent text-accent" : "fill-transparent text-border")}
        />
      ))}
      {showValue && <span className="ml-1 text-sm font-semibold text-fg">{value.toFixed(1)}</span>}
    </span>
  );
}

/** Interactive 1–5 star picker for review forms (radio group under the hood). */
export function StarInput({ value, onChange, error }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">Your rating <span className="text-primary">*</span></legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer rounded-xl p-1 hover:bg-muted">
            <input type="radio" name="rating" value={n} checked={value === n} onChange={() => onChange(n)} className="sr-only" />
            <Star className={cn("h-7 w-7 transition", n <= value ? "fill-accent text-accent" : "text-border")} aria-hidden="true" />
            <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
          </label>
        ))}
      </div>
      {error && <p role="alert" className="mt-1 text-xs font-medium text-danger">{error}</p>}
    </fieldset>
  );
}

import { SmartImage } from "@/components/ui/SmartImage";

export function AuthShell({ title, description, children }) {
  return (
    <div className="mx-auto grid grid-cols-1 w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-xl border border-border bg-muted lg:block">
        <SmartImage src="https://images.unsplash.com/photo-1655026392641-bf283a5f12d4?auto=format&fit=crop&w=1000&q=75" alt="" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <p className="absolute right-8 bottom-8 left-8 font-display text-2xl leading-snug font-semibold text-white">
          “Good skincare is a habit, not a haul.”
        </p>
      </div>
      <div className="mx-auto w-full max-w-md py-4">
        <h1 className="heading-1">{title}</h1>
        <p className="mt-2 text-muted-fg">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

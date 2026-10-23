"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/format";

const fieldBase =
  "w-full rounded-xl border bg-surface px-4 text-sm text-fg placeholder:text-muted-fg/70 transition outline-none " +
  "focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60";

/** Label + control + hint/error, with aria wiring so screen readers announce errors. */
function Field({ id, label, error, hint, required, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
          {required && <span className="ml-0.5 text-primary" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-fg">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id, error, hint) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export const Input = forwardRef(function Input({ label, error, hint, className, id, required, type = "text", ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <Field id={inputId} label={label} error={error} hint={hint} required={required} className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword && show ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          aria-required={required || undefined}
          className={cn(fieldBase, "h-11", isPassword && "pr-11", error ? "border-danger" : "border-border")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-xl text-muted-fg hover:text-fg"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </Field>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, hint, className, id, required, rows = 4, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <Field id={inputId} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        aria-required={required || undefined}
        className={cn(fieldBase, "py-3 leading-relaxed", error ? "border-danger" : "border-border")}
        {...props}
      />
    </Field>
  );
});

export const Select = forwardRef(function Select({ label, error, hint, className, id, required, children, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <Field id={inputId} label={label} error={error} hint={hint} required={required} className={className}>
      <select
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        aria-required={required || undefined}
        className={cn(fieldBase, "h-11 cursor-pointer appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10", error ? "border-danger" : "border-border")}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
});

export function Checkbox({ label, className, ...props }) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-3 text-sm text-fg", className)}>
      <input id={id} type="checkbox" className="h-4 w-4 cursor-pointer rounded accent-[var(--primary)]" {...props} />
      {label}
    </label>
  );
}

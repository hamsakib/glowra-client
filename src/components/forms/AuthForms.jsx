"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ShieldCheck, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { applyServerErrors } from "@/lib/forms";
import { cn } from "@/lib/format";

// Demo accounts created by the seed script (documented in the README).
const DEMO = {
  user: { email: "user@glowra.dev", password: "User@1234" },
  admin: { email: "admin@glowra.dev", password: "Admin@1234" },
};

const PASSWORD_RULES = [
  { test: (v) => v.length >= 8, label: "At least 8 characters" },
  { test: (v) => /[a-z]/.test(v), label: "A lowercase letter" },
  { test: (v) => /[A-Z]/.test(v), label: "An uppercase letter" },
  { test: (v) => /\d/.test(v), label: "A number" },
];

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be 72 characters or fewer")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/\d/, "Password needs a number");

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
    email: z.email("Enter a valid email address"),
    password: passwordSchema,
    confirm: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, { error: "Please accept the terms to continue" }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

/** Only allow same-site relative redirects after login. */
function safeNext(value) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export function PasswordChecklist({ value = "" }) {
  return (
    <ul className="grid grid-cols-2 gap-1.5 text-xs" aria-label="Password requirements">
      {PASSWORD_RULES.map((r) => {
        const ok = r.test(value);
        return (
          <li key={r.label} className={cn("flex items-center gap-1.5", ok ? "text-secondary" : "text-muted-fg")}>
            {ok ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <X className="h-3.5 w-3.5" aria-hidden="true" />}
            {r.label}
            <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (params.get("expired")) toast.warning("Your session expired. Please log in again.", { id: "expired" });
  }, [params]);

  const fillDemo = (role) => {
    setValue("email", DEMO[role].email, { shouldValidate: true });
    setValue("password", DEMO[role].password, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    try {
      const me = await login(values);
      toast.success(`Welcome back, ${me.name.split(" ")[0]}!`);
      router.replace(next);
    } catch (err) {
      if (err.status === 401) setError("password", { message: err.message });
      else applyServerErrors(err, setError);
    }
  };

  return (
    <>
      <div className="mb-6 rounded-xl border border-dashed border-border bg-muted/60 p-4">
        <p className="text-sm font-semibold">Try a demo account</p>
        <p className="mt-0.5 text-xs text-muted-fg">Fills in the credentials. Press Log in to continue.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => fillDemo("user")}><User className="h-4 w-4" /> Demo user</Button>
          <Button variant="outline" size="sm" onClick={() => fillDemo("admin")}><ShieldCheck className="h-4 w-4" /> Demo admin</Button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input label="Email" type="email" autoComplete="email" required error={errors.email?.message} {...register("email")} />
        <Input label="Password" type="password" autoComplete="current-password" required error={errors.password?.message} {...register("password")} />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-fg">
        New to Glowra? <Link href={`/register${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </>
  );
}

export function RegisterForm() {
  const { register: signUp } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { register, control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });
  const password = useWatch({ control, name: "password", defaultValue: "" });

  const onSubmit = async ({ name, email, password: pw }) => {
    try {
      await signUp({ name, email, password: pw });
      toast.success("Account created. Welcome to Glowra!");
      router.replace(next);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input label="Full name" autoComplete="name" required error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" autoComplete="email" required error={errors.email?.message} {...register("email")} />
        <div className="space-y-2">
          <Input label="Password" type="password" autoComplete="new-password" required error={errors.password?.message} {...register("password")} />
          <PasswordChecklist value={password} />
        </div>
        <Input label="Confirm password" type="password" autoComplete="new-password" required error={errors.confirm?.message} {...register("confirm")} />
        <div>
          <label className="flex items-start gap-3 text-sm text-muted-fg">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--primary)]" aria-invalid={errors.terms ? true : undefined} {...register("terms")} />
            <span>
              I agree to the <Link href="/terms" className="font-medium text-primary hover:underline">terms</Link> and <Link href="/privacy" className="font-medium text-primary hover:underline">privacy policy</Link>.
            </span>
          </label>
          {errors.terms && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.terms.message}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-fg">
        Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link>
      </p>
    </>
  );
}

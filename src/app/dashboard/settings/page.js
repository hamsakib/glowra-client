"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { PasswordChecklist, passwordSchema } from "@/components/forms/AuthForms";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Checkbox, Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";
import { cn } from "@/lib/format";

const passwordForm = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirm: z.string().min(1, "Please confirm the new password"),
  })
  .refine((d) => d.newPassword === d.confirm, { path: ["confirm"], message: "Passwords don't match" })
  .refine((d) => d.newPassword !== d.currentPassword, { path: ["newPassword"], message: "New password must be different" });

function PasswordCard() {
  const { register, control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(passwordForm) });
  const newPassword = useWatch({ control, name: "newPassword", defaultValue: "" });
  const submit = async ({ currentPassword, newPassword }) => {
    try {
      await api("/users/me/password", { method: "PATCH", body: { currentPassword, newPassword } });
      toast.success("Password updated");
      reset({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };
  return (
    <Card>
      <CardHeader title="Change password" description="Use at least 8 characters with upper and lower case letters and a number." />
      <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-5 p-6 sm:max-w-md">
        <Input label="Current password" type="password" required autoComplete="current-password" error={errors.currentPassword?.message} {...register("currentPassword")} />
        <div className="space-y-2">
          <Input label="New password" type="password" required autoComplete="new-password" error={errors.newPassword?.message} {...register("newPassword")} />
          <PasswordChecklist value={newPassword} />
        </div>
        <Input label="Confirm new password" type="password" required autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
        <div><Button type="submit" loading={isSubmitting}>Update password</Button></div>
      </form>
    </Card>
  );
}

function PreferencesCard() {
  const { user, setUser } = useAuth();
  const [prefs, setPrefs] = useState(user.preferences || { newsletter: true, orderUpdates: true });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      const res = await api("/users/me/preferences", { method: "PATCH", body: prefs });
      setUser(res.user);
      toast.success("Preferences saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Card>
      <CardHeader title="Email preferences" />
      <div className="space-y-4 p-6">
        <Checkbox label="Monthly skincare newsletter" checked={prefs.newsletter} onChange={(e) => setPrefs((p) => ({ ...p, newsletter: e.target.checked }))} />
        <Checkbox label="Order status updates" checked={prefs.orderUpdates} onChange={(e) => setPrefs((p) => ({ ...p, orderUpdates: e.target.checked }))} />
        <Button variant="outline" onClick={save} loading={saving}>Save preferences</Button>
      </div>
    </Card>
  );
}

function ThemeCard() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  return (
    <Card>
      <CardHeader title="Appearance" description="Choose how Glowra looks on this device." />
      <div className="grid grid-cols-3 gap-3 p-6 sm:max-w-md" role="radiogroup" aria-label="Theme">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mounted && theme === value}
            onClick={() => setTheme(value)}
            className={cn("flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition", mounted && theme === value ? "border-primary bg-primary-soft text-primary-soft-fg" : "border-border hover:bg-muted")}
          >
            <Icon className="h-5 w-5" /> {label}
          </button>
        ))}
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Account settings" />
      <div className="grid gap-6">
        <PasswordCard />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PreferencesCard />
          <ThemeCard />
        </div>
      </div>
    </>
  );
}

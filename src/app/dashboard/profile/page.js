"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BD_CITIES } from "@/components/cart/CheckoutForm";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { uploadImageFile } from "@/components/dashboard/ImageUploader";
import { Avatar } from "@/components/layout/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";
import { SKIN_TYPES, formatDate } from "@/lib/format";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  phone: z.union([z.literal(""), z.string().trim().regex(/^(\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number")]),
  city: z.string().optional(),
  address: z.string().trim().max(200).optional(),
  skinType: z.string().optional(),
  bio: z.string().trim().max(280, "Bio must be 280 characters or fewer").optional(),
});

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name, phone: user.phone || "", city: user.city || "", address: user.address || "", skinType: user.skinType || "", bio: user.bio || "" },
  });

  const save = async (values) => {
    try {
      const res = await api("/users/me", { method: "PATCH", body: values });
      setUser(res.user);
      reset(values);
      toast.success("Profile updated");
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  const setAvatar = async (avatar) => {
    const res = await api("/users/me", { method: "PATCH", body: { name: user.name, avatar } });
    setUser(res.user);
  };

  const onAvatar = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      await setAvatar(await uploadImageFile(file, "avatar"));
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <DashboardHeader title="My profile" description={`Member since ${formatDate(user.createdAt, { month: "long", year: "numeric" })}`} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr]">
        <Card className="flex h-fit flex-col items-center p-6 text-center">
          <div className="relative">
            <Avatar user={user} size="h-28 w-28 text-2xl" />
            {uploading && <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs font-semibold text-white">Uploading…</span>}
          </div>
          <p className="mt-4 font-semibold">{user.name}</p>
          <p className="text-sm text-muted-fg">{user.email}</p>
          <input ref={fileRef} id="avatar-input" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => onAvatar(e.target.files?.[0])} />
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
              <Camera className="h-4 w-4" /> {user.avatar ? "Change photo" : "Upload photo"}
            </Button>
            {user.avatar && (
              <Button variant="ghost" size="sm" onClick={() => setAvatar("").then(() => toast.success("Photo removed"))}>
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-fg">JPG, PNG or WebP up to 3 MB. Cropped to a square.</p>
        </Card>
        <Card>
          <CardHeader title="Personal information" description="Used to pre-fill checkout. Your email can't be changed." />
          <form onSubmit={handleSubmit(save)} noValidate className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
            <Input label="Full name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
            <Input label="Email" value={user.email} disabled readOnly />
            <Input label="Mobile number" type="tel" autoComplete="tel" placeholder="01712345678" error={errors.phone?.message} {...register("phone")} />
            <Select label="City" error={errors.city?.message} {...register("city")}>
              <option value="">Choose a city</option>
              {BD_CITIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Input label="Address" className="sm:col-span-2" autoComplete="street-address" error={errors.address?.message} {...register("address")} />
            <Select label="Skin type" error={errors.skinType?.message} {...register("skinType")}>
              <option value="">Not sure</option>
              {SKIN_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
            <Textarea label="Bio" rows={3} className="sm:col-span-2" hint="Shown on your listings. Max 280 characters." error={errors.bio?.message} {...register("bio")} />
            <div className="sm:col-span-2">
              <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useSettings } from "@/hooks/queries";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";

const money = z.coerce.number({ error: "Enter a number" }).int("Whole numbers only").min(0, "Can't be negative");
const schema = z.object({
  storeName: z.string().trim().min(2, "Required").max(40),
  supportEmail: z.email("Enter a valid email"),
  supportPhone: z.string().trim().min(6, "Enter a phone number").max(20),
  address: z.string().trim().min(5, "Enter an address").max(120),
  shippingFeeDhaka: money.max(1000),
  shippingFeeOutside: money.max(1000),
  freeShippingThreshold: money.max(100000),
  announcement: z.string().trim().max(140, "140 characters max").optional(),
});

export default function StoreSettingsPage() {
  const { data, isLoading } = useSettings();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting, isDirty } } = useForm({ resolver: zodResolver(schema) });
  useEffect(() => {
    if (data?.item) reset(data.item);
  }, [data, reset]);

  const save = async (values) => {
    try {
      const res = await api("/settings", { method: "PUT", body: values });
      queryClient.setQueryData(["settings"], res);
      reset(res.item);
      toast.success("Store settings saved");
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  if (isLoading) return <div className="skeleton h-96" />;

  return (
    <>
      <DashboardHeader title="Store settings" description="Contact details appear in the footer and contact page. Fees apply at checkout." />
      <form onSubmit={handleSubmit(save)} noValidate className="grid gap-6">
        <Card>
          <CardHeader title="Contact details" />
          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
            <Input label="Store name" required error={errors.storeName?.message} {...register("storeName")} />
            <Input label="Support email" type="email" required error={errors.supportEmail?.message} {...register("supportEmail")} />
            <Input label="Support phone" required error={errors.supportPhone?.message} {...register("supportPhone")} />
            <Input label="Address" required error={errors.address?.message} {...register("address")} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Delivery fees (৳)" />
          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-3">
            <Input label="Inside Dhaka" type="number" min="0" required error={errors.shippingFeeDhaka?.message} {...register("shippingFeeDhaka")} />
            <Input label="Outside Dhaka" type="number" min="0" required error={errors.shippingFeeOutside?.message} {...register("shippingFeeOutside")} />
            <Input label="Free delivery from" type="number" min="0" required error={errors.freeShippingThreshold?.message} {...register("freeShippingThreshold")} />
          </div>
        </Card>
        <div><Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save settings</Button></div>
      </form>
    </>
  );
}

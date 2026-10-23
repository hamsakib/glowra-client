"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useSettings } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.email("Enter a valid email address"),
  topic: z.string().min(1, "Choose a topic"),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(100),
  message: z.string().trim().min(20, "Message must be at least 20 characters").max(2000, "Keep it under 2000 characters"),
});

export function ContactForm() {
  const { user } = useAuth();
  const { data } = useSettings();
  const s = data?.item;
  const [sent, setSent] = useState("");
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    values: { name: user?.name || "", email: user?.email || "", topic: "", subject: "", message: "" },
    resetOptions: { keepDirtyValues: true },
  });

  const onSubmit = async ({ topic, subject, ...rest }) => {
    try {
      const res = await api("/messages", { method: "POST", body: { ...rest, subject: `[${topic}] ${subject}` }, auth: false });
      setSent(res.message);
      reset();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <Card className="p-6 sm:p-8">
        {sent ? (
          <div role="status" className="flex flex-col items-center gap-4 py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-secondary" />
            <h2 className="heading-2">Message sent</h2>
            <p className="max-w-md text-muted-fg">{sent}</p>
            <Button variant="outline" onClick={() => setSent("")}>Send another message</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Your name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
            <Select label="Topic" required error={errors.topic?.message} {...register("topic")}>
              <option value="">Choose a topic</option>
              <option>Order</option>
              <option>Product question</option>
              <option>Delivery</option>
              <option>Returns</option>
              <option>Selling on Glowra</option>
              <option>Other</option>
            </Select>
            <Input label="Subject" required error={errors.subject?.message} {...register("subject")} />
            <Textarea label="Message" required rows={6} className="sm:col-span-2" hint="At least 20 characters. Include your order number if you have one." error={errors.message?.message} {...register("message")} />
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" loading={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}</Button>
            </div>
          </form>
        )}
      </Card>
      <aside className="space-y-4">
        {[
          { icon: Phone, title: "Call or WhatsApp", value: s?.supportPhone, href: s && `tel:${s.supportPhone.replace(/[^+\d]/g, "")}` },
          { icon: Mail, title: "Email", value: s?.supportEmail, href: s && `mailto:${s.supportEmail}` },
          { icon: MapPin, title: "Office", value: s?.address },
          { icon: Clock, title: "Hours", value: "Saturday to Thursday, 10am to 7pm" },
        ].map(({ icon: Icon, title, value, href }) => (
          <Card key={title} className="flex items-start gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-soft text-secondary-soft-fg"><Icon className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              {value ? (href ? <a href={href} className="text-sm text-muted-fg hover:text-primary">{value}</a> : <p className="text-sm text-muted-fg">{value}</p>) : <span className="skeleton mt-1 block h-4 w-40" />}
            </div>
          </Card>
        ))}
      </aside>
    </div>
  );
}

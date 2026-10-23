"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar } from "@/components/layout/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Textarea } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { StarInput, Stars } from "@/components/ui/Stars";
import { useReviews } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { applyServerErrors } from "@/lib/forms";
import { formatDate } from "@/lib/format";

const schema = z.object({
  rating: z.number({ error: "Choose a rating" }).int().min(1, "Choose a rating").max(5),
  title: z.string().trim().max(80, "Keep the title under 80 characters").optional(),
  comment: z.string().trim().min(10, "Review must be at least 10 characters").max(1000, "Keep it under 1000 characters"),
});

function ReviewForm({ product, onDone }) {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, setError, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, title: "", comment: "" },
  });
  const mutation = useMutation({
    mutationFn: (values) => api(`/reviews/product/${product._id}`, { method: "POST", body: values }),
    onSuccess: () => {
      toast.success("Thanks! Your review is live.");
      reset();
      queryClient.invalidateQueries({ queryKey: ["reviews", product._id] });
      queryClient.invalidateQueries({ queryKey: ["review-eligibility", product._id] });
      onDone();
    },
    onError: (err) => applyServerErrors(err, setError),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <Controller name="rating" control={control} render={({ field }) => <StarInput value={field.value} onChange={field.onChange} error={errors.rating?.message} />} />
      <Input label="Title" placeholder="Sum it up in a few words" error={errors.title?.message} {...register("title")} />
      <Textarea label="Your review" required placeholder="How did it feel, how long have you used it, what changed?" error={errors.comment?.message} {...register("comment")} />
      <Button type="submit" loading={mutation.isPending}>Submit review</Button>
    </form>
  );
}

export function Reviews({ product }) {
  const { isAuthenticated, user } = useAuth();
  const [page, setPage] = useState(1);
  const [writing, setWriting] = useState(false);
  const { data, isLoading } = useReviews(product._id, page);
  const eligibility = useQuery({
    queryKey: ["review-eligibility", product._id],
    queryFn: () => api(`/reviews/product/${product._id}/eligibility`),
    enabled: isAuthenticated,
  });
  const isSeller = user && product.seller?._id === user._id;
  const total = data?.total || 0;

  return (
    <section id="reviews" className="scroll-mt-24 border-t border-border py-12" aria-labelledby="reviews-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <h2 id="reviews-title" className="heading-2">Reviews</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-4xl font-semibold">{product.rating ? product.rating.toFixed(1) : "–"}</span>
            <div>
              <Stars value={product.rating} />
              <p className="text-sm text-muted-fg">{total} review{total === 1 ? "" : "s"}</p>
            </div>
          </div>
          {data?.stars && (
            <ul className="mt-6 space-y-2" aria-label="Rating breakdown">
              {[5, 4, 3, 2, 1].map((n) => {
                const count = data.stars[n] || 0;
                const pct = total ? (count / total) * 100 : 0;
                return (
                  <li key={n} className="flex items-center gap-3 text-sm">
                    <span className="w-8 text-muted-fg">{n}★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-6 text-right text-muted-fg">{count}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-6">
            {!isAuthenticated ? (
              <Button href={`/login?next=/products/${product.slug}%23reviews`} variant="outline" className="w-full">Log in to write a review</Button>
            ) : isSeller ? (
              <p className="text-sm text-muted-fg">You listed this product, so you can&apos;t review it.</p>
            ) : eligibility.data?.reviewed ? (
              <p className="flex items-center gap-2 text-sm text-secondary"><BadgeCheck className="h-4 w-4" /> You&apos;ve reviewed this product.</p>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setWriting((w) => !w)} aria-expanded={writing}>
                {writing ? "Cancel" : "Write a review"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {writing && <ReviewForm product={product} onDone={() => setWriting(false)} />}
          {isLoading ? (
            Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-32" />)
          ) : total === 0 ? (
            <EmptyState icon={MessageSquare} title="No reviews yet" description="Bought this? Be the first to share how it worked for you." />
          ) : (
            <>
              <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
                {data.items.map((r) => (
                  <li key={r._id} className="p-6">
                    <div className="flex items-center gap-3">
                      <Avatar user={r.user} />
                      <div>
                        <p className="text-sm font-semibold">{r.user?.name || "Former customer"}</p>
                        <p className="text-xs text-muted-fg">{formatDate(r.createdAt)}</p>
                      </div>
                      <Stars value={r.rating} className="ml-auto" size="h-3.5 w-3.5" />
                    </div>
                    {r.title && <p className="mt-4 font-semibold">{r.title}</p>}
                    <p className="mt-1 text-sm leading-relaxed text-muted-fg">{r.comment}</p>
                  </li>
                ))}
              </ul>
              <Pagination page={data.page} pages={data.pages} total={data.total} limit={data.limit} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

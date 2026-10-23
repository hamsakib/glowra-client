"use client";

import { useState } from "react";
import { PostCard } from "@/components/home/Sections";
import { Container } from "@/components/layout/Section";
import { Pagination } from "@/components/ui/Pagination";
import { usePosts } from "@/hooks/queries";
import { cn } from "@/lib/format";

const TAGS = ["All", "Basics", "Routine", "Sunscreen", "Ingredients", "Cleansing", "Shopping"];

export function BlogList() {
  const [tag, setTag] = useState("All");
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts({ tag: tag === "All" ? "" : tag, page });

  return (
    <Container className="py-12">
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter articles by topic">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tag === t}
            onClick={() => { setTag(t); setPage(1); }}
            className={cn("rounded-xl border px-4 py-2 text-sm font-medium transition", tag === t ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-muted")}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton h-96" />) : data.items.map((p) => <PostCard key={p._id} post={p} />)}
      </div>
      {data && <Pagination className="mt-10" page={data.page} pages={data.pages} total={data.total} limit={data.limit} onChange={setPage} />}
    </Container>
  );
}

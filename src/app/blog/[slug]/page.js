import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { PostCard } from "@/components/home/Sections";
import { Container } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { serverGet } from "@/lib/api";
import { formatDate } from "@/lib/format";

async function getPost(slug) {
  return serverGet(`/posts/${slug}`, 600);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) return { title: "Article not found" };
  return { title: data.item.title, description: data.item.excerpt, openGraph: { images: [data.item.cover] } };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) notFound();
  const { item: post, more } = data;

  return (
    <article>
      <Container className="max-w-3xl py-10">
        <Link href="/blog" className="inline-flex items-center gap-1 rounded-xl text-sm font-medium text-muted-fg hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((t) => <Badge key={t} tone="primary">{t}</Badge>)}
        </div>
        <h1 className="heading-1 mt-4">{post.title}</h1>
        <p className="body-lg mt-4">{post.excerpt}</p>
        <p className="mt-4 text-sm text-muted-fg">
          By {post.author?.name || "Glowra"} · {formatDate(post.publishedAt)} · {post.readMinutes} min read
        </p>
      </Container>
      <Container className="max-w-5xl">
        <div className="relative aspect-[16/8] overflow-hidden rounded-xl border border-border bg-muted">
          <SmartImage src={post.cover} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
        </div>
      </Container>
      <Container className="max-w-3xl py-12">
        <ArticleBody content={post.content} />
        <div className="mt-12 rounded-xl border border-border bg-primary-soft p-6">
          <p className="font-semibold text-primary-soft-fg">Ready to put this into practice?</p>
          <p className="mt-1 text-sm text-primary-soft-fg/90">Browse products filtered by your skin type and concern.</p>
          <Button href="/explore" className="mt-4">Explore products</Button>
        </div>
      </Container>
      {more?.length > 0 && (
        <section className="border-t border-border bg-muted/50 py-16" aria-labelledby="more-title">
          <Container>
            <h2 id="more-title" className="heading-2 mb-8">Keep reading</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {more.map((p) => <PostCard key={p._id} post={p} />)}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}

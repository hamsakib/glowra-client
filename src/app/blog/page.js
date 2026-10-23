import { BlogList } from "@/components/blog/BlogList";
import { PageHeader } from "@/components/layout/Section";

export const metadata = {
  title: "Skincare journal",
  description: "Plain-language guides to Korean skincare: routines, sunscreen, ingredients and how to shop safely.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Journal" title="The Glowra skincare journal" description="Short, practical guides written to help you buy less and use it better." />
      <BlogList />
    </>
  );
}

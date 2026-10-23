import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { serverGet } from "@/lib/api";

async function getProduct(slug) {
  const data = await serverGet(`/products/${slug}`, 120);
  return data?.item || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: { title: product.title, description: product.shortDescription, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: product.brand },
    offers: { "@type": "Offer", priceCurrency: "BDT", price: product.price, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
    ...(product.reviewCount ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProductDetail product={product} />
    </>
  );
}

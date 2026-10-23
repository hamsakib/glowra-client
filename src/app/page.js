import { Hero } from "@/components/home/Hero";
import {
  BlogPreviewSection,
  BrandsSection,
  CategoriesSection,
  ConcernsSection,
  CtaSection,
  FaqSection,
  FeaturedSection,
  HowItWorksSection,
  NewsletterSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsSection />
      <CategoriesSection />
      <FeaturedSection />
      <ConcernsSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <FaqSection />
      <NewsletterSection />
      <CtaSection />
    </>
  );
}

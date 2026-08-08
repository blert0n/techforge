"use client";

import { HeroSection } from "@/components/home/hero-section";
import { useProducts } from "../../hooks/use-products";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustIndicators } from "@/components/home/trust-indicators";

export default function HomePage() {
  const { data, isPending, isError } = useProducts();

  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <TrustIndicators />
    </>
  );
}

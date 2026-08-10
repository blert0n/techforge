"use client";

import { HeroSection } from "@/components/home/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { TrustIndicators } from "@/components/home/trust-indicators";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <TrustIndicators />
    </>
  );
}

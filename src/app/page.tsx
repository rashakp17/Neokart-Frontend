"use client";

import HeroSection from "../components/landingPage/HeroSection";
import CategorySection from "../components/landingPage/CategorySection";
import FlashSaleSection from "../components/landingPage/FlashSaleSection";
import NewArrivalSection from "../components/landingPage/NewArrivalSection";
import ProductSection from "../components/landingPage/ProductSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <CategorySection />
      <HeroSection />
      <FlashSaleSection />
      <NewArrivalSection />
      <ProductSection />
    </main>
  );
}
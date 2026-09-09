"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_CATEGORIES = [
  {
    id: 'skin-care',
    label: 'Skin Care',
    image: '/images/skin-care.jpg',
    alt: 'Skin Care category featuring moisturizing brightening sunscreen',
    count: 24,
  },
  {
    id: 'lip-care',
    label: 'Lip Care',
    image: '/images/lip-care.jpg',
    alt: 'Lip Care category featuring nourished glossy lips',
    count: 18,
  },
  {
    id: 'body-care',
    label: 'Body Care',
    image: '/images/body-care.jpg',
    alt: 'Body Care category featuring luxurious body cream application',
    count: 32,
  },
];

export default function CategorySection() {
  const [categories, setCategories] = useState<typeof DEFAULT_CATEGORIES>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
          : 'http://localhost:5000';
        // Fetch categories and products together so we can count products per category
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${baseUrl}/api/v1/categories`),
          axios.get(`${baseUrl}/api/v1/products`),
        ]);

        const products: { category?: string }[] = prodRes.data?.data || [];
        const countForCategory = (name: string) =>
          products.filter(
            (p) => (p.category || '').trim().toLowerCase() === name.trim().toLowerCase()
          ).length;

        if (catRes.data.success && catRes.data.data) {
          const activeCats = catRes.data.data.filter((c: any) => c.status === 'ACTIVE');

          if (activeCats.length > 0) {
            const formatted = activeCats.map((c: any, index: number) => ({
              id: c.name.toLowerCase().replace(/\s+/g, '-'),
              label: c.name,
              image: c.image || DEFAULT_CATEGORIES[index % 3].image,
              alt: `${c.name} category`,
              count: countForCategory(c.name),
            }));
            setCategories(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track how far the strip is scrolled so the arrows only show when usable
  const updateArrows = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = sliderRef.current;
    if (!el) return;
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [categories.length, updateArrows]);

  const scrollByCards = (direction: -1 | 1) => {
    const el = sliderRef.current;
    if (!el) return;
    // Slide roughly one "page" of cards at a time
    const amount = Math.max(el.clientWidth * 0.8, 160);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] pt-20 md:pt-28 pb-6 md:pb-8 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Prev arrow */}
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll categories left"
          className={`hidden md:flex absolute left-0 top-[3.5rem] lg:top-[4rem] -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/70 border border-sky-400/40 text-white backdrop-blur transition-all duration-300 hover:bg-sky-500 hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next arrow */}
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Scroll categories right"
          className={`hidden md:flex absolute right-0 top-[3.5rem] lg:top-[4rem] -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/70 border border-sky-400/40 text-white backdrop-blur transition-all duration-300 hover:bg-sky-500 hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Horizontally scrollable category strip */}
        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="flex gap-3 sm:gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-2"
        >
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              aria-label={`Browse ${category.label}`}
              className={`group shrink-0 snap-start w-20 sm:w-24 md:w-28 lg:w-32 flex flex-col items-center text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#593dab] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-xl p-1 motion-reduce:transition-none motion-reduce:transform-none ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Circular image container - thin blue/sky border with light background */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[1.5px] border-sky-400 bg-sky-50 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-sky-500 shadow-sm">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  priority={index < 3}
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                  className="object-cover rounded-full p-0.5"
                />
              </div>

              {/* Category Name */}
              <span className="mt-3 font-sans font-bold text-xs sm:text-sm md:text-base text-white/90 group-hover:text-sky-400 transition-colors leading-tight line-clamp-2">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

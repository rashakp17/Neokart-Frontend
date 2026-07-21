"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cldOptimize } from "../../lib/image";

interface NewArrival {
  id: string;
  name: string;
  description: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  features: string[];
}

function NewArrivalSlide({ item, isVisible }: { item: NewArrival; isVisible: boolean }) {
  return (
    <div className="w-full shrink-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* ── Image ── */}
        <div
          className={`relative transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <div className="relative aspect-square w-full max-w-lg mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-white/10">
            <Image
              src={cldOptimize(item.image, 900)}
              alt={item.name}
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              priority
              unoptimized
              className="object-cover"
            />
          </div>
        </div>

        {/* ── Content ── */}
        <div
          className={`flex flex-col transition-all duration-700 delay-150 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          {/* Eyebrow */}
          <p className="font-sans font-bold text-xs md:text-sm tracking-[0.25em] uppercase text-[#a78bda] mb-4">
            New Arrival
          </p>

          {/* Name */}
          <h2 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-5">
            {item.name}
          </h2>

          {/* Description */}
          {item.description && (
            <p className="font-sans text-sm md:text-base text-white/60 leading-relaxed max-w-xl mb-7 line-clamp-4">
              {item.description}
            </p>
          )}

          {/* Feature bullets */}
          {item.features.length > 0 && (
            <ul className="flex flex-col gap-3 mb-9">
              {item.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#593dab]/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#a78bda]" strokeWidth={3} />
                  </span>
                  <span className="font-sans text-sm md:text-base text-white/80 leading-snug">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href={`/products/${item.id}`}
              className="group inline-flex items-center gap-2.5 bg-[#593dab] hover:bg-[#4a3391] text-white font-sans font-bold text-sm uppercase tracking-widest py-4 px-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#593dab] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewArrivalSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState<NewArrival[]>([]);
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
          : "http://localhost:5000";
        const res = await axios.get(`${baseUrl}/api/v1/products`);
        if (res.data.success && res.data.data) {
          // Products come back newest-first; keep every flagged arrival in that order.
          const arrivals: NewArrival[] = res.data.data
            .filter((p: any) => p.showAsNewArrival === true)
            .map((p: any) => ({
              id: p._id,
              name: p.name,
              description: p.description || "",
              image:
                p.images && p.images.length > 0
                  ? p.images[0]
                  : "/products/suncream-1.jpg",
              currentPrice: p.variants?.[0]?.price || 0,
              originalPrice: p.variants?.[0]?.oldPrice || 0,
              currency: "₹",
              features: p.keyFeatures
                ? p.keyFeatures
                    .split(/,|\n/)
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                    .slice(0, 3)
                : [],
            }));
          setItems(arrivals);
        }
      } catch (err) {
        console.error("Failed to fetch new arrivals", err);
      }
    };
    fetchNewArrivals();
  }, []);

  // Runs once products load (the section only mounts then, so the ref exists here).
  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [items.length]);

  // Auto-advance the slider while there is more than one arrival.
  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, 6000);
    return () => clearInterval(id);
  }, [items.length, current]);

  // No product flagged as new arrival — don't render an empty section
  if (items.length === 0) return null;

  const hasMultiple = items.length > 1;
  const goTo = (index: number) =>
    setCurrent((index + items.length) % items.length);

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-12 md:py-20 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="relative">
          {/* Sliding track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {items.map((item) => (
                <NewArrivalSlide key={item.id} item={item} isVisible={isVisible} />
              ))}
            </div>
          </div>

          {/* Slider controls — only when there is more than one arrival */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                aria-label="Previous new arrival"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a1a1a]/80 hover:bg-[#593dab] border border-white/10 backdrop-blur flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#593dab] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                type="button"
                onClick={() => goTo(current + 1)}
                aria-label="Next new arrival"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a1a1a]/80 hover:bg-[#593dab] border border-white/10 backdrop-blur flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#593dab] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-2.5 mt-8">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to new arrival ${i + 1}`}
                    aria-current={i === current}
                    className={`h-2 rounded-full transition-all ${
                      i === current
                        ? "w-7 bg-[#593dab]"
                        : "w-2 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

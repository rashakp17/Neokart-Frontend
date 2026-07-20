"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ShoppingBag, Zap } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { cldOptimize } from "../../lib/image";

interface FlashProduct {
  id: string;
  name: string;
  images: string[];
  currentPrice: number;
  originalPrice: number;
  currency: string;
  discount: number;
  category: string;
}

function FlashSaleCard({ product, isVisible, index }: { product: FlashProduct; isVisible: boolean; index: number }) {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const savedUser = localStorage.getItem("heedy_user");
    if (!savedUser) {
      router.push("/sign-in");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.currentPrice,
      currency: product.currency,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <article
      className={`relative shrink-0 w-44 sm:w-52 md:w-60 snap-start bg-[#121212] rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 group flex flex-col motion-reduce:transition-none motion-reduce:transform-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/products/${product.id}?from=flash-sale`}
        className="flex flex-col flex-grow outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-2xl"
      >
        {/* Image Area */}
        <div className="relative overflow-hidden aspect-square bg-[#1a1a1a] flex-shrink-0">
          <Image
            src={cldOptimize(product.images[0], 500)}
            alt={product.name}
            fill
            loading={index > 3 ? "lazy" : "eager"}
            sizes="(max-width: 640px) 45vw, 240px"
            unoptimized
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />

          {/* FLASH SALE tag */}
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-red-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-md">
            <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
            Flash Sale
          </span>

          {/* Discount badge */}
          {product.discount > 0 && (
            <span className="absolute bottom-2.5 left-2.5 bg-amber-400 text-black text-xs md:text-sm font-black px-2.5 py-1 rounded-full shadow-md">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Content Area */}
        <div className="p-3 flex flex-col flex-grow">
          {product.category && (
            <p className="font-sans font-semibold text-[9px] md:text-[10px] uppercase tracking-wider text-[#a78bda] mb-1">
              {product.category}
            </p>
          )}
          <h3 className="font-sans font-bold text-xs md:text-sm text-white leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* Price + Cart Row */}
      <div className="px-3 pb-3 pt-1 mt-auto flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="font-sans font-black text-sm md:text-lg text-white truncate">
            {product.currency}{product.currentPrice}
          </span>
          {product.originalPrice > product.currentPrice && (
            <span className="font-sans text-[10px] md:text-[11px] text-white/40 line-through">
              {product.currency}{product.originalPrice}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className={`shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#121212] ${
            isAdded ? "bg-green-600 hover:bg-green-700" : "bg-[#593dab] hover:bg-[#4a3391]"
          }`}
        >
          <ShoppingBag className="w-4 h-4 md:w-[18px] md:h-[18px]" />
        </button>
      </div>
    </article>
  );
}

export default function FlashSaleSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<FlashProduct[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
          : "http://localhost:5000";
        const res = await axios.get(`${baseUrl}/api/v1/products`);
        if (res.data.success && res.data.data) {
          const deals: FlashProduct[] = res.data.data
            .filter((p: any) => p.showInFlashSale === true)
            .map((p: any) => {
              const price = p.variants?.[0]?.price || 0;
              const oldPrice = p.variants?.[0]?.oldPrice || 0;
              const discount =
                oldPrice > price && oldPrice > 0
                  ? Math.round(((oldPrice - price) / oldPrice) * 100)
                  : 0;
              return {
                id: p._id,
                name: p.name,
                images: p.images && p.images.length > 0 ? p.images : ["/products/suncream-1.jpg"],
                currentPrice: price,
                originalPrice: oldPrice,
                currency: "₹",
                discount,
                category: p.category || "",
              };
            })
            .sort((a: FlashProduct, b: FlashProduct) => b.discount - a.discount);
          setProducts(deals);
        }
      } catch (err) {
        console.error("Failed to fetch flash sale products", err);
      }
    };
    fetchDeals();
  }, []);

  // Runs once products load (the section only mounts then, so the ref exists here).
  useEffect(() => {
    if (products.length === 0) return;
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
  }, [products.length]);

  // Nothing on sale — don't render an empty section
  if (products.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] pt-8 md:pt-14 pb-4 md:pb-8 w-full">
      {/* Section Header */}
      <div className="text-center px-6">
        <div
          className={`inline-flex items-center gap-2 transition-all duration-600 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Zap className="w-5 h-5 md:w-7 md:h-7 text-amber-400 fill-amber-400" />
          <h2 className="font-sans font-black text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] uppercase text-white">
            Top Offers You Can&apos;t Miss
          </h2>
          <Zap className="w-5 h-5 md:w-7 md:h-7 text-amber-400 fill-amber-400" />
        </div>
        <p className="font-sans text-xs md:text-sm text-white/50 mt-2 tracking-wide">
          Limited-time flash deals — grab them before they&apos;re gone.
        </p>
        <div
          className={`w-20 h-1 bg-amber-400 mx-auto mt-4 mb-6 md:mb-8 transition-transform duration-500 delay-200 origin-center motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>

      {/* Horizontally scrollable flash sale strip */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
          {products.map((product, index) => (
            <FlashSaleCard key={product.id} product={product} isVisible={isVisible} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

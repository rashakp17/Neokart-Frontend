"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingBag, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleToggleSearch = () => {
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-24 lg:h-28 px-6 lg:px-12 flex items-center justify-between border-b ${
        scrolled ? "bg-white shadow-sm border-slate-200" : "bg-white border-transparent"
      }`}
    >
      {/* ── Mobile Menu Toggle (Left on Mobile) ── */}
      <div className="flex md:hidden flex-1 justify-start relative z-10">
        <button
          onClick={toggleMobileMenu}
          className="p-2 -ml-2 text-slate-900 hover:text-blue-500 transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
        </button>
      </div>

      {/* ── Logo (Center on Mobile, Left on Desktop) ── */}
      <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center">
        <Link href="/" className="flex-shrink-0" aria-label="HEEDY home">
          <div className="relative w-64 sm:w-80 md:w-96 lg:w-[30rem] h-24 sm:h-24 md:h-24 lg:h-28">
            <Image
              src="/logo.png"
              alt="HEEDY Logo"
              fill
              sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 480px"
              className="object-contain md:object-left object-center"
              priority
            />
          </div>
        </Link>
      </div>

      {/* ── Center: Nav links (Hidden on mobile) ── */}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 lg:gap-12">
        <Link
          href="/products"
          className="font-sans font-bold text-sm tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors duration-200"
        >
          SHOP
        </Link>
        <Link
          href="/contact-us"
          className="font-sans font-bold text-sm tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors duration-200"
        >
          CONTACT
        </Link>
      </nav>

      {/* ── Right: Search & Utilities ── */}
      <div className="flex items-center justify-end gap-2 md:gap-4 flex-1 md:flex-none relative z-10">
        
        {/* --- Mobile Always Visible Icons --- */}
        <div className="flex md:hidden items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={handleToggleSearch}
            className="p-2 text-slate-900 hover:text-blue-500 transition-colors duration-200"
            aria-label="Toggle search"
          >
            <Search size={22} strokeWidth={2} />
          </button>

          <Link
            href="/cart"
            className="relative p-2 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
            aria-label="Cart"
          >
            <ShoppingBag size={22} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Icon */}
          <Link
            href="/sign-in"
            className="p-2 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
            aria-label="Account"
          >
            <User size={22} strokeWidth={2} />
          </Link>
        </div>

        {/* --- Desktop Interactive Area --- */}
        <div className="hidden md:flex items-center relative min-h-[40px]">
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              /* --- Desktop Default State Icons --- */
              <motion.div
                key="default-utilities"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-4"
              >
                {/* Search Trigger */}
                <button
                  onClick={handleToggleSearch}
                  className="flex items-center text-slate-900 hover:text-blue-500 transition-colors duration-200 group"
                  aria-label="Open search"
                >
                  <Search size={20} strokeWidth={2} className="w-5 h-5" />
                  <span className="hidden lg:inline-block ml-2 font-sans font-bold text-sm tracking-[0.15em] uppercase">
                    SEARCH
                  </span>
                </button>

                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="relative w-10 h-10 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
                  aria-label="Cart"
                >
                  <ShoppingBag size={20} strokeWidth={2} className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Account Icon */}
                <Link
                  href="/sign-in"
                  className="w-10 h-10 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
                  aria-label="Account"
                >
                  <User size={20} strokeWidth={2} className="w-5 h-5" />
                </Link>
              </motion.div>
            ) : (
              /* --- Desktop Search Active State --- */
              <motion.div
                key="active-search"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-4"
              >
                {/* Search Input Container */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "16rem" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative lg:w-80"
                >
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-white border-2 border-blue-500 rounded-full px-5 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  />
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setIsSearchOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all duration-200 hover:rotate-90"
                  aria-label="Close search"
                >
                  <X size={20} strokeWidth={2.5} />
                </motion.button>

                {/* Submit Search Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="font-sans font-bold text-sm tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors duration-200"
                  aria-label="Submit search"
                >
                  SEARCH
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile Search Overlay ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-0 right-0 bg-white border-b border-slate-200 px-6 py-4 md:hidden shadow-lg z-40"
          >
            <div className="flex items-center gap-3">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-slate-50 border-2 border-blue-500 rounded-full px-5 py-2.5 text-slate-900 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-500 p-2"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-24 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-30 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-2">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans font-bold text-base tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors py-3 border-b border-slate-100"
              >
                SHOP
              </Link>
              <Link
                href="/contact-us"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans font-bold text-base tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors py-3"
              >
                CONTACT
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

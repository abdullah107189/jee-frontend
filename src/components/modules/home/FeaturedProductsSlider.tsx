"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shared/productCard/ProductCard";
import type { ProductCardData } from "@/lib/types/product.types";

interface Props {
  products: ProductCardData[];
  title?: string;
  subtitle?: string;
}

export default function FeaturedProductsSlider({
  products,
  title = "Featured Products",
  subtitle = "Best-selling electronics with long-term digital warranties",
}: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollability();
    const el = sliderRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [checkScrollability, products]);

  const handleScroll = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    // Scroll by ~75% of visible container width for smooth sliding
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Header: Title on Left, Carousel Arrow Buttons on Right */}
      <div className="mb-3.5 sm:mb-5 lg:mb-6 flex items-end justify-between gap-3">
        {/* Left Title & Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="rounded-xl bg-red-500/10 p-1.5 sm:p-2 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0">
            <Flame className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-tight text-foreground sm:text-2xl lg:text-3xl truncate">
              {title}
            </h2>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground sm:mt-1 sm:text-sm truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Navigation Arrows (Apple Gadgets style) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-2xs hover:bg-muted active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-2xs hover:bg-muted active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track: 5 Desktop, 4 Md, 3 Tablet, 2 Mobile */}
      <div
        ref={sliderRef}
        className="flex gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scroll-smooth no-scrollbar scroll-snap-x-mandatory pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="shrink-0 snap-start w-[calc((100%-0.625rem)/2)] sm:w-[calc((100%-2*1rem)/3)] md:w-[calc((100%-3*1.25rem)/4)] lg:w-[calc((100%-4*1.5rem)/5)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}


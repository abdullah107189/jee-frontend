"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import HorizontalProductCard from "@/components/shared/productCard/HorizontalProductCard";
import { Button } from "@/components/ui/Button";
import { ProductCardData } from "@/lib/types/product.types";

export default function LatestProductsClient({
  products,
}: {
  products: ProductCardData[];
}) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-3.5 sm:mb-5 lg:mb-6 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider">
                New Additions
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              Latest Arrivals
            </h2>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground sm:mt-1 sm:text-sm">
              Newly listed electronics with official warranties
            </p>
          </div>

          <Link href="/products" className="shrink-0">
            <Button
              variant="ghost"
              className="h-8 gap-1 px-2.5 text-xs font-bold text-primary sm:h-9 sm:px-3 sm:text-sm"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>

        {/* Grid (1 col mobile, 2 cols tablet, 3 cols desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {products?.map((product) => (
            <HorizontalProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

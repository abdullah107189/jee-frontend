"use client";

import { Flame } from "lucide-react";
import ProductCard from "@/components/shared/productCard/ProductCard";
import { useGetProductsQuery } from "@/lib/redux/features/product/productApi";

export default function FeaturedProducts() {
  const { data: featuredResponse, isLoading } = useGetProductsQuery({
    limit: 8,
    isPublished: true,
    isActive: true,
  });

  const featuredProducts = featuredResponse?.data ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-50 p-2 text-red-600">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Best-selling electronics with long-term warranties
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-slate-200" />
            ))
          : featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}

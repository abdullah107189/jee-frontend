"use client";

import ProductCard from "@/components/shared/productCard/ProductCard";
import { useGetProductsQuery } from "@/lib/redux/features/product/productApi";
import Link from "next/link";
 

export default function FeaturedProducts() {
  const {
    data: productsResponse,
    isLoading,
  } = useGetProductsQuery({
    limit: 6,
    isPublished: true,
    isActive: true,
  });

  const products = productsResponse?.data ?? [];

  return (
    <section
      aria-labelledby="products-heading"
      className="bg-zinc-50 py-14"
    >
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Our Products
            </p>

            <h2
              id="products-heading"
              className="mt-1 text-2xl font-bold tracking-tight text-zinc-950"
            >
              Latest Products
            </h2>
          </div>

          <Link
            href="/products"
            className="text-sm font-semibold text-zinc-600 hover:text-blue-600"
          >
            View all
          </Link>
        </header>

        {isLoading ? (
          <ProductSkeleton />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
            <h3 className="font-semibold text-zinc-900">
              No products available
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Please check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
        >
          <div className="aspect-square animate-pulse bg-zinc-100" />

          <div className="space-y-3 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
            <div className="h-6 w-24 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

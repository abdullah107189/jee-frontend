"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { useGetProductsQuery } from "@/lib/redux/features/product/productApi";
import { addToCart } from "@/lib/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import type { ProductItem } from "@/Types/product";

import HorizontalProductCard from "@/components/shared/productCard/HorizontalProductCard";

export default function LatestProducts() {
  const dispatch = useAppDispatch();
  

  const { data: latestResponse, isLoading } = useGetProductsQuery({
    limit: 3,
    isPublished: true,
    isActive: true,
  });

  const latestProducts = latestResponse?.data ?? [];

  const handleAddToCart = (item: ProductItem) => {
    const p = item.product;

    dispatch(
      addToCart({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: p.images?.[0],
        warrantyMonths: p.warrantyMonths,
      }),
    );

    toast.success(`${p.name} added to cart!`);
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex items-end justify-between sm:mb-7">
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              Latest Arrivals
            </h2>

            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:mt-1 sm:text-sm">
              Newly listed appliances with standard warranties
            </p>
          </div>

          <Link href="/products">
            <Button
              variant="ghost"
              className="h-8 gap-1 px-2 text-xs font-bold text-primary sm:h-9 sm:px-3 sm:text-sm"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-32
                    animate-pulse
                    rounded-2xl
                    bg-muted

                    sm:h-40
                  "
                />
              ))
            : latestProducts.map((item) => (
                <HorizontalProductCard
                  key={item.id}
                  product={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

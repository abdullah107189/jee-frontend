"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import HorizontalProductCard from "@/components/shared/productCard/HorizontalProductCard";
import { Button } from "@/components/ui/Button";
import { ProductCardData } from "@/lib/types/product.types";
import { CartItemInput } from "@/lib/types/cart.types";
import { toCartItem } from "@/lib/helpers/productListing.helpers";

export default function LatestProductsClient({
  products,
}: {
  products: ProductCardData[];
}) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: ProductCardData) => {
    dispatch(addToCart(toCartItem(product)));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {products?.map((product) => (
            <HorizontalProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

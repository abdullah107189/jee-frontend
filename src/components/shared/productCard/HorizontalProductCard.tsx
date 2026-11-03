"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ShieldCheck } from "lucide-react";
import { ProductCardData } from "@/lib/types/product.types";
import { useAddToCart } from "@/hooks/useAddToCart";

interface HorizontalProductCardProps {
  product: ProductCardData;
}

export default function HorizontalProductCard({
  product,
}: HorizontalProductCardProps) {
  const data = product;

  const image = data.image || "/product-placeholder.png";

  const hasDiscount =
    data.comparePrice != null && data.comparePrice > data.price;

  const discountAmount = hasDiscount ? data.comparePrice! - data.price : 0;

  const isOutOfStock = data.stockQuantity <= 0;
  const addToCart = useAddToCart();

  return (
    <article
      className="
        group
        flex
        w-full
        overflow-hidden
        rounded-xl
        sm:rounded-2xl
        border
        border-border
        bg-card
        shadow-2xs
        transition-all
        duration-300
        active:scale-[0.99]
        sm:hover:-translate-y-0.5
        sm:hover:shadow-md
      "
    >
      {/* Product Image */}
      <Link
        href={`/products/${data.slug}`}
        aria-label={`View ${data.name}`}
        className="
          relative
          block
          h-28
          w-28
          xs:h-32
          xs:w-32
          sm:h-40
          sm:w-40
          lg:h-44
          lg:w-44
          shrink-0
          overflow-hidden
          bg-muted/40
        "
      >
        <Image
          src={image}
          alt={data.name}
          fill
          sizes="
            (max-width: 639px) 120px,
            (max-width: 1023px) 160px,
            176px
          "
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <>
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
            <span
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                whitespace-nowrap
                rounded-full
                bg-foreground
                px-2
                py-0.5
                text-[9px]
                font-bold
                text-background
                sm:px-3
                sm:py-1.5
                sm:text-[10px]
              "
            >
              Out of stock
            </span>
          </>
        )}
      </Link>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5 sm:p-3.5 lg:p-4">
        <div className="min-w-0 space-y-1">
          {/* Warranty */}
          {data.warrantyMonths > 0 && (
            <div className="flex items-center gap-1 typo-caption font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {data.warrantyMonths >= 12
                  ? `${Math.floor(data.warrantyMonths / 12)} Year Warranty`
                  : `${data.warrantyMonths} Mo. Warranty`}
              </span>
            </div>
          )}

          {/* Product Name */}
          <Link href={`/products/${data.slug}`}>
            <h3 className="line-clamp-2 typo-h4 font-bold text-foreground transition-colors group-hover:text-primary">
              {data.name}
            </h3>
          </Link>
        </div>

        {/* Pricing and Action */}
        <div className="mt-2.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="typo-price text-foreground">
                ৳{data.price.toLocaleString()}
              </span>

              {hasDiscount && (
                <del className="typo-caption text-muted-foreground">
                  ৳{data.comparePrice!.toLocaleString()}
                </del>
              )}
            </div>

            {/* Discount Amount */}
            {hasDiscount && (
              <p className="typo-caption font-bold text-destructive">
                Save ৳{discountAmount.toLocaleString()}
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          {!isOutOfStock && (
            <button
              type="button"
              onClick={() => addToCart(product)}
              aria-label={`Add ${data.name} to cart`}
              className="
                flex
                h-7.5
                xs:h-8
                sm:h-9
                shrink-0
                items-center
                justify-center
                gap-1.5
                rounded-lg
                bg-primary
                px-2
                xs:px-2.5
                sm:px-3
                text-[10px]
                sm:text-xs
                font-bold
                text-primary-foreground
                transition-all
                hover:bg-primary/90
                active:scale-95
                shadow-2xs
                cursor-pointer
              "
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

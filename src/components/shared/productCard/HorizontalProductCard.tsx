"use client";

import type { ProductItem } from "@/lib/types/product.types";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ShieldCheck } from "lucide-react";

interface HorizontalProductCardProps {
  product: ProductItem;
  onAddToCart?: (product: ProductItem) => void;
}

export default function HorizontalProductCard({
  product,
  onAddToCart,
}: HorizontalProductCardProps) {
  const data = product.product;

  const image = data.images?.[0] ?? "/images/product-placeholder.png";

  const hasDiscount =
    data.comparePrice != null && data.comparePrice > data.price;

  const discountAmount = hasDiscount ? data.comparePrice! - data.price : 0;

  const isOutOfStock = data.stockQuantity <= 0;

  return (
    <article
      className="
        group
        flex
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        shadow-sm
        transition-all
        duration-300
        active:scale-[0.99]

        sm:hover:-translate-y-0.5
        sm:hover:shadow-lg
      "
    >
      {/* Product Image */}
      <Link
        href={`/products/${data.slug}`}
        aria-label={`View ${data.name}`}
        className="
          relative
          block
          h-32
          w-32
          shrink-0
          overflow-hidden
          bg-muted

          sm:h-40
          sm:w-40
          lg:h-44
          lg:w-44
        "
      >
        <Image
          src={image}
          alt={data.name}
          fill
          sizes="
            (max-width: 639px) 128px,
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

        {/* Discount */}
        {/* {hasDiscount && !isOutOfStock && (
          <span
            className="
              absolute
              left-2
              top-2
              rounded-full
              bg-destructive
              px-2
              py-1
              text-[9px]
              font-bold
              text-destructive-foreground
              shadow-sm

              sm:left-3
              sm:top-3
              sm:text-[10px]
            "
          >
            -{Math.round((discountAmount / data.comparePrice!) * 100)}%
          </span>
        )} */}

        {/* Out of Stock */}
        {isOutOfStock && (
          <>
            <div className="absolute inset-0 bg-background/60" />

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
                px-2.5
                py-1
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
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
        <div className="min-w-0">
          {/* Warranty */}
          {data.warrantyMonths > 0 && (
            <div className="mb-1.5 flex items-center gap-1 text-[10px] font-medium text-muted-foreground sm:text-xs">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />

              <span>
                {data.warrantyMonths >= 12
                  ? `${Math.floor(data.warrantyMonths / 12)} Year Warranty`
                  : `${data.warrantyMonths} Month Warranty`}
              </span>
            </div>
          )}

          {/* Product Name */}
          <Link href={`/products/${data.slug}`}>
            <h3
              className="
                line-clamp-2
                text-sm
                font-bold
                leading-5
                text-foreground
                transition-colors
                hover:text-primary

                sm:text-base
              "
            >
              {data.name}
            </h3>
          </Link>
        </div>

        {/* Bottom */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <span className="text-base font-black text-foreground sm:text-lg">
                ৳{data.price.toLocaleString()}
              </span>

              {hasDiscount && (
                <del className="text-[10px] text-muted-foreground sm:text-xs">
                  ৳{data.comparePrice!.toLocaleString()}
                </del>
              )}
            </div>

            {/* Discount Amount */}
            {hasDiscount && (
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                Save ৳{discountAmount.toLocaleString()}
              </p>
            )}
          </div>

          {/* Add Button */}
          {onAddToCart && !isOutOfStock && (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              aria-label={`Add ${data.name} to cart`}
              className="
                flex
                h-8
                shrink-0
                items-center
                justify-center
                gap-1.5
                rounded-lg
                bg-primary
                px-2.5
                text-[10px]
                font-bold
                text-primary-foreground
                transition-all

                hover:opacity-90
                active:scale-95

                sm:h-9
                sm:px-3
                sm:text-xs
                cursor-pointer
              "
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden xs:inline sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { ProductItem } from "@/lib/types/product.types";

interface ProductCardProps {
  product: ProductItem;
  onAddToCart: () => void;
}

function formatPrice(value: number) {
  return `৳${value.toLocaleString()}`;
}

export default function MainProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const data = product.product;

  const image = data.images?.[0] ?? "/images/product-placeholder.png";

  const hasDiscount =
    data.comparePrice != null && data.comparePrice > data.price;

  const discountAmount = hasDiscount ? data.comparePrice! - data.price : 0;

  const discountPercentage = hasDiscount
    ? Math.round((discountAmount / data.comparePrice!) * 100)
    : 0;

  const isInStock = data.stockQuantity > 0;

  return (
    <article
      className="
        group relative overflow-hidden rounded-2xl
        border border-border bg-card
        shadow-sm
        transition-all duration-300

        active:scale-[0.98]

        sm:hover:-translate-y-1
        sm:hover:shadow-lg
      "
    >
      {/* Product Image */}
      <Link
        href={`/products/${data.slug}`}
        aria-label={`View ${data.name}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image}
            alt={data.name}
            fill
            sizes="
              (max-width: 639px) 50vw,
              (max-width: 1279px) 33vw,
              300px
            "
            className="
              object-cover
              transition-transform duration-500
              sm:group-hover:scale-105
            "
          />

          {/* Discount */}
          {/* {hasDiscount && isInStock && (
            <span
              className="
                absolute left-2.5 top-2.5
                rounded-full
                bg-destructive
                px-2 py-1
                text-[9px] font-bold
                text-destructive-foreground
                sm:left-3 sm:top-3 sm:text-[10px]
              "
            >
              -{discountPercentage}%
            </span>
          )} */}

          {/* Out of Stock */}
          {!isInStock && (
            <>
              <div className="absolute inset-0 bg-background/60" />

              <span
                className="
                  absolute left-1/2 top-1/2
                  -translate-x-1/2 -translate-y-1/2
                  whitespace-nowrap
                  rounded-full
                  bg-foreground
                  px-3 py-1.5
                  text-[10px] font-bold
                  text-background
                "
              >
                Out of stock
              </span>
            </>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Product Name */}
        <Link href={`/products/${data.slug}`}>
          <h2
            className="
              line-clamp-2
              min-h-10
              text-sm font-bold leading-5
              text-foreground
              transition-colors
              hover:text-primary
            "
          >
            {data.name}
          </h2>
        </Link>

        {/* Warranty */}
        {data.warrantyMonths > 0 && (
          <p className="mt-1.5 text-[10px] font-medium text-muted-foreground">
            {data.warrantyMonths >= 12
              ? `${Math.floor(data.warrantyMonths / 12)} Year Warranty`
              : `${data.warrantyMonths} Month Warranty`}
          </p>
        )}

        {/* Price */}
        <div className="mt-2.5">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base font-black tracking-tight text-foreground sm:text-lg">
              {formatPrice(data.price)}
            </span>

            {hasDiscount && (
              <del className="text-[10px] text-muted-foreground sm:text-xs">
                {formatPrice(data.comparePrice!)}
              </del>
            )}
          </div>

          {hasDiscount && (
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
              Save {formatPrice(discountAmount)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/products/${data.slug}`}
            className="group/buy block min-w-0"
            aria-label={`Buy ${data.name} now`}
          >
            <Button
              size="sm"
              disabled={!isInStock}
              className="
                relative h-9 w-full overflow-hidden cursor-pointer
                rounded-xl
                text-xs font-bold
              "
            >
              Buy Now
            </Button>
          </Link>

          {/* Add to Cart */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!isInStock}
            onClick={onAddToCart}
            aria-label={`Add ${data.name} to cart`}
            title="Add to cart"
            className="
              h-9 w-9
              rounded-xl
              p-0
            "
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

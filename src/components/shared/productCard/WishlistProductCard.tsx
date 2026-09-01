"use client";

import type { ProductItem } from "@/Types/product";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, X } from "lucide-react";

interface WishlistProductCardProps {
  product: ProductItem;
  onRemove?: (productId: string) => void;
}

export default function WishlistProductCard({
  product,
  onRemove,
}: WishlistProductCardProps) {
  const data = product.product;
  const image = data.images?.[0] ?? "/images/product-placeholder.png";

  const isOutOfStock = data.stockQuantity <= 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${data.slug}`} className="block">
          <Image
            src={image}
            alt={data.name}
            fill
            sizes="(max-width: 639px) 50vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={() => onRemove?.(product.product.id)}
          aria-label={`Remove ${data.name} from wishlist`}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>

        {!isOutOfStock && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <button
              type="button"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to cart
            </button>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <Link href={`/products/${data.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
            {data.name}
          </h3>
        </Link>

        <p className="mt-2 text-base font-bold text-foreground">
          ৳{data.price.toLocaleString()}
        </p>
      </div>
    </article>
  );
}

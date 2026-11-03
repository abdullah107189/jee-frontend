import type { ProductCardData } from "@/lib/types/product.types";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const data = product;

  const image = data.image ?? "/product-placeholder.png";

  const hasDiscount =
    data.comparePrice != null && data.comparePrice > data.price;

  const discountAmount = hasDiscount ? data.comparePrice! - data.price : 0;

  const isOutOfStock = data.stockQuantity <= 0;
  return (
    <article className="group w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card shadow-2xs transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-md flex flex-col justify-between">
      <Link href={`/products/${data.slug}`} className="block">
        {/* Product Image Frame */}
        <div className="relative aspect-square overflow-hidden bg-muted/40">
          <Image
            src={image}
            alt={data.name}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {isOutOfStock && (
            <>
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background shadow-xs">
                Out of stock
              </span>
            </>
          )}

          {hasDiscount && !isOutOfStock && (
            <span className="absolute top-2 left-2 rounded-md bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[10px] font-bold shadow-2xs">
              Save ৳{discountAmount.toLocaleString()}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-2.5 sm:p-3.5 lg:p-4 space-y-1 sm:space-y-1.5">
          <h3 className="line-clamp-2 min-h-8 sm:min-h-10 text-xs sm:text-sm font-bold leading-snug sm:leading-5 text-foreground transition-colors group-hover:text-primary">
            {data.name}
          </h3>

          {/* Pricing */}
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-sm sm:text-base lg:text-lg font-black text-foreground">
              ৳{data?.price?.toLocaleString()}
            </span>
            {hasDiscount && (
              <del className="text-[10px] sm:text-xs text-muted-foreground">
                ৳{data.comparePrice!.toLocaleString()}
              </del>
            )}
          </div>

          {/* Digital Warranty Indicator */}
          <div className="pt-0.5 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {data.warrantyMonths >= 12
                ? `${Math.floor(data.warrantyMonths / 12)} Year Warranty`
                : `${data.warrantyMonths || 24} Mo. Warranty`}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

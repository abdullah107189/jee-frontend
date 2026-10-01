 
import { ProductCardData } from "@/lib/types/product.types";
import Image from "next/image";
import Link from "next/link";

interface DealProductCardProps {
  product: ProductCardData;
}

export default function DealProductCard({ product }: DealProductCardProps) {
  const data = product;
  const image = data.image ?? "/images/product-placeholder.png";

  const hasDiscount =
    data.comparePrice != null && data.comparePrice > data.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((data.comparePrice! - data.price) / data.comparePrice!) * 100,
      )
    : 0;

  return (
    <article className="group w-[190px] shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 sm:w-[230px] sm:hover:-translate-y-1 sm:hover:shadow-lg">
      <Link href={`/products/${data.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image}
            alt={data.name}
            fill
            sizes="230px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-black text-destructive-foreground">
              -{discountPercentage}%
            </span>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-1 text-[10px] font-bold text-foreground backdrop-blur">
            DEAL
          </span>
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-foreground">
            {data.name}
          </h3>

          <div className="mt-2">
            <span className="text-lg font-black text-foreground">
              ৳{data.price.toLocaleString()}
            </span>

            {hasDiscount && (
              <del className="ml-2 text-xs text-muted-foreground">
                ৳{data.comparePrice!.toLocaleString()}
              </del>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

import type { ProductItem } from "@/Types/product";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const data = product.product;

  const image = data.images?.[0] ?? "/images/product-placeholder.png";

  const hasDiscount =
    data.comparePrice != null && data.comparePrice > data.price;

  const discountPercentage = hasDiscount
    ? Math.round(((data.comparePrice! - data.price) / data.comparePrice!) * 100)
    : 0;

  const isOutOfStock = data.stockQuantity <= 0;

  return (
    <article className="group w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-lg">
      <Link href={`/products/${data.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image}
            alt={data.name}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {isOutOfStock && (
            <>
              <div className="absolute inset-0 bg-background/60" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background">
                Out of stock
              </span>
            </>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground">
            {data.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xs font-bold text-foreground sm:text-lg">
              ৳{data.price.toLocaleString()}
            </span>
          </div>
          <div>
            {hasDiscount && (
              <>
                <del className="text-xs text-muted-foreground">
                  ৳{data.comparePrice!.toLocaleString()}
                </del>
                <span className="text-xs mx-2 bg-green-100 text-green-500 py-1 px-2 rounded-xl">
                  ৳ {data.comparePrice! - data.price} Off
                </span>
              </>
            )}
          </div>

          {/* warranty */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>
              {data.warrantyMonths >= 12
                ? `${Math.floor(data.warrantyMonths / 12)} Year Warranty`
                : `${data.warrantyMonths} Month Warranty`}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

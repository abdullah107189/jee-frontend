import type { ProductItem } from "@/lib/types/product.types";
import Image from "next/image";
import Link from "next/link";

interface FeaturedProductCardProps {
  product: ProductItem;
}

export default function FeaturedProductCard({
  product,
}: FeaturedProductCardProps) {
  const data = product.product;
  const image = data.images?.[0] ?? "/images/product-placeholder.png";

  const hasDiscount =
    data.comparePrice != null && data.comparePrice > data.price;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 sm:hover:shadow-xl">
      <Link href={`/products/${data.slug}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          <Image
            src={image}
            alt={data.name}
            fill
            sizes="(max-width: 639px) 100vw, 500px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur">
            Featured
          </span>

          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <h3 className="line-clamp-2 text-lg font-bold sm:text-xl">
              {data.name}
            </h3>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-black sm:text-2xl">
                ৳{data.price.toLocaleString()}
              </span>

              {hasDiscount && (
                <del className="text-sm text-white/70">
                  ৳{data.comparePrice!.toLocaleString()}
                </del>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

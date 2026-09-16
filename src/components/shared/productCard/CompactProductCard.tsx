
import { ProductCardData } from "@/lib/types/product.types";
import Image from "next/image";
import Link from "next/link";

interface CompactProductCardProps {
  product: ProductCardData;
}

export default function CompactProductCard({
  product,
}: CompactProductCardProps) {
  const data = product;
  const image = data.image ?? "/images/product-placeholder.png";

  const hasDiscount =
    data.comparePrice != null && data.comparePrice > data.price;

  return (
    <Link
      href={`/products/${data.slug}`}
      className="group block w-[150px] shrink-0 sm:w-[180px]"
    >
      <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 active:scale-[0.97] sm:hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image}
            alt={data.name}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {hasDiscount && (
            <span className="absolute left-2 top-2 rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground">
              -{Math.round(
                ((data.comparePrice! - data.price) /
                  data.comparePrice!) *
                100,
              )}
              %
            </span>
          )}
        </div>

        <div className="p-2.5">
          <h3 className="line-clamp-2 min-h-8 text-xs font-semibold leading-4 text-foreground">
            {data.name}
          </h3>

          <p className="mt-1.5 text-sm font-bold text-foreground">
            ৳{data.price.toLocaleString()}
          </p>
        </div>
      </article>
    </Link>
  );
}

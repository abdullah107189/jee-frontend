import type { ProductItem } from "@/Types/product";
import Image from "next/image";
import Link from "next/link";

interface MiniProductCardProps {
  product: ProductItem;
}

export default function MiniProductCard({ product }: MiniProductCardProps) {
  const data = product.product;
  const image = data.images?.[0] ?? "/images/product-placeholder.png";

  return (
    <Link
      href={`/products/${data.slug}`}
      className="group flex w-[180px] shrink-0 items-center gap-3 rounded-xl border border-border bg-card p-2 transition-all duration-300 hover:shadow-md"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={image}
          alt={data.name}
          fill
          sizes="64px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0">
        <h3 className="line-clamp-2 text-xs font-semibold leading-4 text-foreground">
          {data.name}
        </h3>

        <p className="mt-1 text-sm font-bold text-foreground">
          ৳{data.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

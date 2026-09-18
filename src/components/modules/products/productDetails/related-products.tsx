import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { RelatedProduct } from "@/lib/types/product.types";

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 mb-5">
      <h2 className="mb-4 text-lg font-bold">Similar Products</h2>

      <div className="flex flex-col divide-y divide-border">
        {products.map((item) => (
          <RelatedProductItem key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductItem({ product }: { product: RelatedProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex items-center gap-3 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-accent/40"
    >
      {/* Image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={product.image ?? "/images/product-placeholder.png"}
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-xs font-medium leading-snug transition-colors group-hover:text-primary sm:text-sm">
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="text-sm font-bold">
            ৳{product.price.toLocaleString()}
          </span>

          <Badge variant="outline" className="text-[10px]">
            In Stock
          </Badge>
        </div>
      </div>
    </Link>
  );
}

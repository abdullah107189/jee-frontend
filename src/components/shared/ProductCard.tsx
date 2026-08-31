import type { ProductItem } from "@/Types/product";
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

  const discountAmount = hasDiscount
    ? data.comparePrice! - data.price
    : 0;

  const discountPercentage = hasDiscount
    ? Math.round((discountAmount / data.comparePrice!) * 100)
    : 0;

  const isOutOfStock = data.stockQuantity <= 0;
  const isLowStock =
    data.stockQuantity > 0 &&
    data.stockQuantity <= data.lowStockThreshold;

  return (
    <article className="group w-65 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50">
        <Link
          href={`/products/${data.slug}`}
          aria-label={`View ${data.name}`}
        >
          <Image
            src={image}
            alt={data.name}
            fill
            sizes="260px"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Discount */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
            -{discountPercentage}%
          </span>
        )}

        {/* Stock Status */}
        {isOutOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* SKU / Brand ID */}
        {data.sku && (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            SKU: {data.sku}
          </p>
        )}

        {/* Product Name */}
        <h2 className="min-h-10 line-clamp-2 text-[15px] font-semibold leading-5 text-zinc-900">
          <Link
            href={`/products/${data.slug}`}
            className="transition-colors hover:text-blue-600"
          >
            {data.name}
          </Link>
        </h2>

        {/* Price */}
        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-bold tracking-tight text-zinc-950">
            ৳{data.price.toLocaleString()}
          </span>

          {hasDiscount && (
            <del className="mb-0.5 text-sm text-zinc-400">
              ৳{data.comparePrice!.toLocaleString()}
            </del>
          )}
        </div>

        {/* Saving */}
        {hasDiscount && (
          <div className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
            Save ৳{discountAmount.toLocaleString()}
          </div>
        )}

        {/* Stock */}
        <div className="mt-3 flex items-center justify-between">
          {isOutOfStock ? (
            <span className="text-xs font-medium text-red-500">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="text-xs font-medium text-orange-500">
              Only {data.stockQuantity} left
            </span>
          ) : (
            <span className="text-xs font-medium text-emerald-600">
              In stock
            </span>
          )}

          {/* Warranty */}
          {data.warrantyMonths > 0 && (
            <span className="text-xs text-zinc-400">
              {data.warrantyMonths >= 12
                ? `${Math.floor(data.warrantyMonths / 12)}yr warranty`
                : `${data.warrantyMonths}mo warranty`}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

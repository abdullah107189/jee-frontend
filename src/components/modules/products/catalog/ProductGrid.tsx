import MainProductCard from "../MainProductCard";
import type { ProductCardData } from "@/lib/types/product.types";

interface ProductGridProps {
  products: ProductCardData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
      {products.map((item) => (
        <MainProductCard
          key={item.id}
          product={item}
        />
      ))}
    </div>
  );
}
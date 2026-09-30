import HorizontalProductCard from "@/components/shared/productCard/HorizontalProductCard";
import type { ProductCardData } from "@/lib/types/product.types";

interface ProductListProps {
  products: ProductCardData[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="flex flex-col gap-3">
      {products.map((item) => (
        <HorizontalProductCard
          key={item.id}
          product={item}
        />
      ))}
    </div>
  );
}
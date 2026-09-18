import { ProductCardData } from "@/lib/types/product.types";
import MainProductCard from "./MainProductCard";

interface ProductGridProps {
  products: ProductCardData[];
  onAddToCart: (product: ProductCardData) => void;
}

export default function ProductGrid({
  products,
  onAddToCart,
}: ProductGridProps) {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:gap-5
        xl:grid-cols-3
      "
    >
      {products.map((product) => (
        <MainProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/shared/productCard/ProductCard";
import MainProductCard from "../../products/MainProductCard";

interface ProductListingProps {
  products: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categorySlug: string;
}

export function ProductListing({
  products,
  page,
  totalPages,
  categorySlug,
}: ProductListingProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <MainProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link href={`/categories/${categorySlug}?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/categories/${categorySlug}?page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}
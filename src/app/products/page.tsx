import ProductsCatalog from "@/components/products/ProductsCatalog";
import type { Metadata } from "next";
 

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Products | Your Store",
  description:
    "Browse our complete collection of electrical products, home appliances, fans, air conditioners, lights and more. Search and filter products by category, brand and price.",
  keywords: [
    "electrical products",
    "home appliances",
    "fans",
    "air conditioner",
    "lights",
    "electronics",
    "products",
  ],
  openGraph: {
    title: "Products | Your Store",
    description:
      "Explore our complete collection of electrical products and home appliances.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const initialPage = Math.max(
    1,
    Number.parseInt(params.page ?? "1", 10) || 1,
  );

  return (
    <ProductsCatalog
      initialSearch={params.search ?? ""}
      initialCategory={params.category ?? "ALL"}
      initialBrand={params.brand ?? "ALL"}
      initialMinPrice={params.minPrice ?? ""}
      initialMaxPrice={params.maxPrice ?? ""}
      initialPage={initialPage}
    />
  );
}
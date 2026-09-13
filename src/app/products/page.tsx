import type { Metadata } from "next"; 
import { getBrands, getCategories, getProducts } from "@/services/product.service";
import ProductListingClient from "@/components/products/catalog/ProductListingClient";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse genuine electronics and home appliances.",
};

export default async function ProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts({ limit: 100, isPublished: true, isActive: true }),
    getCategories(),
    getBrands(),
  ]);

  return <ProductListingClient products={products.data} categories={categories} brands={brands} />;
}
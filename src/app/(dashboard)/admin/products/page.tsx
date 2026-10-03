import type { Metadata } from "next";
import ProductsListContent from "@/components/modules/admin/products/ProductsListContent";
import { adminProductService } from "@/services/admin/product.service";

export const metadata: Metadata = {
  title: "Products | JEE Admin",
  description: "Manage product catalog entries.",
};

export default async function AdminProductsPage() {
  const res = await adminProductService.getAdminProducts({ page: 1, limit: 20 });
  return <ProductsListContent products={res.data} />;
}
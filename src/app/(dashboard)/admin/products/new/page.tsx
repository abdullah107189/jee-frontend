import ProductAddContent from "@/components/modules/admin/products/new/ProductAddContent";
import { adminProductService } from "@/services/admin/product.service";

export default async function Page() {
  const [categories, brands] = await Promise.all([
    adminProductService.getCategoriesFlat(),
    adminProductService.getBrands(),
  ]);

  return <ProductAddContent categories={categories} brands={brands} />;
}
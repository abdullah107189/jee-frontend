import ProductEditContent from "@/components/modules/admin/products/ProductEditContent";
import { adminProductService } from "@/services/admin/product.service";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [product, categories, brands] = await Promise.all([
        adminProductService.getAdminProductById(id),
        adminProductService.getCategoriesFlat(),
        adminProductService.getBrands(),
    ]);

    if (!product) notFound();

    return (
        <ProductEditContent
            product={product}
            categories={categories}
            brands={brands}
        />
    );
}
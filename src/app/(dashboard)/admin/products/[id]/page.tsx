import ProductDetailsContent from "@/components/modules/admin/products/ProductDetailsContent";
import { adminProductService } from "@/services/admin/product.service";
import { notFound } from "next/navigation";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await adminProductService.getAdminProductById(id);

    if (!product) notFound();

    return <ProductDetailsContent product={product} />;
}
import { notFound } from "next/navigation";
import { adminProductService } from "@/services/admin/product.service";
import VariantDetailsContent from "@/components/modules/admin/products/VariantDetailsContent";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string; variantId: string }>;
}) {
    const { id, variantId } = await params;
    const variant = await adminProductService.getVariantById(variantId);

    if (!variant) notFound();

    return <VariantDetailsContent productId={id} variant={variant} />;
}
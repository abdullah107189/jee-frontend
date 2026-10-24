import { notFound } from "next/navigation";
import { adminProductService } from "@/services/admin/product.service";
import VariantEditContent from "@/components/modules/admin/products/VariantEditContent";

export const metadata = {
    title: "Edit Variant | JEE Admin",
    description: "Edit product variant pricing, attributes, and inventory",
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string; variantId: string }>;
}) {
    const { id, variantId } = await params;
    const variant = await adminProductService.getVariantById(variantId);

    if (!variant) notFound();

    return <VariantEditContent productId={id} variant={variant} />;
}

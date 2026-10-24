import { notFound } from "next/navigation";
import ProductItemsContent from "@/components/modules/admin/products/items/ProductItemsContent";
import { adminProductService } from "@/services/admin/product.service";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string; variantId: string }>;
}) {
    const { id, variantId } = await params;
    const data = await adminProductService.getVariantItems(variantId);

    if (!data) notFound();

    return (
        <ProductItemsContent
            productId={id}
            variantId={variantId}
            variantSku={data.variant.sku}
            initialItems={data.items}
        />
    );
}
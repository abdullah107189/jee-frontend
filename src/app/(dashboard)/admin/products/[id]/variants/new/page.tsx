import { notFound } from "next/navigation";
import { adminProductService } from "@/services/admin/product.service";
import VariantAddContent from "@/components/modules/admin/products/VariantAddContent";

export const metadata = {
    title: "Add Variant | JEE Admin",
    description: "Create a new variant for product",
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await adminProductService.getAdminProductById(id);

    if (!product) notFound();

    return <VariantAddContent product={product} />;
}

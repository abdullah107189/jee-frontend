import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}) {
  const { id, variantId } = await params;
  redirect(`/admin/products/${id}/variants/${variantId}`);
}

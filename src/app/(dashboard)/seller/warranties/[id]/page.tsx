import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SellerWarrantyDetailsContent from "@/components/modules/seller/warranties/details/SellerWarrantyDetailsContent";
import { getSellerWarrantyDetails } from "@/services/seller.service";

export const metadata: Metadata = {
  title: "Warranty Details | JEE",
  description:
    "Digital guarantee record with customer and claim history information.",
};

export default async function SellerWarrantyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const warranty = await getSellerWarrantyDetails(id);

  if (!warranty) {
    notFound();
  }

  return <SellerWarrantyDetailsContent warranty={warranty} />;
}

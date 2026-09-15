import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getSellerWarrantyDetails } from "@/services/seller.service";

export const metadata: Metadata = {
  title: "Warranty Details | JEE",
  description:
    "Digital guarantee record with customer and claim history information.",
};

export default async function SellerWarrantyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const warranty = await getSellerWarrantyDetails(params.id);

  return (
    // <SellerWarrantyDetailsContent warranty={warranty} />
    <>coming soon {warranty}</>
  );
}

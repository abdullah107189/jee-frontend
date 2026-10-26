import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SaleDetailsContent from "@/components/modules/seller/sales/SaleDetailsContent";
import { getSellerTransactionDetails } from "@/services/seller.service";

export const metadata: Metadata = {
  title: "Sale Details | JEE",
  description:
    "View transaction details, customer information and warranty summary.",
};

export default async function SaleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sale = await getSellerTransactionDetails(id);

  if (!sale) {
    notFound();
  }

  return <SaleDetailsContent sale={sale} />;
}

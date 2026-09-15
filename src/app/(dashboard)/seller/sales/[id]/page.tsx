import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getSellerTransactionDetails } from "@/services/seller.service";

export const metadata: Metadata = {
  title: "Sale Details | JEE",
  description:
    "View transaction details, customer information and warranty summary.",
};

export default async function SaleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const sale = await getSellerTransactionDetails(params.id);

  return (
    // <SaleDetailsContent sale={sale} />
    <>Coming soon {sale}</>
  );
}

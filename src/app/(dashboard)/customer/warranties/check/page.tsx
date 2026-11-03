import type { Metadata } from "next";
import { CustomerWarrantyCheckClient } from "@/components/modules/customer/warranties/CustomerWarrantyCheckClient";

export const metadata: Metadata = {
  title: "Verify Warranty | Customer Dashboard | JEE",
  description: "Check product authenticity, warranty status and countdown within your customer dashboard",
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomerWarrantyCheckPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const initialSerial = typeof resolvedParams.serial === "string" ? resolvedParams.serial : "";

  return (
    <div className="container mx-auto py-4 sm:py-6">
      <CustomerWarrantyCheckClient initialSerial={initialSerial} />
    </div>
  );
}


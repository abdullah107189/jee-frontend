// app/(dashboard)/customer/warranties/[id]/page.tsx
// SERVER COMPONENT - SEO Friendly

import { Metadata } from "next";
import { WarrantyDetails } from "@/components/modules/customer/warranties/details/WarrantyDetails";
import { getCustomerWarrantyDetails } from "@/services/customer.service";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch warranty data for SEO (server-side)
  // const warranty = await getWarrantyById(params.id);

  return {
    title: `Warranty Details | JEE`,
    description: `View warranty details, status, and submit claims for your product`,
    keywords: "warranty details, claim warranty, product warranty",
  };
}

// Server Component - SEO data is pre-rendered
export default async function WarrantyDetailsPage({ params }: Props) {
  const warranty = await getCustomerWarrantyDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <WarrantyDetails warranty={warranty} />
    </div>
  );
}

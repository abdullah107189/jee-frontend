// app/(dashboard)/customer/warranties/[id]/page.tsx
// SERVER COMPONENT - SEO Friendly

import { Metadata } from "next";
import { WarrantyDetails } from "./components/WarrantyDetails";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch warranty data for SEO (server-side)
  // const warranty = await getWarrantyById(params.id);

  return {
    title: `Warranty Details | TechStore`,
    description: `View warranty details, status, and submit claims for your product`,
    keywords: "warranty details, claim warranty, product warranty",
  };
}

// Server Component - SEO data is pre-rendered
export default async function WarrantyDetailsPage({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <WarrantyDetails warrantyId={params.id} />
    </div>
  );
}

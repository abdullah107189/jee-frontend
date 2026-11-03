import { Metadata } from "next";
import { WarrantyDetails } from "@/components/modules/customer/warranties/details/WarrantyDetails";
import { getCustomerWarrantyDetails } from "@/services/customer.service";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Warranty #${id} | Customer Dashboard | JEE`,
    description: `View warranty details, coverage status, and submit claims for your product`,
    keywords: "warranty details, claim warranty, product warranty",
  };
}

export default async function WarrantyDetailsPage({ params }: Props) {
  const { id } = await params;
  const warranty = await getCustomerWarrantyDetails(id);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <WarrantyDetails warranty={warranty} />
    </div>
  );
}

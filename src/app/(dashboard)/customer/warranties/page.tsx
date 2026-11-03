import { Metadata } from "next";
import Link from "next/link";
import { WarrantyListClient } from "@/components/modules/customer/warranties/WarrantyListClient";
import { getCustomerWarranties } from "@/services/customer.service";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "My Warranties | Customer Dashboard | JEE",
  description: "View all your registered product warranties, check coverage duration, and manage service claims",
  keywords: "warranty, product warranty, claim warranty, JEE",
};

export default async function WarrantiesPage() {
  const warranties = await getCustomerWarranties();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header-title">
            My Warranties
          </h1>
          <p className="page-header-desc">
            Track active protection terms, expiration dates, and submit service claims for your devices.
          </p>
        </div>

        <Link href="/customer/warranties/check">
          <Button className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 shadow-xs">
            <QrCode className="h-4 w-4" />
            Verify Serial / Scan QR
          </Button>
        </Link>
      </div>

      {/* Client component for search and list */}
      <WarrantyListClient warranties={warranties} />
    </div>
  );
}

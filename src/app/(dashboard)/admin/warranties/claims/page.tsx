import type { Metadata } from "next";
import WarrantyClaimsContent from "@/components/modules/admin/warranties/claims/WarrantyClaimsContent";
import { getAdminWarrantyClaims } from "@/services/warranty.service";

export const metadata: Metadata = {
  title: "Claims & Servicing | JEE Admin",
  description: "Review customer warranty claims, manage servicing/repairs, and update resolution status.",
};

export default async function AdminWarrantyClaimsPage() {
  const claims = await getAdminWarrantyClaims();

  return <WarrantyClaimsContent claims={claims} />;
}

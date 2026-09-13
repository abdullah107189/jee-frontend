import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PendingSellersContent from "@/components/modules/admin/sellers/pending/PendingSellersContent";
import { getPendingSellers } from "@/services/admin.service";

export const metadata: Metadata = {
  title: "Pending Sellers | JEE Admin",
  description: "Review and approve pending seller applications.",
};

export default async function AdminPendingSellersPage() {
  const pendingSellers = await getPendingSellers();

  return <PendingSellersContent pendingSellers={pendingSellers} />;
}

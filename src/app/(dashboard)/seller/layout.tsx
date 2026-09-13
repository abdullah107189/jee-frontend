import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SellerLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout allowedRole="seller">{children}</DashboardLayout>;
}
import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout allowedRole="admin">{children}</DashboardLayout>;
}

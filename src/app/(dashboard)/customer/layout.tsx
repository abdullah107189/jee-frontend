import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Customer Dashboard | JEE",
  description: "Manage your orders, warranties and account",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //  No need to call requireRole — DashboardLayout handles it
  return <DashboardLayout allowedRole="CUSTOMER">{children}</DashboardLayout>;
}
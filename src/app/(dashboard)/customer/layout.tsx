// app/(dashboard)/customer/layout.tsx
// Server Component - wraps all customer pages with auth-protected dashboard shell

import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Customer Dashboard | JEE",
  description: "Manage your orders, warranties and account",
};

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout allowedRole="customer">{children}</DashboardLayout>;
}

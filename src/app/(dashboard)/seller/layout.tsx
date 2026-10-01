import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Seller Dashboard | JEE",
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout allowedRole="SELLER">{children}</DashboardLayout>;
}
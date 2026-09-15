import type { Metadata } from "next";
import AnalyticsContent from "@/components/modules/admin/analytics/AnalyticsContent";
import { getAnalytics } from "@/services/admin.service";

export const metadata: Metadata = {
  title: "Analytics | JEE Admin",
  description: "Charts and insights about store performance.",
};

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();

  // ✅ No DashboardLayout — parent admin/layout.tsx already wraps
  return <AnalyticsContent analytics={analytics} />;
}
import type { Metadata } from "next";
import AnalyticsContent from "@/components/modules/admin/analytics/AnalyticsContent";
import { getAnalytics } from "@/services/admin.service";

export const metadata: Metadata = {
  title: "Analytics | JEE Admin",
  description: "Charts and insights about store performance.",
};

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "MONTH" } = await searchParams;
  const analytics = await getAnalytics(period);

  return <AnalyticsContent analytics={analytics} initialPeriod={period} />;
}

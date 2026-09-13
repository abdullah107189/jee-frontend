import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Admin Dashboard | JEE",
  description: "Overview of your store performance.",
};

const quickStats = [
  {
    label: "Total Orders",
    value: "1,234",
    icon: ShoppingBag,
    href: "/admin/orders",
  },
  { label: "Products", value: "456", icon: Package, href: "/admin/products" },
  { label: "Users", value: "789", icon: Users, href: "/admin/users" },
  {
    label: "Revenue",
    value: "৳2.5M",
    icon: TrendingUp,
    href: "/admin/analytics",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here&apos;s your store overview.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

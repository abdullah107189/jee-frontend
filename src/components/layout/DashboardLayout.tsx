import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth, roleDashboard } from "@/lib/auth/session";
import { DashboardLayoutClient } from "./DashboardLayoutClient";
import type { UserRole } from "@/lib/types/auth.types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole: UserRole; // ← uppercase, from lib/types
}

export async function DashboardLayout({
  children,
  allowedRole,
}: DashboardLayoutProps) {
  // ✅ Real auth — no mock
  const user = await auth();

  if (!user) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    if (pathname && pathname.startsWith("/") && !pathname.startsWith("//")) {
      redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    redirect("/login");
  }
  if (user.role !== allowedRole) redirect(roleDashboard(user.role));

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef2f6] dark:bg-background">
      <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
    </div>
  );
}
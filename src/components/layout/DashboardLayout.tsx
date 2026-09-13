import { redirect } from "next/navigation";
import { CurrentUser, getCurrentUser } from "@/services/auth.service";
import { DashboardLayoutClient } from "./DashboardLayoutClient";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole: "admin" | "seller" | "customer";
}

export async function DashboardLayout({
  children,
  allowedRole,
}: DashboardLayoutProps) {
  const user: CurrentUser = {
    id: 1,
    email: "test@example.com",
    name: "John",
    role: "admin",
  };

  // await getCurrentUser(); // Mocked user for demonstration

  // Server-side auth gate
  if (!user) redirect("/login");
  if (user.role !== allowedRole) redirect(`/${user.role}`);

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef2f6]">
      <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
    </div>
  );
}

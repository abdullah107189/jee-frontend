import { redirect } from "next/navigation";
import { auth, roleDashboard } from "@/lib/auth/session";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ✅ Already logged in → role dashboard e redirect
    const user = await auth();
    if (user) redirect(roleDashboard(user.role));

    return <>{children}</>;
}
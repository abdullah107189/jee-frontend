import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthUser, UserRole } from "@/lib/types/auth.types";
import { roleDashboard } from "@/lib/auth/role";

const API_URL = process.env.API_URL!;

export const auth = cache(async (): Promise<AuthUser | null> => {
  try {
    const cookieStore = await cookies();

    // ✅ Cookie theke token ber koro
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return null;

    // ✅ Bearer header diye Express ke call koro
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // ← Bearer diye pathao
        // Cookie o pathate chao — duitai de
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return (json?.data as AuthUser) ?? null;
  } catch {
    return null;
  }
});

export const requireAuth = async (): Promise<AuthUser> => {
  const user = await auth();
  if (!user) redirect("/login");
  return user;
};

export const requireRole = async (...roles: UserRole[]): Promise<AuthUser> => {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    redirect(roleDashboard(user.role));
  }
  return user;
};

export { roleDashboard };

import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthUser, UserRole } from "@/lib/types/auth.types";
import { roleDashboard } from "@/lib/auth/role";

const API_URL = process.env.API_URL!;

/**
 * RSC / Server Action — READ ONLY, never writes cookies.
 * Auto-refresh happens in proxy.ts (browser request layer), which:
 *   1. refreshes the tokens via Express,
 *   2. writes the new cookies onto the real browser response,
 *   3. injects the fresh access token via the `x-access-token` header.
 */
export const auth = cache(async (): Promise<AuthUser | null> => {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();

    // Proxy may have just refreshed → prefer the injected fresh token
    const refreshedToken = headerStore.get("x-access-token");
    const accessToken =
      refreshedToken ?? cookieStore.get("accessToken")?.value;

    if (!accessToken) return null;

    const res = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
import "server-only";
import { cookies } from "next/headers";
import type {
  AdminCategory,
  CategoryNavItem,
} from "@/lib/types/category.types";

const API_URL = process.env.API_URL!;

/* ═══════════════════════════════════════════════════════════
   PUBLIC (frontend use — no auth)
   ═══════════════════════════════════════════════════════════ */

/**
 * Get all categories (for product listing filters).
 * Public endpoint — no auth required.
 */
async function getCategories(): Promise<{
  data: any[];
  success: boolean;
}> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: {
        revalidate: 3600,
        tags: ["categories"],
      },
    });

    if (!res.ok) return { data: [], success: false };

    const json = await res.json();
    return { data: json?.data ?? [], success: true };
  } catch {
    return { data: [], success: false };
  }
}

/**
 * Get nav categories (tree, cached) — for navbar.
 */
export async function getNavCategories(): Promise<CategoryNavItem[]> {
  try {
    const res = await fetch(`${API_URL}/categories/nav`, {
      next: {
        revalidate: 3600,
        tags: ["categories"],
      },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return (json?.data as CategoryNavItem[]) ?? [];
  } catch {
    return [];
  }
}

/* ═══════════════════════════════════════════════════════════
   ADMIN (server-only, cookie forward)
   ═══════════════════════════════════════════════════════════ */

/**
 * Get all categories (flat list) — for admin.
 * Requires auth cookie.
 */
export async function getAllCategories(): Promise<AdminCategory[]> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/categories/flat`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json();
    return (json?.data as AdminCategory[]) ?? [];
  } catch {
    return [];
  }
}

/**
 * Get single category by ID — for admin edit form.
 */
export async function getCategoryById(
  id: string,
): Promise<AdminCategory | null> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/categories/id/${id}`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return (json?.data as AdminCategory) ?? null;
  } catch {
    return null;
  }
}

export async function getCategoryProducts(
  fullSlug: string,
  filters: Record<string, string | undefined> = {},
): Promise<any> {
  try {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) query.set(k, v);
    });

    const qs = query.toString();
    const url = `${API_URL}/categories/${fullSlug}/products${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, {
      next: {
        revalidate: 300,
        tags: [`category-${fullSlug}`, "categories"],
      },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}
/* ═══════════════════════════════════════════════════════════
   LEGACY — Backward compatibility
   ═══════════════════════════════════════════════════════════ */

/**
 * @deprecated Use `getCategories()` or `getAllCategories()` instead.
 * Kept for backward compatibility with products page.
 */
export const categoryServices = {
  getCategories,
};

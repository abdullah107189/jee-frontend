import "server-only";
import { cookies } from "next/headers";
import type {
  FilterGroupAdmin,
  FilterGroupListItem,
} from "@/lib/types/filter.types";

const API_URL = process.env.API_URL!;

/* ─────────── Admin: All filter groups ─────────── */

export async function getAllFilterGroups(): Promise<FilterGroupListItem[]> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/filters`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json();
    return (json?.data as FilterGroupListItem[]) ?? [];
  } catch {
    return [];
  }
}

/* ─────────── Admin: Get by category ─────────── */

export async function getFilterGroupByCategory(
  categoryId: string,
): Promise<FilterGroupAdmin | null> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/filters/by-category/${categoryId}`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return (json?.data as FilterGroupAdmin) ?? null;
  } catch {
    return null;
  }
}
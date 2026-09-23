import "server-only";
import { cookies } from "next/headers";
import type { AdminCategory } from "@/lib/types/category.types";

const API_URL = process.env.API_URL!;

/* ─────────── Get all (admin) ─────────── */

export async function getAllCategories(): Promise<AdminCategory[]> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/categories`, {
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

/* ─────────── Get single ─────────── */

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
import "server-only";
import { cookies } from "next/headers";
import type {
  AdminCategory,
  CategoryNavItem,
} from "@/lib/types/category.types";
import type { ProductCardData } from "@/lib/types/product.types";

const API_URL = process.env.API_URL!;

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

export type CategoryProductsResponse = {
  category: {
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
    description: string | null;
    icon: string | null;
    image: string | null;
    productCount: number;
    parentId: string | null;
  };
  breadcrumb: {
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
  }[];
  siblings: {
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
    icon: string | null;
  }[];
  products: ProductCardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CategoryFilterGroup = {
  name: string;
  slug: string;
  type: string;
  options: { id: string; value: string }[];
};

export type CategoryFiltersResponse = {
  filters: CategoryFilterGroup[];
  lowestPrice: number | null;
  highestPrice: number | null;
};

/* ═══════════════════════════════════════════════════════════
   PUBLIC (no auth)
   ═══════════════════════════════════════════════════════════ */

async function getCategories(): Promise<{ data: any[]; success: boolean }> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600, tags: ["categories"] },
    });
    if (!res.ok) return { data: [], success: false };
    const json = await res.json();
    return { data: json?.data ?? [], success: true };
  } catch {
    return { data: [], success: false };
  }
}

export async function getNavCategories(): Promise<CategoryNavItem[]> {
  try {
    const res = await fetch(`${API_URL}/categories/nav`, {
      next: { revalidate: 3600, tags: ["categories"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data as CategoryNavItem[]) ?? [];
  } catch {
    return [];
  }
}

/* ─────────── Category products ─────────── */
export async function getCategoryProducts(
  fullSlug: string,
  filters: Record<string, string | undefined> = {},
): Promise<CategoryProductsResponse | null> {
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
    return (json?.data as CategoryProductsResponse) ?? null;
  } catch {
    return null;
  }
}

/* ─────────── Category filters ─────────── */
export async function getCategoryFilters(
  fullSlug: string,
): Promise<CategoryFiltersResponse | null> {
  try {
    const res = await fetch(`${API_URL}/categories/${fullSlug}/filters`, {
      next: {
        revalidate: 300,
        tags: [`category-filters-${fullSlug}`, "categories"],
      },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as CategoryFiltersResponse) ?? null;
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   ADMIN
   ═══════════════════════════════════════════════════════════ */

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

export async function getCategoryById(id: string): Promise<AdminCategory | null> {
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

/* ═══════════════════════════════════════════════════════════
   LEGACY
   ═══════════════════════════════════════════════════════════ */

export const categoryServices = {
  getCategories,
};
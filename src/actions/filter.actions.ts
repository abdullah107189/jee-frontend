"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { FilterActionState } from "@/lib/types/filter.types";

const API_URL = process.env.API_URL!;

/* ─────────── Create ─────────── */

export async function createFilterGroupAction(
  _prevState: FilterActionState | null,
  formData: FormData,
): Promise<FilterActionState> {
  const filtersRaw = formData.get("filters");
  if (typeof filtersRaw !== "string") {
    return { success: false, message: "Filters missing" };
  }

  const payload = {
    name: formData.get("name") as string,
    slug: (formData.get("slug") as string) || undefined,
    categoryId: formData.get("categoryId") as string,
    sortOrder: formData.get("sortOrder")
      ? Number(formData.get("sortOrder"))
      : undefined,
    filters: JSON.parse(filtersRaw),
  };

  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/filters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message ?? "Failed to create",
      };
    }
    revalidateTag("categories", "max");
    revalidateTag("filters", "max");

    return {
      success: true,
      message: "Filter group created",
      groupId: json.data.id,
    };
  } catch {
    return { success: false, message: "Network error" };
  }
}

/* ─────────── Update ─────────── */

export async function updateFilterGroupAction(
  id: string,
  _prevState: FilterActionState | null,
  formData: FormData,
): Promise<FilterActionState> {
  const filtersRaw = formData.get("filters");

  const payload: Record<string, unknown> = {};
  const name = formData.get("name");
  const slug = formData.get("slug");
  const sortOrder = formData.get("sortOrder");
  const isActive = formData.get("isActive");

  if (name) payload.name = name;
  if (slug) payload.slug = slug;
  if (sortOrder) payload.sortOrder = Number(sortOrder);
  if (isActive !== null) payload.isActive = isActive === "on";
  if (filtersRaw && typeof filtersRaw === "string") {
    payload.filters = JSON.parse(filtersRaw);
  }

  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/filters/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return { success: false, message: json.message ?? "Failed to update" };
    }

    revalidateTag("categories", "max");
    revalidateTag("filters", "max");

    return {
      success: true,
      message: "Filter group updated",
      groupId: id,
    };
  } catch {
    return { success: false, message: "Network error" };
  }
}

/* ─────────── Delete ─────────── */

export async function deleteFilterGroupAction(
  id: string,
): Promise<FilterActionState> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/filters/${id}`, {
      method: "DELETE",
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return { success: false, message: json.message ?? "Failed to delete" };
    }

    revalidateTag("categories", "max");
    revalidateTag("filters", "max");

    return { success: true, message: "Filter group deleted" };
  } catch {
    return { success: false, message: "Network error" };
  }
}

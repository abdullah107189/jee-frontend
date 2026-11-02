"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireRole } from "@/lib/auth/session";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const refreshedToken = headerStore.get("x-access-token");
  const token = refreshedToken || cookieStore.get("accessToken")?.value;
  return {
    "Content-Type": "application/json",
    ...(token
      ? { Cookie: `accessToken=${token}; ${cookieStore.toString()}` }
      : { Cookie: cookieStore.toString() }),
  };
}

function revalidateBrandCaches() {
  try {
    revalidateTag("brands", "max");
    revalidateTag("products", "max");
    revalidatePath("/admin/brands");
    revalidatePath("/", "layout");
    revalidatePath("/products");
  } catch (error) {
    console.error("[revalidateBrandCaches]", error);
  }
}

export interface BrandInput {
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
}

export async function createBrandAction(input: BrandInput) {
  await requireRole("ADMIN");

  if (!input.name || input.name.trim().length < 2) {
    return { success: false, message: "Brand name must be at least 2 characters." };
  }

  try {
    const authHeaders = await getAuthHeaders();
    const payload = {
      name: input.name.trim(),
      slug: input.slug?.trim() || undefined,
      logo: input.logo?.trim() || undefined,
      description: input.description?.trim() || undefined,
      isActive: input.isActive ?? true,
    };

    const res = await fetch(`${API_URL}/brands`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || "Failed to create brand",
        errors: json.data || json.errors,
      };
    }

    revalidateBrandCaches();
    return {
      success: true,
      message: json.message || "Brand created successfully",
      data: json.data,
    };
  } catch (error) {
    console.error("[createBrandAction]", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function updateBrandAction(id: string, input: Partial<BrandInput>) {
  await requireRole("ADMIN");

  if (!id) {
    return { success: false, message: "Brand ID is required." };
  }

  try {
    const authHeaders = await getAuthHeaders();
    const payload: Record<string, unknown> = {};

    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.slug !== undefined) payload.slug = input.slug.trim() || undefined;
    if (input.logo !== undefined) payload.logo = input.logo.trim() || undefined;
    if (input.description !== undefined)
      payload.description = input.description.trim() || undefined;
    if (input.isActive !== undefined) payload.isActive = input.isActive;

    const res = await fetch(`${API_URL}/brands/${id}`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || "Failed to update brand",
        errors: json.data || json.errors,
      };
    }

    revalidateBrandCaches();
    return {
      success: true,
      message: json.message || "Brand updated successfully",
      data: json.data,
    };
  } catch (error) {
    console.error("[updateBrandAction]", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function deleteBrandAction(id: string) {
  await requireRole("ADMIN");

  if (!id) {
    return { success: false, message: "Brand ID is required." };
  }

  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/brands/${id}`, {
      method: "DELETE",
      headers: authHeaders,
      cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || "Failed to delete brand",
      };
    }

    revalidateBrandCaches();
    return {
      success: true,
      message: json.message || "Brand deleted successfully",
    };
  } catch (error) {
    console.error("[deleteBrandAction]", error);
    return { success: false, message: "Network error. Please try again." };
  }
}


"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import z from "zod";

const variantItemSchema = z.object({
  serialNumber: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[A-Z0-9-]+$/, "Only A-Z, 0-9, hyphen allowed"),
  status: z
    .enum([
      "AVAILABLE",
      "RESERVED",
      "SOLD",
      "DAMAGED",
      "RETURNED",
      "UNDER_REPAIR",
    ])
    .optional(),
  manufacturedAt: z.string().optional(),
});

const bulkVariantSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  items: z.array(variantItemSchema).min(1).max(500),
});

export async function bulkAddVariantItemsAction(input: {
  productId: string;
  variantId: string;
  items: { serialNumber: string; status?: string; manufacturedAt?: string }[];
}) {
  const parsed = bulkVariantSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(
      `${process.env.API_URL}/products/variants/${parsed.data.variantId}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${token}`,
        },
        body: JSON.stringify({ items: parsed.data.items }),
      },
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: json.message ?? "Failed to add items" };
    }

    revalidatePath(
      `/admin/products/${parsed.data.productId}/variants/${parsed.data.variantId}/items`,
    );

    return {
      success: true,
      message: json.message ?? `${parsed.data.items.length} items added`,
    };
  } catch (error) {
    console.error("[bulkAddVariantItemsAction]", error);
    return { success: false, message: "Network error" };
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE PRODUCT                                                             */
/* -------------------------------------------------------------------------- */

export async function deleteProductAction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${process.env.API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Cookie: `accessToken=${token}` },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: json.message ?? "Delete failed" };
    }

    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted" };
  } catch (error) {
    console.error("[deleteProductAction]", error);
    return { success: false, message: "Network error" };
  }
}

/* ─────────── Create product ─────────── */
import type { CreateProductInput } from "@/lib/types/admin.types";

export async function createProductAction(input: CreateProductInput) {
  const store = await cookies();
  const token = store.get("accessToken")?.value;
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${process.env.API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify(input),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: json.message ?? "Create failed",
        errors: json.errors,
      };
    }

    revalidatePath("/admin/products");
    return {
      success: true,
      message: json.message ?? "Product created",
      productId: json.data?.id,
    };
  } catch (error) {
    console.error("[createProductAction]", error);
    return { success: false, message: "Network error" };
  }
}

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
import type {
  CreateProductInput,
  CreateVariantInput,
} from "@/lib/types/admin.types";

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

/* ─────────── Update product ─────────── */

export async function updateProductAction(
  id: string,
  input: Partial<CreateProductInput>,
) {
  const store = await cookies();
  const token = store.get("accessToken")?.value;
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${process.env.API_URL}/products/${id}`, {
      method: "PATCH",
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
        message: json.message ?? "Update failed",
        errors: json.errors,
      };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    return { success: true, message: json.message ?? "Product updated" };
  } catch (error) {
    console.error("[updateProductAction]", error);
    return { success: false, message: "Network error" };
  }
}

/* ─────────── Add Variant ─────────── */

export async function addVariantAction(
  productId: string,
  newVariant: CreateVariantInput,
) {
  const store = await cookies();
  const token = store.get("accessToken")?.value;
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const getRes = await fetch(`${process.env.API_URL}/products/${productId}`, {
      headers: { Cookie: `accessToken=${token}` },
      cache: "no-store",
    });
    if (!getRes.ok) return { success: false, message: "Product not found" };
    const getJson = await getRes.json();
    const product = getJson.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingVariants = (product.variants || []).map((v: any) => ({
      sku: v.sku || undefined,
      attributes: v.attributes || {},
      price: Number(v.price),
      comparePrice: v.comparePrice ? Number(v.comparePrice) : undefined,
      images: Array.isArray(v.images) ? v.images : [],
      stockQuantity: Number(v.stockQuantity) || 0,
      lowStockThreshold: v.lowStockThreshold
        ? Number(v.lowStockThreshold)
        : undefined,
      isActive: v.isActive ?? true,
    }));

    const updatedVariants = [...existingVariants, newVariant];

    const res = await fetch(`${process.env.API_URL}/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify({ variants: updatedVariants }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message ?? "Failed to add variant",
        errors: json.errors,
      };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    return {
      success: true,
      message: json.message ?? "Variant added successfully",
    };
  } catch (error) {
    console.error("[addVariantAction]", error);
    return { success: false, message: "Network error" };
  }
}

/* ─────────── Update Variant ─────────── */

export async function updateVariantAction(
  productId: string,
  variantId: string,
  updatedData: Partial<CreateVariantInput>,
) {
  const store = await cookies();
  const token = store.get("accessToken")?.value;
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const getRes = await fetch(`${process.env.API_URL}/products/${productId}`, {
      headers: { Cookie: `accessToken=${token}` },
      cache: "no-store",
    });
    if (!getRes.ok) return { success: false, message: "Product not found" };
    const getJson = await getRes.json();
    const product = getJson.data;

    let matched = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedVariants = (product.variants || []).map((v: any) => {
      if (v.id === variantId) {
        matched = true;
        return {
          sku: updatedData.sku !== undefined ? updatedData.sku : v.sku,
          attributes:
            updatedData.attributes !== undefined
              ? updatedData.attributes
              : v.attributes || {},
          price:
            updatedData.price !== undefined
              ? Number(updatedData.price)
              : Number(v.price),
          comparePrice:
            updatedData.comparePrice !== undefined
              ? updatedData.comparePrice
                ? Number(updatedData.comparePrice)
                : undefined
              : v.comparePrice
                ? Number(v.comparePrice)
                : undefined,
          images:
            updatedData.images !== undefined ? updatedData.images : v.images || [],
          stockQuantity:
            updatedData.stockQuantity !== undefined
              ? Number(updatedData.stockQuantity)
              : Number(v.stockQuantity) || 0,
          lowStockThreshold:
            updatedData.lowStockThreshold !== undefined
              ? Number(updatedData.lowStockThreshold)
              : v.lowStockThreshold
                ? Number(v.lowStockThreshold)
                : undefined,
          isActive:
            updatedData.isActive !== undefined
              ? updatedData.isActive
              : (v.isActive ?? true),
        };
      }
      return {
        sku: v.sku || undefined,
        attributes: v.attributes || {},
        price: Number(v.price),
        comparePrice: v.comparePrice ? Number(v.comparePrice) : undefined,
        images: Array.isArray(v.images) ? v.images : [],
        stockQuantity: Number(v.stockQuantity) || 0,
        lowStockThreshold: v.lowStockThreshold
          ? Number(v.lowStockThreshold)
          : undefined,
        isActive: v.isActive ?? true,
      };
    });

    if (!matched) {
      return { success: false, message: "Variant not found in product" };
    }

    const res = await fetch(`${process.env.API_URL}/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify({ variants: updatedVariants }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message ?? "Failed to update variant",
        errors: json.errors,
      };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath(`/admin/products/${productId}/variants/${variantId}`);
    return {
      success: true,
      message: json.message ?? "Variant updated successfully",
    };
  } catch (error) {
    console.error("[updateVariantAction]", error);
    return { success: false, message: "Network error" };
  }
}

/* ─────────── Delete Variant ─────────── */

export async function deleteVariantAction(
  productId: string,
  variantId: string,
) {
  const store = await cookies();
  const token = store.get("accessToken")?.value;
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const getRes = await fetch(`${process.env.API_URL}/products/${productId}`, {
      headers: { Cookie: `accessToken=${token}` },
      cache: "no-store",
    });
    if (!getRes.ok) return { success: false, message: "Product not found" };
    const getJson = await getRes.json();
    const product = getJson.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variants = product.variants || [];
    if (variants.length <= 1) {
      return {
        success: false,
        message: "Cannot delete the only variant. A product must have at least 1 variant.",
      };
    }

    const filtered = variants
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((v: any) => v.id !== variantId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((v: any) => ({
        sku: v.sku || undefined,
        attributes: v.attributes || {},
        price: Number(v.price),
        comparePrice: v.comparePrice ? Number(v.comparePrice) : undefined,
        images: Array.isArray(v.images) ? v.images : [],
        stockQuantity: Number(v.stockQuantity) || 0,
        lowStockThreshold: v.lowStockThreshold
          ? Number(v.lowStockThreshold)
          : undefined,
        isActive: v.isActive ?? true,
      }));

    const res = await fetch(`${process.env.API_URL}/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify({ variants: filtered }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message ?? "Failed to delete variant",
      };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    return { success: true, message: "Variant deleted successfully" };
  } catch (error) {
    console.error("[deleteVariantAction]", error);
    return { success: false, message: "Network error" };
  }
}


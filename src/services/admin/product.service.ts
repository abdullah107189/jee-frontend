import { cookies } from "next/headers";
import type {
  AdminProductListResponse,
  AdminProductDetail,
  VariantItemsResponse,
  AdminVariantDetail,
  CreateProductInput,
  CategoryFlat,
  BrandOption,
} from "@/lib/types/admin.types";
import { revalidatePath } from "next/cache";

const SERVER_API =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const ADMIN_PAGE_SIZE = 20;

/* ─────────── Auth header (BFF cookie forward) ─────────── */
async function getAuthHeaders(): Promise<HeadersInit> {
  const store = await cookies();
  const token = store.get("access_token")?.value;
  return token ? { Cookie: `access_token=${token}` } : {};
}

/* ─────────── List ─────────── */
type AdminListOptions = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  isPublished?: boolean;
};

async function getAdminProducts(
  options: AdminListOptions = {},
): Promise<AdminProductListResponse> {
  const page = options.page ?? 1;
  const limit = options.limit ?? ADMIN_PAGE_SIZE;

  const fallback: AdminProductListResponse = {
    success: false,
    meta: {
      page,
      limit,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    data: [],
  };

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (options.search) params.set("search", options.search);
    if (options.categoryId) params.set("categoryId", options.categoryId);
    if (options.brandId) params.set("brandId", options.brandId);
    if (options.isPublished !== undefined)
      params.set("isPublished", String(options.isPublished));

    const res = await fetch(`${SERVER_API}/products?${params}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[adminProductService.getAdminProducts] ${res.status}`);
      return fallback;
    }

    const result = await res.json();
    return {
      success: true,
      message: result.message,
      meta: result.meta ?? fallback.meta,
      data: result.data ?? [],
    };
  } catch (error) {
    console.error("[adminProductService.getAdminProducts]", error);
    return fallback;
  }
}

/* ─────────── Detail ─────────── */
async function getAdminProductById(
  id: string,
): Promise<AdminProductDetail | null> {
  if (!id) return null;

  try {
    const res = await fetch(`${SERVER_API}/products/${id}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const result = await res.json();
    return (result.data as AdminProductDetail) ?? null;
  } catch (error) {
    console.error("[adminProductService.getAdminProductById]", error);
    return null;
  }
}

/* ─────────── Variant items ─────────── */
async function getVariantItems(
  variantId: string,
): Promise<VariantItemsResponse | null> {
  if (!variantId) return null;

  try {
    const res = await fetch(
      `${SERVER_API}/products/variants/${variantId}/items`,
      {
        headers: await getAuthHeaders(),
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const result = await res.json();
    return (result.data as VariantItemsResponse) ?? null;
  } catch (error) {
    console.error("[adminProductService.getVariantItems]", error);
    return null;
  }
}

/* ─────────── Delete ─────────── */
async function deleteProduct(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${SERVER_API}/products/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });
    return res.ok;
  } catch (error) {
    console.error("[adminProductService.deleteProduct]", error);
    return false;
  }
}

 async function getVariantById(
  variantId: string,
): Promise<AdminVariantDetail | null> {
  if (!variantId) return null;
  try {
    const res = await fetch(`${SERVER_API}/products/variants/${variantId}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const result = await res.json();
    return (result.data as AdminVariantDetail) ?? null;
  } catch (error) {
    console.error("[adminProductService.getVariantById]", error);
    return null;
  }
}

/* ─────────── Categories (flat) ─────────── */ 
async function getCategoriesFlat(): Promise<CategoryFlat[]> {
  try {
    const res = await fetch(`${SERVER_API}/categories/flat`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as CategoryFlat[];
  } catch (error) {
    console.error("[adminProductService.getCategoriesFlat]", error);
    return [];
  }
}

/* ─────────── Brands ─────────── */
 async function getBrands(): Promise<BrandOption[]> {
  try {
    const res = await fetch(`${SERVER_API}/brands`, {
      headers: await getAuthHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as BrandOption[];
  } catch (error) {
    console.error("[adminProductService.getBrands]", error);
    return [];
  }
}

/* ─────────── Create ─────────── */
 async function createProduct(input: CreateProductInput): Promise<{
  success: boolean;
  message: string;
  data?: { id: string };
}> {
  try {
    const res = await fetch(`${SERVER_API}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify(input),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: json.message ?? "Create failed" };
    }

    revalidatePath("/admin/products");
    return {
      success: true,
      message: json.message ?? "Product created",
      data: json.data,
    };
  } catch (error) {
    console.error("[adminProductService.createProduct]", error);
    return { success: false, message: "Network error" };
  }
}
/* ─────────── Export ─────────── */
export const adminProductService = {
  getAdminProducts,
  getAdminProductById,
  getVariantItems,
  deleteProduct,
  getVariantById,
  getCategoriesFlat,
  getBrands,
  createProduct,
};

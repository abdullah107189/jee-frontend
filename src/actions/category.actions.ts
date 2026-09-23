"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { CategoryActionState } from "@/lib/types/category.types";

const API_URL = process.env.API_URL!;

/* ─────────────────────────────
   Create
───────────────────────────── */

export async function createCategoryAction(
    _prevState: CategoryActionState | null,
    formData: FormData,
): Promise<CategoryActionState> {
    const payload = {
        name: String(formData.get("name") ?? ""),
        slug: String(formData.get("slug") ?? "") || undefined,
        description:
            String(formData.get("description") ?? "") ||
            undefined,
        parentId:
            String(formData.get("parentId") ?? "") ||
            undefined,
        icon:
            String(formData.get("icon") ?? "") ||
            undefined,
        image:
            String(formData.get("image") ?? "") ||
            undefined,
        sortOrder:
            formData.get("sortOrder") !== null &&
            formData.get("sortOrder") !== ""
                ? Number(formData.get("sortOrder"))
                : undefined,
        isActive:
            formData.get("isActive") === "on",
    };

    try {
        const cookieStore = await cookies();

        const res = await fetch(
            `${API_URL}/categories`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(payload),
                cache: "no-store",
            },
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
            return {
                success: false,
                message:
                    json.message ??
                    "Failed to create category",
            };
        }

        revalidateTag("categories", "max");

        return {
            success: true,
            message: "Category created successfully",
            categoryId: json.data.id,
        };
    } catch {
        return {
            success: false,
            message:
                "Network error. Please try again.",
        };
    }
}

/* ─────────────────────────────
   Update
───────────────────────────── */

export async function updateCategoryAction(
    id: string,
    _prevState: CategoryActionState | null,
    formData: FormData,
): Promise<CategoryActionState> {
    const payload: Record<string, unknown> = {};

    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const parentId = formData.get("parentId");
    const icon = formData.get("icon");
    const image = formData.get("image");
    const sortOrder = formData.get("sortOrder");
    const isActive = formData.get("isActive");

    /* Name */
    if (typeof name === "string" && name.trim()) {
        payload.name = name;
    }

    /* Slug */
    if (typeof slug === "string" && slug.trim()) {
        payload.slug = slug;
    }

    /* Description */
    if (typeof description === "string") {
        payload.description =
            description.trim() || null;
    }

    /* Parent */
    if (parentId !== null) {
        if (typeof parentId === "string") {
            payload.parentId =
                parentId.trim() || null;
        }
    }

    /* Icon */
    if (typeof icon === "string" && icon.trim()) {
        payload.icon = icon;
    }

    /* Image */
    if (typeof image === "string" && image.trim()) {
        payload.image = image;
    }

    /* Sort order */
    if (
        typeof sortOrder === "string" &&
        sortOrder.trim() !== ""
    ) {
        payload.sortOrder = Number(sortOrder);
    }

    /* Active */
    if (isActive !== null) {
        payload.isActive = isActive === "on";
    }

    try {
        const cookieStore = await cookies();

        const res = await fetch(
            `${API_URL}/categories/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(payload),
                cache: "no-store",
            },
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
            return {
                success: false,
                message:
                    json.message ??
                    "Failed to update category",
            };
        }

        revalidateTag("categories", "max");

        return {
            success: true,
            message: "Category updated successfully",
            categoryId: id,
        };
    } catch {
        return {
            success: false,
            message:
                "Network error. Please try again.",
        };
    }
}

/* ─────────────────────────────
   Delete
───────────────────────────── */

export async function deleteCategoryAction(
    id: string,
): Promise<CategoryActionState> {
    try {
        const cookieStore = await cookies();

        const res = await fetch(
            `${API_URL}/categories/${id}`,
            {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            },
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
            return {
                success: false,
                message:
                    json.message ??
                    "Failed to delete category",
            };
        }

        revalidateTag("categories", "max");

        return {
            success: true,
            message: "Category deleted successfully",
        };
    } catch {
        return {
            success: false,
            message:
                "Network error. Please try again.",
        };
    }
}

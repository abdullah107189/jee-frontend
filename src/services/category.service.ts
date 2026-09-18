import type { Category } from "@/lib/fixtures/product/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(`Categories request failed: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success === true || result.status === "success",

      data: result.data ?? [],

      message: result.message,
    };
  } catch (error) {
    console.error("[categoryServices.getCategories]", error);

    return {
      success: false,
      data: [],
      message: "Failed to fetch categories",
    };
  }
};

export const categoryServices = {
  getCategories,
};

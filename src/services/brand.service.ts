import type { Brand } from "@/lib/fixtures/product/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface BrandsResponse {
  success: boolean;
  data: Brand[];
  message?: string;
}

const getBrands = async (): Promise<BrandsResponse> => {
  try {
    const response = await fetch(`${API_URL}/brands`, {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(`Brands request failed: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success === true || result.status === "success",

      data: result.data ?? [],

      message: result.message,
    };
  } catch (error) {
    console.error("[brandServices.getBrands]", error);

    return {
      success: false,
      data: [],
      message: "Failed to fetch brands",
    };
  }
};

export const brandServices = {
  getBrands,
};

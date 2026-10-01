import type { Metadata } from "next";
import type { ParsedProductParams } from "./params";

/* -------------------------------------------------------------------------- */
/* Static fallback                                                            */
/* -------------------------------------------------------------------------- */
const DEFAULT_METADATA: Metadata = {
  title: "All Products | Authentic Electronics",
  description:
    "Browse 100% genuine electronics, fans, AC and home appliances with verified digital warranty.",
  keywords: [
    "electronics bangladesh",
    "authentic appliances",
    "warranty products",
  ],
  openGraph: {
    title: "All Products | JEE",
    description: "Browse genuine electronics with verified digital warranty.",
    type: "website",
  },
  alternates: { canonical: "/products" },
};

/* -------------------------------------------------------------------------- */
/* Builder                                                                    */
/* -------------------------------------------------------------------------- */
export function buildProductMetadata(
  params: ParsedProductParams,
): Metadata {
  if (params.categoryId) {
    return {
      title: `${params.categoryId} | Products`,
      description: `Browse genuine ${params.categoryId} with verified warranty.`,
      alternates: { canonical: `/products?category=${params.categoryId}` },
    };
  }

  if (params.search) {
    return {
      title: `Search: ${params.search}`,
      description: `Products matching "${params.search}" with verified warranty.`,
      robots: { index: false, follow: true },
    };
  }

  return DEFAULT_METADATA;
}
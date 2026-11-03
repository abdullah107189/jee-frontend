import FeaturedProductsSlider from "./FeaturedProductsSlider";
import { productServices } from "@/services/product.service";
import type { ProductCardData } from "@/lib/types/product.types";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export default async function FeaturedProducts() {
  let featuredProducts: ProductCardData[] = [];
  let sectionTitle = "Featured Products";
  let sectionSubtitle = "Best-selling electronics with long-term digital warranties";

  try {
    // 1. Try to fetch public settings to check for designated featured product IDs & titles
    const res = await fetch(`${API_URL}/settings/public`, {
      next: { revalidate: 60 },
    }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      const featuredIds: string[] = json?.data?.featuredProductIds || [];
      if (json?.data?.featuredSectionTitle) {
        sectionTitle = json.data.featuredSectionTitle;
      }
      if (json?.data?.featuredSectionSubtitle) {
        sectionSubtitle = json.data.featuredSectionSubtitle;
      }

      if (featuredIds.length > 0) {
        const designatedRes = await productServices.getProducts({
          ids: featuredIds.slice(0, 8),
          limit: 8,
          isPublished: true,
          isActive: true,
        });

        if (designatedRes.data && designatedRes.data.length > 0) {
          // Sort according to admin's selected order
          const idOrderMap = new Map(featuredIds.map((id, index) => [id, index]));
          featuredProducts = designatedRes.data.sort(
            (a, b) => (idOrderMap.get(a.id) ?? 99) - (idOrderMap.get(b.id) ?? 99)
          );
        }
      }
    }
  } catch (err) {
    console.error("[FeaturedProducts] error fetching designated products:", err);
  }

  // 2. Fallback: If no products selected or fetch returned empty, fetch latest published products (max 8)
  if (featuredProducts.length === 0) {
    const fallbackResponse = await productServices.getProducts({
      limit: 8,
      isPublished: true,
      isActive: true,
    });
    featuredProducts = fallbackResponse.data || [];
  }

  // Strictly enforce max 8 products
  const displayProducts = featuredProducts.slice(0, 8);

  if (displayProducts.length === 0) return null;

  return (
    <FeaturedProductsSlider
      products={displayProducts}
      title={sectionTitle}
      subtitle={sectionSubtitle}
    />
  );
}

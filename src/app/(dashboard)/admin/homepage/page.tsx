import type { Metadata } from "next";
import HomepageManagerContent from "@/components/modules/admin/homepage/HomepageManagerContent";
import { getSystemSettings } from "@/services/admin.service";
import { productServices } from "@/services/product.service";

export const metadata: Metadata = {
  title: "Homepage Manager | JEE Admin",
  description: "Customize hero banners, featured products slider, and trust badges.",
};

export default async function AdminHomepagePage() {
  const [settings, productsRes] = await Promise.all([
    getSystemSettings(),
    productServices.getProducts({ limit: 100, isPublished: true, isActive: true }),
  ]);

  return (
    <HomepageManagerContent
      initialSettings={settings}
      availableProducts={productsRes.data || []}
    />
  );
}


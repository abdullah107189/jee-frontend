import type { Metadata } from "next";
import SettingsContent from "@/components/modules/admin/settings/SettingsContent";
import { getSystemSettings } from "@/services/admin.service";
import { productServices } from "@/services/product.service";

export const metadata: Metadata = {
  title: "Settings | JEE Admin",
  description: "Platform configuration, payment options, and warranty rules.",
};

export default async function AdminSettingsPage() {
  const [settings, productsRes] = await Promise.all([
    getSystemSettings(),
    productServices.getProducts({ limit: 50, isPublished: true, isActive: true }),
  ]);

  return (
    <SettingsContent
      initialSettings={settings}
      availableProducts={productsRes.data || []}
    />
  );
}

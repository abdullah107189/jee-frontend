import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import CategoriesContent from "@/components/modules/admin/categories/CategoriesContent";
import { getAdminCategories } from "@/services/admin.service";

export const metadata: Metadata = {
  title: "Categories | JEE Admin",
  description: "Manage product categories.",
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return <CategoriesContent categories={categories} />;
}

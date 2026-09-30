import type { Metadata } from "next";
import { getAllCategories } from "@/services/category.service";
import { CategoriesList } from "@/components/modules/admin/categories/categories-list";

export const metadata: Metadata = {
  title: "Categories | JEE Admin",
  description: "Manage product categories",
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  console.log("categories", categories);

  return <CategoriesList categories={categories} />;
}
import { getNavCategories } from "@/services/category.service";
import { CategoryNavClient } from "./category-nav-client";

export async function CategoryNav() {
  const categories = await getNavCategories();

  if (categories.length === 0) return null;
  return <CategoryNavClient categories={categories} />;
}
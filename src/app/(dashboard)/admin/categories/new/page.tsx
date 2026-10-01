import type { Metadata } from "next";
import { getAllCategories } from "@/services/category.service";
import { CategoryForm } from "@/components/modules/admin/categories/category-form";

export const metadata: Metadata = {
  title: "Add Category | JEE Admin",
};

export default async function NewCategoryPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">Add Category</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a new product category.
        </p>
      </div>

      <CategoryForm mode="create" parentOptions={categories} />
    </div>
  );
}
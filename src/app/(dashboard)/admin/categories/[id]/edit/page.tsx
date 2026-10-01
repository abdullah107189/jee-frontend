import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryById, getAllCategories } from "@/services/category.service";
import { CategoryForm } from "@/components/modules/admin/categories/category-form";

export const metadata: Metadata = {
  title: "Edit Category | JEE Admin",
};

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const [category, allCategories] = await Promise.all([
    getCategoryById(id),
    getAllCategories(),
  ]);

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">Edit Category</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update category details.
        </p>
      </div>

      <CategoryForm
        mode="edit"
        category={category}
        parentOptions={allCategories.filter((c) => c.id !== id)}
      />
    </div>
  );
}
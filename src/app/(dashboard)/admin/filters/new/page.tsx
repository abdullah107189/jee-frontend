import type { Metadata } from "next";
import { getAllCategories } from "@/services/category.service";
import { FilterGroupForm } from "@/components/modules/admin/filters/filter-group-form";

export const metadata: Metadata = {
  title: "Add Filter Group | JEE Admin",
};

export default async function NewFilterPage() {
  const categories = await getAllCategories();

  // Filter out categories that already have a filter group (optional)
  const availableCategories = categories.filter((c) => c.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Add Filter Group
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Define filters for a category (Brand, Color, Size, etc.)
        </p>
      </div>

      <FilterGroupForm mode="create" categories={availableCategories} />
    </div>
  );
}
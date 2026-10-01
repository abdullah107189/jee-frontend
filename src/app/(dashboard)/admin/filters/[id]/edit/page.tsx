import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategories } from "@/services/category.service";
import { FilterGroupForm } from "@/components/modules/admin/filters/filter-group-form";

export const metadata: Metadata = {
  title: "Edit Filter Group | JEE Admin",
};

/* ─────────── Get single filter group by ID ─────────── */
/* Needed: backend endpoint GET /filters/:id */

async function getFilterGroupById(id: string) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.API_URL}/filters/${id}`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

interface EditFilterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFilterPage({
  params,
}: EditFilterPageProps) {
  const { id } = await params;

  const [group, categories] = await Promise.all([
    getFilterGroupById(id),
    getAllCategories(),
  ]);

  if (!group) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Edit Filter Group
        </h1>
        <p className="text-sm text-slate-500 mt-1">{group.name}</p>
      </div>

      <FilterGroupForm
        mode="edit"
        group={group}
        categories={categories.filter((c) => c.isActive)}
      />
    </div>
  );
}
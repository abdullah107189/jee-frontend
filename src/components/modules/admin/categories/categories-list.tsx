"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { AdminCategory } from "@/lib/types/category.types";
import { deleteCategoryAction } from "@/actions/category.actions";
import { CategoryDeleteDialog } from "./category-delete-dialog";

interface CategoriesListProps {
  categories: AdminCategory[];
}

export function CategoriesList({ categories }: CategoriesListProps) {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [isPending, startTransition] = useTransition();

  /* ─────────── Filter ─────────── */
  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ─────────── Delete ─────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const res = await deleteCategoryAction(deleteTarget.id);

      if (res.success) {
        toast.success(res.message);
        setDeleteTarget(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage product categories and taxonomy.
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="h-10 sm:h-12 rounded-xl shadow-lg shadow-blue-500/20">
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Card */}
      <Card className="rounded-2xl border-none shadow-lg overflow-hidden">
        {/* Search */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 sm:h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                  Slug
                </th>
                <th className="px-4 sm:px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                  Full Path
                </th>
                <th className="px-4 sm:px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                  Level
                </th>
                <th className="px-4 sm:px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                  Products
                </th>
                <th className="px-4 sm:px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-4 font-medium text-slate-500 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No categories found
                  </td>
                </tr>
              )}

              {filtered.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50/50 transition-colors bg-white"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div
                      className="font-semibold text-slate-900"
                      style={{ paddingLeft: `${cat.level * 16}px` }}
                    >
                      {cat.level > 0 && "└─ "}
                      {cat.name}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-slate-500 font-mono">
                      {cat.slug}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-xs text-slate-400 font-mono">
                      {cat.fullSlug}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                    {cat.level}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                    {cat.productCount}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Badge
                      variant={cat.isActive ? "default" : "outline"}
                      className="rounded-full px-3 py-1 text-xs"
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <Link href={`/admin/categories/${cat.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-slate-600"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteTarget(cat)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Dialog */}
      <CategoryDeleteDialog
        category={deleteTarget}
        isPending={isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
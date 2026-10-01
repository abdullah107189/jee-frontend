"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit, Trash2, Filter as FilterIcon } from "lucide-react";
import { toast } from "sonner";
import type { FilterGroupListItem } from "@/lib/types/filter.types";
import { deleteFilterGroupAction } from "@/actions/filter.actions";
import { FilterDeleteDialog } from "./filter-delete-dialog";

interface FiltersListProps {
  groups: FilterGroupListItem[];
}

export function FiltersList({ groups }: FiltersListProps) {
  const [deleteTarget, setDeleteTarget] = useState<FilterGroupListItem | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const res = await deleteFilterGroupAction(deleteTarget.id);

      if (res.success) {
        toast.success(res.message);
        setDeleteTarget(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Filters
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage category-specific filters (Brand, Color, Size, etc.)
          </p>
        </div>
        <Link href="/admin/filters/new">
          <Button className="h-11 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add Filter Group
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {groups.length === 0 && (
        <Card className="rounded-2xl p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <FilterIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold">No filter groups yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Create filter groups per category. E.g., Phone category with
            Brand, Color, RAM filters.
          </p>
          <Link href="/admin/filters/new">
            <Button className="mt-6 rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              Create First Filter Group
            </Button>
          </Link>
        </Card>
      )}

      {/* List */}
      {groups.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="rounded-2xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{group.name}</h3>
                  <p className="text-xs text-slate-500 font-mono truncate mt-0.5">
                    {group.slug}
                  </p>
                </div>
                <Badge
                  variant={group.isActive ? "default" : "outline"}
                  className="rounded-full"
                >
                  {group.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="mb-3">
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Category
                </p>
                <p className="text-sm font-medium">{group.category.name}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Filters
                </p>
                <p className="text-sm font-medium">
                  {group._count?.filters ?? 0} filters
                </p>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Link
                  href={`/admin/filters/${group.id}/edit`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full rounded-lg">
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 rounded-lg"
                  onClick={() => setDeleteTarget(group)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FilterDeleteDialog
        group={deleteTarget}
        isPending={isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
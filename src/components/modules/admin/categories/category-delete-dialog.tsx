"use client";

import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import type { AdminCategory } from "@/lib/types/category.types";

interface CategoryDeleteDialogProps {
  category: AdminCategory | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CategoryDeleteDialog({
  category,
  isPending,
  onClose,
  onConfirm,
}: CategoryDeleteDialogProps) {
  return (
    <ConfirmDeleteModal
      isOpen={!!category}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isPending}
      title="Delete Category"
      description="Are you sure you want to delete this category? This action cannot be undone."
      itemName={category?.name}
    />
  );
}
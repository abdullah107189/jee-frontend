"use client";

import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import type { FilterGroupListItem } from "@/lib/types/filter.types";

interface FilterDeleteDialogProps {
  group: FilterGroupListItem | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function FilterDeleteDialog({
  group,
  isPending,
  onClose,
  onConfirm,
}: FilterDeleteDialogProps) {
  return (
    <ConfirmDeleteModal
      isOpen={!!group}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isPending}
      title="Delete Filter Group"
      description="This will remove all filters and their options. Products will lose their filter values. This cannot be undone."
      itemName={group?.name}
    />
  );
}
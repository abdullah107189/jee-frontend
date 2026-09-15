"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SidebarFilters } from "./SidebarFilters";

interface MobileFilterDrawerProps {
  total: number;
  onClose: () => void;
  sidebarFiltersProps: React.ComponentProps<typeof SidebarFilters>;
}

export function MobileFilterDrawer({
  total,
  onClose,
  sidebarFiltersProps,
}: MobileFilterDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <SidebarFilters {...sidebarFiltersProps} />

        <Button type="button" onClick={onClose} className="mt-4 w-full">
          Show {total} products
        </Button>
      </div>
    </div>
  );
}
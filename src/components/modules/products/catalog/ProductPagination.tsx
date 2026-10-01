"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);

  return pages;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
  isPending,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Product pagination"
      className="mt-8 flex items-center justify-center gap-1 sm:gap-2"
    >
      {/* Previous */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage <= 1 || isPending}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="gap-1 rounded-lg"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              type="button"
              variant={p === currentPage ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => onPageChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              className={cn(
                "h-9 w-9 rounded-lg p-0",
                p === currentPage && "pointer-events-none",
              )}
            >
              {p}
            </Button>
          ),
        )}
      </div>

      {/* Next */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages || isPending}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="gap-1 rounded-lg"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { CategoryNavItem } from "@/lib/types/category.types";

interface MegaMenuProps {
  category: CategoryNavItem;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({
  category,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  if (category.children.length === 0) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="..."
    >
      {/* Dropdown panel */}
      <div className="min-w-60 max-w-70 overflow-hidden rounded-b-xl border-x border-b border-border bg-popover text-popover-foreground shadow-2xl">
        {/* Arrow indicator */}
        <div className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-l border-t border-border bg-popover" />

        {/* Children list */}
        <ul className="relative py-2">
          {category.children.map((child) => (
            <li key={child.id}>
              <Link
                href={`/categories/${child.fullSlug}`}
                className="group flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors hover:bg-muted/80"
              >
                <span className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {child.name}
                </span>

                <div className="flex items-center gap-2">
                  {child.productCount > 0 && (
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-blue-500">
                      {child.productCount}
                    </span>
                  )}
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer — view all */}
        <div className="border-t border-border/60 bg-muted/40 px-4 py-2.5">
          <Link
            href={`/categories/${category.fullSlug}`}
            className="inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300"
          >
            View all {category.name}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

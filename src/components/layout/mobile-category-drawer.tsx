"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import type { CategoryNavItem } from "@/lib/types/category.types";

interface MobileCategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryNavItem[];
}

export function MobileCategoryDrawer({
  open,
  onClose,
  categories,
}: MobileCategoryDrawerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl lg:hidden">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-4">
          <h2 className="text-lg font-bold text-slate-900">Categories</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* Featured */}
          <Link
            href="/products?featured=true"
            onClick={onClose}
            className="mb-1 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-3 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-100"
          >
            Exclusive Deals
            <ChevronRight className="h-4 w-4" />
          </Link>

          {categories.map((cat) => {
            const hasChildren = (cat.children?.length ?? 0) > 0;
            const isExpanded = expanded.has(cat.id);

            return (
              <div key={cat.id}>
                <div className="flex items-center">
                  <Link
                    href={`/categories/${cat.fullSlug}`}
                    onClick={onClose}
                    className="flex-1 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {cat.name}
                  </Link>

                  {hasChildren && (
                    <button
                      onClick={() => toggle(cat.id)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                  <div className="ml-3 border-l border-slate-100 pl-2">
                    {cat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.fullSlug}`}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        <span>{child.name}</span>
                        {child.productCount > 0 && (
                          <span className="text-xs text-slate-400">
                            {child.productCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { CategoryNavItem } from "@/lib/types/category.types";

interface MegaMenuProps {
  category: CategoryNavItem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
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
      className="absolute  top-full z-40 animate-in fade-in slide-in-from-top-1 duration-150"
      style={{
        animation: "fadeSlideIn 150ms ease-out",
      }}
    >
      {/* Dropdown panel */}
      <div className="min-w-[240px] max-w-[280px] overflow-hidden rounded-b-xl border-x border-b border-slate-200 bg-white shadow-2xl">
        {/* Arrow indicator */}
        <div className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white" />

        {/* Children list */}
        <ul className="relative py-2">
          {category.children.map((child) => (
            <li key={child.id}>
              <Link
                href={`/categories/${child.fullSlug}`}
                className="group flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors hover:bg-blue-50"
              >
                <span className="font-medium text-slate-700 group-hover:text-blue-700">
                  {child.name}
                </span>

                <div className="flex items-center gap-2">
                  {child.productCount > 0 && (
                    <span className="text-xs font-medium text-slate-400 group-hover:text-blue-500">
                      {child.productCount}
                    </span>
                  )}
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer — view all */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
          <Link
            href={`/categories/${category.fullSlug}`}
            className="inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
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
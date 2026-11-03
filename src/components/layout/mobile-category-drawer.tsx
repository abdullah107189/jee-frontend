"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown, Sparkles, FolderTree, Search } from "lucide-react";
import type { CategoryNavItem } from "@/lib/types/category.types";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

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
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filterQuery, setFilterQuery] = useState("");

  const isAllProductsActive = pathname === "/products" || pathname.startsWith("/products");

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCategories = filterQuery.trim()
    ? categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          cat.children?.some((child) =>
            child.name.toLowerCase().includes(filterQuery.toLowerCase())
          )
      )
    : categories;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="left" className="w-[85vw] sm:max-w-sm p-0 flex flex-col h-full bg-background border-r border-border">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between pb-2">
            <Link href="/" onClick={onClose} className="flex items-center">
              <Image
                src="/JEE.png"
                alt="JEE Logo"
                width={80}
                height={160}
                className="w-16 h-auto object-contain"
              />
            </Link>
          </div>
          <SheetTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderTree className="h-3.5 w-3.5" />
            </div>
            Browse Categories
          </SheetTitle>

          {/* Quick Filter Search */}
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Find category..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="h-8 pl-8 text-xs rounded-lg bg-background"
            />
          </div>
        </SheetHeader>

        {/* Categories List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* All Products Featured Pill */}
          <Link
            href="/products"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-colors mb-2",
              isAllProductsActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/70 text-foreground hover:bg-muted"
            )}
          >
            <span className="flex items-center gap-2">
              <Sparkles className={cn("h-4 w-4", isAllProductsActive ? "text-primary-foreground" : "text-primary")} />
              All Products & Deals
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>

          {filteredCategories.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No categories found for &quot;{filterQuery}&quot;
            </p>
          ) : (
            filteredCategories.map((cat) => {
              const hasChildren = (cat.children?.length ?? 0) > 0;
              const isExpanded = expanded.has(cat.id);
              const isCatActive =
                pathname === `/categories/${cat.fullSlug}` ||
                pathname.startsWith(`/categories/${cat.fullSlug}/`);

              return (
                <div key={cat.id} className="rounded-xl border border-transparent transition-colors">
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl transition-colors",
                      isCatActive
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-accent/60"
                    )}
                  >
                    <Link
                      href={`/categories/${cat.fullSlug}`}
                      onClick={onClose}
                      className={cn(
                        "flex-1 px-3 py-2.5 text-sm transition-colors",
                        isCatActive ? "font-bold text-primary" : "font-semibold text-foreground"
                      )}
                    >
                      {cat.name}
                    </Link>

                    {hasChildren && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(cat.id);
                        }}
                        className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
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

                  {/* Children / Subcategories */}
                  {hasChildren && isExpanded && (
                    <div className="ml-3 my-1 border-l-2 border-primary/20 pl-2 space-y-0.5">
                      {cat.children.map((child) => {
                        const isChildActive =
                          pathname === `/categories/${child.fullSlug}` ||
                          pathname.startsWith(`/categories/${child.fullSlug}/`);

                        return (
                          <Link
                            key={child.id}
                            href={`/categories/${child.fullSlug}`}
                            onClick={onClose}
                            className={cn(
                              "flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors",
                              isChildActive
                                ? "bg-primary/15 text-primary font-bold"
                                : "font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                          >
                            <span>{child.name}</span>
                            {child.productCount > 0 && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1.5 py-0 font-mono">
                                {child.productCount}
                              </Badge>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
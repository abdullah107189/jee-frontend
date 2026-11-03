"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import type { AdminCategory } from "@/lib/types/category.types";
import { deleteCategoryAction } from "@/actions/category.actions";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { cn } from "@/lib/utils";

/* ─────────── Tree Node Type ─────────── */

interface TreeNode extends AdminCategory {
  childrenNodes: TreeNode[];
}

/* ─────────── Build Tree ─────────── */

function buildTree(flat: AdminCategory[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Create nodes
  for (const cat of flat) {
    map.set(cat.id, { ...cat, childrenNodes: [] });
  }

  // Link
  for (const cat of flat) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.childrenNodes.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/* ─────────── Props ─────────── */

interface CategoriesListProps {
  categories: AdminCategory[];
}

/* ─────────── Component ─────────── */

export function CategoriesList({ categories }: CategoriesListProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [isPending, startTransition] = useTransition();

  /* ─────────── Tree ─────────── */

  const tree = useMemo(() => buildTree(categories), [categories]);

  /* ─────────── Filter ─────────── */

  const filteredTree = useMemo(() => {
    if (!search.trim()) return tree;

    const q = search.toLowerCase();

    const filterNode = (node: TreeNode): TreeNode | null => {
      const matches =
        node.name.toLowerCase().includes(q) ||
        node.slug.toLowerCase().includes(q);

      const filteredChildren = node.childrenNodes
        .map(filterNode)
        .filter((c): c is TreeNode => c !== null);

      if (matches || filteredChildren.length > 0) {
        return { ...node, childrenNodes: filteredChildren };
      }
      return null;
    };

    return tree.map(filterNode).filter((n): n is TreeNode => n !== null);
  }, [tree, search]);

  /* ─────────── Expand all if search ─────────── */

  const effectiveExpanded = useMemo(() => {
    if (!search.trim()) return expanded;

    // Search thakle sob matching node expand thakbe
    const all = new Set<string>();
    const collect = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        if (n.childrenNodes.length > 0) {
          all.add(n.id);
          collect(n.childrenNodes);
        }
      }
    };
    collect(filteredTree);
    return all;
  }, [filteredTree, search, expanded]);

  /* ─────────── Handlers ─────────── */

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = () => {
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

  /* ─────────── Stats ─────────── */

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.isActive).length;
    const roots = tree.length;
    const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

    return { total, active, roots, totalProducts };
  }, [categories, tree]);

  /* ─────────── Render ─────────── */

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Manage your category tree. Click to expand.
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="h-10 sm:h-12 rounded-xl shadow-lg shadow-blue-500/20">
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Active" value={stats.active} tone="success" />
        <StatCard label="Root" value={stats.roots} />
        <StatCard label="Products" value={stats.totalProducts} tone="primary" />
      </div>

      {/* Card */}
      <Card className="rounded-2xl border border-border/60 bg-card shadow-lg overflow-hidden">
        {/* Search */}
        <div className="p-4 sm:p-6 border-b border-border/60 bg-card">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/40 border-border focus:bg-background"
            />
          </div>
        </div>

        {/* Tree */}
        <div className="p-3 sm:p-4">
          {filteredTree.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No categories found
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredTree.map((node) => (
                <TreeRow
                  key={node.id}
                  node={node}
                  level={0}
                  expanded={effectiveExpanded}
                  onToggle={toggle}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
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

/* ─────────── Stat Card ─────────── */

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "primary";
}) {
  return (
    <div className="rounded-2xl bg-card p-4 border border-border/60 shadow-sm">
      <p className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-xl sm:text-2xl font-extrabold mt-1 tabular-nums",
          tone === "success" && "text-emerald-600 dark:text-emerald-400",
          tone === "primary" && "text-blue-600 dark:text-blue-400",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* ─────────── Tree Row ─────────── */

function TreeRow({
  node,
  level,
  expanded,
  onToggle,
  onDelete,
}: {
  node: TreeNode;
  level: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onDelete: (cat: AdminCategory) => void;
}) {
  const hasChildren = node.childrenNodes.length > 0;
  const isExpanded = expanded.has(node.id);

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-2 rounded-xl px-2 py-2 transition-colors",
          "hover:bg-muted/40",
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {/* Expand toggle */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="h-6 w-6 shrink-0" />
        )}

        {/* Folder icon */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            level === 0 && "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
            level === 1 && "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
            level >= 2 && "bg-muted text-muted-foreground",
          )}
        >
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "font-semibold truncate",
                level === 0 ? "text-foreground text-sm sm:text-base" : "text-foreground/80 text-sm",
              )}
            >
              {node.name}
            </span>

            {node.productCount > 0 && (
              <Badge
                variant="outline"
                className="rounded-full text-[10px] px-2 py-0 h-5 gap-1 border-border"
              >
                <Package className="h-3 w-3" />
                {node.productCount}
              </Badge>
            )}

            {!node.isActive && (
              <Badge
                variant="outline"
                className="rounded-full text-[10px] px-2 py-0 h-5 text-muted-foreground border-border"
              >
                Inactive
              </Badge>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground/70 font-mono truncate">
            {node.fullSlug}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/admin/categories/${node.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            onClick={() => onDelete(node)}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-2 w-px bg-border/60"
            style={{ left: `${level * 24 + 28}px` }}
          />
          {node.childrenNodes.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

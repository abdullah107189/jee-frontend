import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  id: string;
  name: string;
  fullSlug: string;
}

interface CategoryBreadcrumbProps {
  breadcrumb: BreadcrumbItem[];
}

export function CategoryBreadcrumb({ breadcrumb }: CategoryBreadcrumbProps) {
  return (
    <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
      <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>

      {breadcrumb.map((item, i) => (
        <span key={item.id} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          {i === breadcrumb.length - 1 ? (
            <span className="font-medium text-slate-900">{item.name}</span>
          ) : (
            <Link
              href={`/categories/${item.fullSlug}`}
              className="hover:text-blue-600"
            >
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
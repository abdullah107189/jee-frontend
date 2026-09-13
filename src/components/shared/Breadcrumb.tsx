import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

/* -------------------------- Types -------------------------- */
interface BreadcrumbItem {
  label: string;
  href?: string; // last item often has no link
}

interface BreadcrumbProps {
  /**
   * Custom items. If not provided, auto-generated from `pathname`.
   * Pass this from server pages for full SEO control.
   */
  items?: BreadcrumbItem[];
  /**
   * Fallback: raw pathname from `usePathname()`-less server context.
   * Usually you'd pass `items` instead — more explicit.
   */
  pathname?: string;
  /**
   * Human-readable label override for the last segment.
   * Example: `/cart` → "Shopping Cart" instead of "Cart"
   */
  name?: string;
  className?: string;
}

/* -------------------- Helpers -------------------- */
function toLabel(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildFromPathname(
  pathname: string,
  nameOverride?: string,
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    return {
      label: isLast && nameOverride ? nameOverride : toLabel(segment),
      href: isLast ? undefined : href, // last item = current page, no link
    };
  });
}

/* -------------------- Component -------------------- */
export function Breadcrumb({
  items,
  pathname = "",
  name,
  className = "",
}: BreadcrumbProps) {
  // Prefer explicit items; fall back to auto-generation from pathname
  const crumbs: BreadcrumbItem[] =
    items && items.length > 0 ? items : buildFromPathname(pathname, name);

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs text-muted-foreground sm:text-sm ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {/* Home */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:bg-accent hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {/* Segments */}
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li
              key={crumb.href ?? crumb.label}
              className="flex items-center gap-1.5"
            >
              <ChevronRight
                className="h-3 w-3 text-muted-foreground/60"
                aria-hidden="true"
              />

              {isLast || !crumb.href ? (
                <span
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-accent hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

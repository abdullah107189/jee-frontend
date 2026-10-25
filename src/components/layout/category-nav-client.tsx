"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CategoryNavItem } from "@/lib/types/category.types";
import { MobileCategoryDrawer } from "./mobile-category-drawer";
import { MegaMenu } from "./mega-menu";

interface CategoryNavClientProps {
    categories: CategoryNavItem[];
}

export function CategoryNavClient({
    categories,
}: CategoryNavClientProps) {
    const pathname = usePathname();

    const [activeId, setActiveId] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navRef = useRef<HTMLElement>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ---------------------------------------------------------------------- */
    /* Clear hover timeout                                                    */
    /* ---------------------------------------------------------------------- */

    const clearHoverTimeout = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
            hoverTimeout.current = null;
        }
    };

    /* ---------------------------------------------------------------------- */
    /* Open menu                                                              */
    /* ---------------------------------------------------------------------- */

    const openMenu = (id: string) => {
        clearHoverTimeout();
        setActiveId(id);
    };

    /* ---------------------------------------------------------------------- */
    /* Close menu with small delay                                            */
    /* ---------------------------------------------------------------------- */

    const closeMenu = () => {
        clearHoverTimeout();

        hoverTimeout.current = setTimeout(() => {
            setActiveId(null);
        }, 300);
    };

    /* ---------------------------------------------------------------------- */
    /* Route change                                                           */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        setActiveId(null);
        setMobileOpen(false);
    }, [pathname]);

    /* ---------------------------------------------------------------------- */
    /* Outside click                                                          */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                navRef.current &&
                !navRef.current.contains(e.target as Node)
            ) {
                clearHoverTimeout();
                setActiveId(null);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    /* ---------------------------------------------------------------------- */
    /* Escape                                                                 */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                clearHoverTimeout();
                setActiveId(null);
            }
        };

        document.addEventListener("keydown", handler);

        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, []);

    /* ---------------------------------------------------------------------- */
    /* Cleanup                                                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        return () => {
            clearHoverTimeout();
        };
    }, []);

    return (
        <nav
            ref={navRef}
            className="relative bg-[#1e2a5a] text-white shadow-md"
        >
            <div className="mxw flex h-12 items-center">
                {/* ========================================================== */}
                {/* Mobile scrollable category pills (< lg)                    */}
                {/* ========================================================== */}
                <div className="flex lg:hidden w-full items-center overflow-x-auto py-2 gap-2 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-white/25 transition-all"
                        aria-label="Open all categories"
                    >
                        <Menu className="h-3.5 w-3.5 text-amber-300" />
                        <span>Categories</span>
                    </button>

                    <Link
                        href="/products"
                        className="shrink-0 flex items-center gap-1 rounded-full bg-amber-400 text-slate-900 px-3 py-1.5 text-xs font-bold shadow-sm hover:bg-amber-300 transition-all"
                    >
                        <Sparkles className="h-3 w-3" />
                        <span>All Products</span>
                    </Link>

                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.fullSlug}`}
                            className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/20 hover:text-white transition-all whitespace-nowrap"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* ========================================================== */}
                {/* Desktop list                                                */}
                {/* ========================================================== */}

                <ul className="hidden flex-1 items-center gap-0.5 lg:flex">
                    {/* ------------------------------------------------------ */}
                    {/* Featured                                                */}
                    {/* ------------------------------------------------------ */}

                    <li>
                        <Link
                            href="/products"
                            className="block rounded-md px-3 py-2 text-sm font-bold text-amber-300 transition-colors hover:bg-white/10"
                        >
                            All Products
                        </Link>
                    </li>

                    {/* ------------------------------------------------------ */}
                    {/* Categories                                               */}
                    {/* ------------------------------------------------------ */}

                    {categories.map((cat) => {
                        const isActive = activeId === cat.id;
                        const hasKids =
                            (cat.children?.length ?? 0) > 0;

                        return (
                            <li
                                key={cat.id}
                                className="relative"
                                onMouseEnter={() => {
                                    if (hasKids) {
                                        openMenu(cat.id);
                                    } else {
                                        clearHoverTimeout();
                                        setActiveId(null);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (hasKids) {
                                        closeMenu();
                                    }
                                }}
                            >
                                {/* ================================================== */}
                                {/* Parent button / link                                */}
                                {/* ================================================== */}

                                <Link
                                    href={`/categories/${cat.fullSlug}`}
                                    className={cn(
                                        "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-white/15 text-white"
                                            : "text-white/90 hover:bg-white/10 hover:text-white",
                                    )}
                                >
                                    {cat.name}

                                    {hasKids && (
                                        <ChevronDown
                                            className={cn(
                                                "h-3.5 w-3.5 transition-transform duration-200",
                                                isActive && "rotate-180",
                                            )}
                                        />
                                    )}
                                </Link>

                                {/* ================================================== */}
                                {/* Dropdown                                            */}
                                {/* ================================================== */}

                                {isActive && hasKids && (
                                    <div
                                        className="absolute left-0 top-full z-50 pt-1"
                                        onMouseEnter={() => {
                                            /*
                                             * VERY IMPORTANT:
                                             * Mouse entered the dropdown,
                                             * so cancel closing.
                                             */
                                            clearHoverTimeout();
                                            setActiveId(cat.id);
                                        }}
                                        onMouseLeave={() => {
                                            closeMenu();
                                        }}
                                    >
                                        <MegaMenu
                                            category={cat}
                                        />
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* ================================================================ */}
            {/* Mobile Drawer                                                    */}
            {/* ================================================================ */}

            <MobileCategoryDrawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                categories={categories}
            />
        </nav>
    );
}

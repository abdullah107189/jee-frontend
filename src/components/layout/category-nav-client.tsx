"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryNavItem } from "@/lib/types/category.types";
import { MegaMenu } from "./mega-menu";
import { MobileCategoryDrawer } from "./mobile-category-drawer";

interface CategoryNavClientProps {
    categories: CategoryNavItem[];
}

export function CategoryNavClient({ categories }: CategoryNavClientProps) {
    const pathname = usePathname();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (id: string) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setActiveId(id);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = setTimeout(() => {
            setActiveId(null);
        }, 200);
    };

    useEffect(() => {
        setActiveId(null);
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setActiveId(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActiveId(null);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    return (
        <nav
            ref={navRef}
            className="relative bg-[#1e2a5a] text-white shadow-md"
            onMouseLeave={handleMouseLeave}
        >
            <div className="mxw flex h-12 items-center ">
                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="mr-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-white/10 lg:hidden"
                    aria-label="Open categories menu"
                >
                    <Menu className="h-5 w-5" />
                    <span>Categories</span>
                </button>

                {/* Desktop list */}
                <ul className="hidden flex-1 items-center gap-0.5 lg:flex">
                    {/* Featured */}
                    <li>
                        <Link
                            href="/products?featured=true"
                            className="block rounded-md px-3 py-2 text-sm font-bold text-amber-300 transition-colors hover:bg-white/10"
                        >
                            Exclusive Deals
                        </Link>
                    </li>

                    {categories.map((cat) => {
                        const isActive = activeId === cat.id;
                        const hasKids = (cat.children?.length ?? 0) > 0;

                        return (
                            <li
                                key={cat.id}
                                onMouseEnter={() => hasKids && handleMouseEnter(cat.id)}
                                className="relative"
                            >
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

                                {/* ✅ Dropdown — ei <li> er niche absolute */}
                                {isActive && hasKids && (
                                    <MegaMenu
                                        category={cat}
                                        onMouseEnter={() => {
                                            if (hoverTimeout.current)
                                                clearTimeout(hoverTimeout.current);
                                        }}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Mobile Drawer */}
            <MobileCategoryDrawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                categories={categories}
            />
        </nav>
    );
}
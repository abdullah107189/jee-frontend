"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Shield,
  Package,
  Heart,
  LogOut,
  Settings,
  Truck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { selectCartCount } from "@/store/selectors";
import { useAppSelector } from "@/store/hooks";
import type { AuthUser } from "@/lib/types/auth.types";
import { logoutAction } from "@/actions/auth.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import Image from "next/image";

export function Navbar({ user }: { user: AuthUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const totalCartCount = useAppSelector(selectCartCount);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Sparkles },
    { name: "Products", path: "/products", icon: Package },
    { name: "Warranty", path: "/warranty", icon: Shield },
  ];

  const userLinks = user
    ? [
      { name: "My Orders", path: "/customer/orders", icon: Truck },
      { name: "My Warranties", path: "/customer/warranties", icon: Shield },
      { name: "Wishlist", path: "/customer/wishlist", icon: Heart },
      { name: "Profile", path: "/customer/profile", icon: User },
      { name: "Settings", path: "/customer/settings", icon: Settings },
    ]
    : [];

  const isActiveLink = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname?.startsWith(path);
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle navigation with menu close
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-background/60 backdrop-blur-md border-b border-transparent"
          }`}
      >
        <div className="mxw">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo - Jee */}
            <Link href="/">
              <Image
                src="/JEE.png"
                alt="JEE Logo"
                width={100}
                height={200}
                // className={`${isScrolled ? "w-10" : "w-20"} h-auto`}
                className="w-20 h-auto"
              />
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.path);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground bg-accent"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Desktop Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex relative w-48 lg:w-64 xl:w-80"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 h-9 rounded-full bg-muted/50 border-border/50 focus:bg-background transition-all"
                />
              </form>

              {/* Cart Button */}
              <Link href="/cart" className="relative">
                <div className="relative h-10 w-10 rounded-full bg-accent flex items-center justify-center transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  {isMounted && totalCartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold border-2 border-background"
                    >
                      {totalCartCount}
                    </Badge>
                  )}
                </div>
              </Link>

              {/* User Menu / Login - WITHOUT asChild */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="cursor-pointer flex items-center gap-2 px-2 rounded-full bg-accent h-10">
                      <Avatar className="h-8 w-8 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline text-sm font-medium">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.name}</p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      {userLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <DropdownMenuItem
                            key={link.path}
                            onClick={() => handleNavigation(link.path)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Icon className="h-4 w-4" />
                            {link.name}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => logoutAction()}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="hidden sm:flex rounded-full"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle - WITHOUT asChild */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger
                  type="button"
                  className="lg:hidden rounded-full h-10 w-10 bg-accent"
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-75 sm:w-87.5 p-0">
                  <SheetHeader className="p-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-black text-lg">
                          J
                        </span>
                      </div>
                      <span className="text-xl font-black">Jee</span>
                      <span className="text-xs text-muted-foreground">
                        .store
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col h-full">
                    {/* Mobile Search */}
                    <div className="p-4 border-b border-border">
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 pr-4 h-10 rounded-full bg-muted/50"
                        />
                      </form>
                    </div>

                    {/* Navigation Links phone */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                      {navLinks.map((link) => {
                        const isActive = isActiveLink(link.path);
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.path}
                            href={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-accent"
                              }`}
                          >
                            <Icon className="h-5 w-5" />
                            {link.name}
                            {isActive && (
                              <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                            )}
                          </Link>
                        );
                      })}

                      {user && (
                        <>
                          <div className="h-px bg-border my-2" />
                          {userLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                              >
                                <Icon className="h-5 w-5" />
                                {link.name}
                              </Link>
                            );
                          })}
                        </>
                      )}
                    </nav>

                    {/* Mobile Footer */}
                    <div className="p-4 border-t border-border">
                      {user ? (
                        <Button
                          variant="destructive"
                          className="w-full rounded-xl"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            logoutAction();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button
                              variant="outline"
                              className="w-full rounded-xl"
                            >
                              Login
                            </Button>
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button className="w-full rounded-xl bg-primary hover:bg-primary/90">
                              Get Started
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

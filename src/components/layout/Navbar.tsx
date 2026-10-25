"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  ChevronDown,
  Sparkles,
  Shield,
  Package,
  Heart,
  LogOut,
  Truck,
  LayoutDashboard,
  Camera,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { QrCameraScanner } from "@/components/modules/admin/orders/QrCameraScanner";
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
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { roleDashboard } from "@/lib/auth/role";

export function Navbar({ user }: { user: AuthUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const totalCartCount = useAppSelector(selectCartCount);

  const [searchQuery, setSearchQuery] = useState("");
  const [warrantyQuery, setWarrantyQuery] = useState("");
  const [warrantyScannerOpen, setWarrantyScannerOpen] = useState(false);
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

  const handleWarrantySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (warrantyQuery.trim()) {
      router.push(`/warranty?serial=${encodeURIComponent(warrantyQuery.trim().toUpperCase())}`);
      setWarrantyQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleCameraScanSuccess = (serial: string) => {
    setWarrantyScannerOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/warranty?serial=${encodeURIComponent(serial.trim().toUpperCase())}`);
  };

  const userLinks = user
    ? [
        {
          name: "Dashboard",
          path: roleDashboard(user.role),
          icon: LayoutDashboard,
        },
        { name: "My Orders", path: "/customer/orders", icon: Truck },
        { name: "My Warranties", path: "/customer/warranties", icon: Shield },
        { name: "Wishlist", path: "/customer/wishlist", icon: Heart },
        { name: "Profile", path: "/customer/profile", icon: User },
      ]
    : [];

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-background/85 backdrop-blur-md border-b border-border/50"
        }`}
      >
        <div className="mxw">
          {/* Main Top Bar */}
          <div className="flex items-center justify-between h-16 md:h-20 gap-3">
            {/* Left: Brand Logo + All Products */}
            <div className="flex items-center gap-4 lg:gap-6 shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/JEE.png"
                  alt="JEE Logo"
                  width={90}
                  height={180}
                  className="w-16 md:w-20 h-auto object-contain"
                  priority
                />
              </Link>

              <Link
                href="/products"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-foreground bg-accent/70 hover:bg-accent transition-colors border border-border/60"
              >
                <Package className="h-3.5 w-3.5 text-primary" />
                <span>All Products</span>
              </Link>
            </div>

            {/* Desktop Center: Search & Warranty Hub */}
            <div className="hidden lg:flex items-center gap-3 flex-1 max-w-2xl justify-center px-4">
              {/* Product Search */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products, fans, lights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 h-10 rounded-full bg-muted/50 border-border/60 focus:bg-background text-xs transition-all"
                />
              </form>

              {/* Quick Warranty Verification Pill with Camera Scan */}
              <form
                onSubmit={handleWarrantySubmit}
                className="flex items-center relative rounded-full bg-primary/5 border border-primary/20 p-0.5 focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xs"
              >
                <div className="flex items-center pl-3 pr-1 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Verify Warranty (SN)..."
                  value={warrantyQuery}
                  onChange={(e) => setWarrantyQuery(e.target.value.toUpperCase())}
                  className="h-8.5 w-36 xl:w-44 bg-transparent text-xs font-mono font-semibold placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground text-foreground outline-none pr-1 uppercase"
                />
                <button
                  type="button"
                  onClick={() => setWarrantyScannerOpen(true)}
                  title="Scan Box QR Code with Camera"
                  className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-xs mr-0.5 shrink-0"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile 1-Tap QR Scan Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWarrantyScannerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 h-9 px-2.5 rounded-full border-primary/25 bg-primary/5 text-primary hover:bg-primary/10 text-xs font-bold"
                title="Scan Warranty QR"
              >
                <Camera className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Scan</span>
              </Button>

              {/* Cart Button */}
              <Link href="/cart" className="relative">
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-accent flex items-center justify-center transition-colors hover:bg-accent/80">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
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

              {/* User Dropdown / Login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="cursor-pointer flex items-center gap-2 px-2 rounded-full bg-accent h-9 sm:h-10">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden xl:inline text-xs font-semibold max-w-[100px] truncate">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden xl:block" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground capitalize font-medium">
                            Role: {user.role.toLowerCase()}
                          </p>
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
                            className="flex items-center gap-2.5 cursor-pointer text-xs py-2"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{link.name}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer text-xs py-2"
                      onClick={() => logoutAction()}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex rounded-full text-xs font-semibold h-9"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="rounded-full bg-primary hover:bg-primary/90 text-xs font-bold h-9 px-3 sm:px-4 shadow-md shadow-primary/20"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Sheet */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger
                  type="button"
                  className="lg:hidden rounded-full h-9 w-9 sm:h-10 sm:w-10 bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:max-w-sm p-0 flex flex-col h-full bg-background border-l border-border">
                  {/* Sheet Header */}
                  <SheetHeader className="p-4 border-b border-border bg-muted/20">
                    <SheetTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-black text-base">J</span>
                        </div>
                        <span className="text-lg font-black tracking-tight">JEE Store</span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* User Card in Sheet */}
                    {user ? (
                      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-foreground truncate">{user.name}</p>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono mt-0.5">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-center space-y-2.5">
                        <p className="text-xs font-bold text-foreground">Welcome to JEE Electronics</p>
                        <p className="text-[11px] text-muted-foreground">Sign in to track orders, manage warranties & exclusive deals.</p>
                        <div className="flex gap-2 pt-1">
                          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold h-8.5">
                              Login
                            </Button>
                          </Link>
                          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                            <Button size="sm" className="w-full rounded-xl text-xs font-bold h-8.5 bg-primary">
                              Register
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Mobile Sheet: Dedicated Warranty Verification Box */}
                    <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Official Warranty Verification</span>
                      </div>
                      <form onSubmit={handleWarrantySubmit} className="space-y-2">
                        <Input
                          placeholder="Serial # (e.g. JEE-FAN-001)"
                          value={warrantyQuery}
                          onChange={(e) => setWarrantyQuery(e.target.value.toUpperCase())}
                          className="h-9 font-mono text-xs uppercase bg-background border-border"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="flex-1 h-8.5 text-xs font-bold rounded-xl bg-primary"
                          >
                            Verify Serial
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setWarrantyScannerOpen(true);
                            }}
                            className="h-8.5 px-3 rounded-xl gap-1 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
                          >
                            <Camera className="h-3.5 w-3.5" />
                            <span>Scan QR</span>
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                        Explore
                      </p>
                      <Link
                        href="/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Package className="h-4 w-4 text-primary" />
                          All Products
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </Link>

                      {user && (
                        <>
                          <div className="h-px bg-border/60 my-2" />
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                            My Account
                          </p>
                          {userLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent transition-colors"
                              >
                                <span className="flex items-center gap-2.5">
                                  <Icon className="h-4 w-4 text-muted-foreground" />
                                  {link.name}
                                </span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              </Link>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sheet Footer */}
                  {user && (
                    <div className="p-4 border-t border-border bg-muted/20">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full rounded-xl text-xs font-bold h-9"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          logoutAction();
                        }}
                      >
                        <LogOut className="h-3.5 w-3.5 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Direct Search Bar (Visible directly on mobile screen under header) */}
          <div className="pb-3 pt-0.5 lg:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products, fans, lights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9.5 pr-4 h-9.5 rounded-xl bg-muted/50 border-border/70 text-xs focus:bg-background transition-all"
              />
            </form>
          </div>
        </div>
      </header>

      {/* Camera QR Scanner for Warranty */}
      <QrCameraScanner
        open={warrantyScannerOpen}
        onOpenChange={setWarrantyScannerOpen}
        onScanSuccess={handleCameraScanSuccess}
        title="Scan Box QR Code for Warranty"
      />
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X 
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCartCount } from '@/lib/redux/features/cart/selectors';

export function MainLayoutClient() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const totalCartCount = useAppSelector(selectCartCount);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // This ensures the component only renders on client side after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Check Warranty', path: '/warranty' },
    ...(user ? [
      { name: 'My Orders', path: '/customer/orders' },
      { name: 'My Warranties', path: '/customer/warranties' },
      { name: 'Profile', path: '/customer/profile' },
    ] : []),
  ];

  const isActiveLink = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname?.startsWith(path);
  };

  return (
    <>
      {/* Main Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 shrink-0">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <span className="text-xl">🛡️</span>
              </div>
              <span>TechStore<span className="text-blue-600">.</span></span>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Search products, brands, models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-24 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />
              <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-8 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
              >
                Search
              </button>
            </form>

            {/* Desktop Navigation Links & Actions */}
            <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`transition-colors py-1 border-b-2 ${
                      isActive
                        ? 'border-blue-600 text-blue-600 font-bold'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <Link href="/customer/cart" className="relative">
                <Button variant="outline" className="h-11 px-3.5 rounded-full border-slate-200 hover:bg-slate-100 relative">
                  <ShoppingBag className="h-5 w-5 text-slate-700" />
                  {/* Only render cart count after component is mounted on client */}
                  {isMounted && totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {totalCartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Account Menu / Login */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/customer">
                    <Button variant="outline" className="h-11 rounded-full px-4 border-slate-200 bg-slate-50 font-bold text-slate-800 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="hidden sm:inline">{user.name}</span>
                    </Button>
                  </Link>
                  {user.role && user.role !== 'customer' && (
                    <Link href={`/${user.role}`}>
                      <Button size="sm" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs">
                        Portal
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <Button className="h-11 rounded-full px-6 bg-blue-600 hover:bg-blue-700 font-bold shadow-md shadow-blue-500/20 text-white">
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-20 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-blue-600"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 px-3 rounded-full bg-blue-600 text-white text-[11px] font-bold"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  isActiveLink(link.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
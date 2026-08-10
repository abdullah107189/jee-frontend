"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetCategoriesQuery, useGetProductsQuery } from '@/lib/redux/features/product/productApi';
import { addToCart } from '@/lib/redux/features/cart/cartSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Zap,
  ShoppingBag,
  ArrowRight,
  Search,
  Star,
  CheckCircle2,
  Tv,
  Wind,
  Lightbulb,
  Cpu,
  Flame,
  Truck,
  RotateCcw,
  Headphones
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [quickId, setQuickId] = useState('');
  const { data: featuredResponse, isLoading: isFeaturedLoading } = useGetProductsQuery({ featured: true, limit: 4 });
  const { data: latestResponse, isLoading: isLatestLoading } = useGetProductsQuery({ isLatest: true, limit: 6 });
  const { data: categoriesData = [] } = useGetCategoriesQuery();

  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickId.trim()) {
      router.push(`/warranty?id=${encodeURIComponent(quickId.trim().toUpperCase())}`);
    }
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        warrantyMonths: product.warrantyMonths,
        category: product.category,
        brand: product.brand,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const categories = [
    { name: 'Fans', icon: Wind, color: 'bg-blue-500/10 text-blue-600', count: '18 Products' },
    { name: 'AC', icon: Cpu, color: 'bg-emerald-500/10 text-emerald-600', count: '12 Products' },
    { name: 'Lights', icon: Lightbulb, color: 'bg-amber-500/10 text-amber-600', count: '45 Products' },
    { name: 'Appliances', icon: Tv, color: 'bg-purple-500/10 text-purple-600', count: '32 Products' },
  ].map((category) => {
    const apiCategory = categoriesData.find((entry) => entry.name.toLowerCase() === category.name.toLowerCase());
    return {
      ...category,
      count: apiCategory?.productCount ? `${apiCategory.productCount} Products` : category.count,
    };
  });

  const featuredProducts = featuredResponse?.data ?? [];
  const latestProducts = latestResponse?.data ?? [];
  const isLoading = isFeaturedLoading || isLatestLoading;

  return (
    <MainLayout>
      <div className="space-y-12 sm:space-y-16 pb-16">
        {/* HERO BANNER SECTION */}
        <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" /> Official Brand Guarantee System
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Authentic Appliances with <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-300 to-purple-400">Digital Warranty</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
                  Shop genuine electronics online or verify offline seller purchases instantly via Unique Product IDs & QR codes. Enjoy 70 BDT bKash advance checkout!
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/products">
                    <Button size="lg" className="h-13 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/30 text-base">
                      Browse Shop <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/warranty">
                    <Button size="lg" variant="outline" className="h-13 px-8 rounded-full border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-base">
                      <ShieldCheck className="mr-2 h-5 w-5 text-blue-400" /> Check Warranty
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Warranty Card Widget in Hero */}
              <div className="lg:col-span-5">
                <Card className="rounded-3xl border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl text-white border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center font-bold">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg">Quick Warranty Check</h3>
                      <p className="text-xs text-slate-400 font-medium">Verify your offline or online product status</p>
                    </div>
                  </div>

                  <form onSubmit={handleQuickCheck} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Enter Unique Serial ID
                      </label>
                      <Input
                        value={quickId}
                        onChange={(e) => setQuickId(e.target.value)}
                        placeholder="e.g. FAN-001928, AC-003456"
                        className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white font-mono uppercase focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-600/30">
                      Check Warranty Status →
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BADGES BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Truck className="h-6 w-6" /></div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Fast Nationwide Delivery</h4>
                <p className="text-xs text-slate-500">Carefully packaged & insured</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><ShieldCheck className="h-6 w-6" /></div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">100% Verified Warranty</h4>
                <p className="text-xs text-slate-500">Activated at time of purchase</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><RotateCcw className="h-6 w-6" /></div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Easy Claiming Flow</h4>
                <p className="text-xs text-slate-500">Repair or replacement online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Headphones className="h-6 w-6" /></div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">24/7 Helpline Support</h4>
                <p className="text-xs text-slate-500">Dedicated service assistance</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Explore Categories</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Browse our genuine electrical products</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="text-blue-600 font-bold hover:text-blue-700">
                All Products <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={`/products?category=${cat.name}`}>
                  <Card className="rounded-3xl border-slate-200/80 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group bg-white overflow-hidden text-center p-6">
                    <div className={`h-16 w-16 mx-auto rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1">{cat.count}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Featured Products</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Best-selling electronics with long-term warranties</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
              ))
            ) : (
              featuredProducts.map((product) => (
                <Card key={product.id} className="rounded-3xl border-slate-200/80 hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden flex flex-col group">
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <Badge className="bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md">
                        {product.warrantyMonths} Months Warranty
                      </Badge>
                      {product.originalPrice && (
                        <Badge className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md">
                          Save ৳{(product.originalPrice - product.price).toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                        <span>{product.brand}</span>
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" /> {product.rating} ({product.reviewsCount})
                        </span>
                      </div>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-black text-slate-900">৳{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through ml-2 font-medium">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                        >
                          <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Add to Cart
                        </Button>
                        <Link href={`/products/${product.slug}`} className="w-full">
                          <Button variant="outline" className="w-full h-10 rounded-xl border-slate-200 text-slate-700 font-bold text-xs">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* LATEST PRODUCTS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Latest Arrivals</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Newly listed appliances with standard warranties</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="text-blue-600 font-bold hover:text-blue-700">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProducts.slice(0, 3).map((product) => (
              <Card key={product.id} className="rounded-3xl border-slate-200/80 bg-white p-4 flex gap-4 hover:shadow-xl transition-all">
                <img src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded-2xl bg-slate-100 shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Badge className="bg-slate-100 text-slate-700 text-[10px] font-extrabold mb-1">
                      🛡️ {product.warrantyMonths} Months Warranty
                    </Badge>
                    <Link href={`/products/${product.slug}`}>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.name}
                      </h4>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-black text-slate-900">৳{product.price.toLocaleString()}</span>
                    <Button
                      size="sm"
                      onClick={(e) => handleAddToCart(product, e)}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      + Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

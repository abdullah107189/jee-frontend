"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart } from '@/lib/redux/features/cart/cartSlice';
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
} from '@/lib/redux/features/product/productApi';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
} from 'lucide-react';

function formatPrice(value: number) {
  return `৳${value.toLocaleString()}`;
}

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? 'ALL');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') ?? 'ALL');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1));

  const debouncedSearch = useDebounce(searchTerm, 350);

  const { data: productsResponse, isLoading, isFetching } = useGetProductsQuery({
    page,
    limit: 12,
    category: selectedCategory,
    brand: selectedBrand,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    search: debouncedSearch.trim() || undefined,
  });
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, selectedBrand, minPrice, maxPrice]);

  const products = productsResponse?.data ?? [];
  const totalPages = productsResponse?.totalPages ?? 1;
  const totalItems = productsResponse?.total ?? 0;

  const handleAddToCart = (product: (typeof products)[number]) => {
    dispatch(
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        warrantyMonths: product.warrantyMonths,
        brand: product.brand,
        category: product.category,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  return (
    <MainLayout>
      <div className="bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl space-y-4">
            <Badge className="bg-white/10 text-white border border-white/15 rounded-full px-4 py-1.5 w-fit">
              Catalog
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Browse the full product catalog
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl">
              Search products, filter by category or brand, and narrow by price range before opening the detail view.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8">
          <Card className="self-start border-slate-200/80 bg-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-blue-600" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search products"
                    className="pl-10 rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Min Price</label>
                  <Input
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Price</label>
                  <Input
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    inputMode="numeric"
                    placeholder="100000"
                    className="rounded-2xl"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-2xl" onClick={resetFilters}>
                  Reset
                </Button>
                <Button className="flex-1 rounded-2xl">
                  <Filter className="mr-2 h-4 w-4" /> Apply
                </Button>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-bold text-slate-900">{totalItems.toLocaleString()} products</p>
                <p className="mt-1">Showing 12 products per page with server-side pagination.</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Products</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {isFetching ? 'Refreshing results...' : `Page ${page} of ${totalPages}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                {selectedCategory !== 'ALL' && <Badge variant="outline">{selectedCategory}</Badge>}
                {selectedBrand !== 'ALL' && <Badge variant="outline">{selectedBrand}</Badge>}
                {debouncedSearch.trim() && <Badge variant="outline">Search: {debouncedSearch.trim()}</Badge>}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="h-105 rounded-3xl bg-slate-200 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="rounded-3xl border border-dashed border-slate-200 bg-white">
                <CardContent className="p-10 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                  <p className="text-sm text-slate-500">Try clearing filters or using a broader search term.</p>
                  <Button onClick={resetFilters} className="rounded-2xl mt-2">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="group overflow-hidden border-slate-200/80 bg-white rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                    >
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute left-4 top-4 flex flex-col gap-2">
                            <Badge className="bg-slate-900 text-white shadow-lg">{product.category}</Badge>
                            <Badge variant="success" className="bg-white text-emerald-700 shadow-lg">
                              {product.warrantyMonths} months warranty
                            </Badge>
                          </div>
                        </div>
                      </Link>

                      <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-400">
                            <span>{product.brand}</span>
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="h-3.5 w-3.5 fill-amber-400" />
                              {product.rating} ({product.reviewsCount})
                            </span>
                          </div>
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="text-lg font-bold leading-tight text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          {product.description && (
                            <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
                          )}
                        </div>

                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-2xl font-black text-slate-900">{formatPrice(product.price)}</p>
                            {product.originalPrice && (
                              <p className="text-xs font-medium text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
                            )}
                          </div>
                          <Badge variant={product.inStock ? 'success' : 'destructive'}>
                            {product.inStock ? 'In stock' : 'Out of stock'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <Button
                            variant="outline"
                            className="rounded-2xl border-slate-200 text-slate-700"
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" /> Add
                          </Button>
                          <Link href={`/products/${product.slug}`}>
                            <Button className="w-full rounded-2xl">
                              View
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-sm text-slate-500">
                    Showing {productsResponse?.page ?? page} of {totalPages} pages
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                      {page}
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      disabled={page >= totalPages}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
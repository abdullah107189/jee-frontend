"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { addToCart } from '@/lib/redux/features/cart/cartSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useGetProductBySlugQuery } from '@/lib/redux/features/product/productApi';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';

function formatPrice(value: number) {
  return `৳${value.toLocaleString()}`;
}

function normalizeSpecs(specs: Record<string, string> | Array<{ label: string; value: string }> | undefined) {
  if (!specs) return [];

  if (Array.isArray(specs)) {
    return specs;
  }

  return Object.entries(specs).map(([label, value]) => ({ label, value }));
}

export default function ProductDetailsPage() {
  const dispatch = useAppDispatch();
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug;
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug ?? '', {
    skip: !slug,
  });
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (!product) return;

    const gallery = product.images?.length ? product.images : [product.image];
    setActiveImage(gallery[0]);
  }, [product]);

  const gallery = product?.images?.length ? product.images : product ? [product.image] : [];
  const specs = normalizeSpecs(product?.specs);

  const handleAddToCart = () => {
    if (!product) return;

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

  return (
    <MainLayout>
      <div className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8">
            <div className="h-135 rounded-3xl bg-slate-200 animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 rounded-2xl bg-slate-200 animate-pulse" />
              <div className="h-72 rounded-3xl bg-slate-200 animate-pulse" />
            </div>
          </div>
        ) : isError || !product ? (
          <Card className="rounded-3xl border border-dashed border-slate-200 bg-white">
            <CardContent className="p-10 text-center space-y-4">
              <h1 className="text-2xl font-black text-slate-900">Product not found</h1>
              <p className="text-slate-500">The requested product is unavailable or the slug is invalid.</p>
              <Link href="/products">
                <Button className="rounded-2xl">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Return to catalog
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8">
              <Card className="overflow-hidden border-slate-200/80 bg-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={activeImage || product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 p-4 sm:p-5 border-t border-slate-100">
                    {gallery.map((image) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        className={`overflow-hidden rounded-2xl border-2 transition-all ${
                          activeImage === image ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent'
                        }`}
                      >
                        <img src={image} alt={product.name} className="h-24 w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-slate-900 text-white">{product.category}</Badge>
                  <Badge variant="success">{product.brand}</Badge>
                  <Badge variant={product.inStock ? 'success' : 'destructive'}>
                    {product.inStock ? 'In stock' : 'Out of stock'}
                  </Badge>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">{product.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500 font-semibold">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-400" />
                      {product.rating} ({product.reviewsCount} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      {product.warrantyMonths} months warranty
                    </span>
                  </div>
                </div>

                <Card className="border-slate-200/80 bg-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                  <CardContent className="p-5 sm:p-6 space-y-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-3xl sm:text-4xl font-black text-slate-900">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
                        )}
                      </div>
                      <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                        Save {product.originalPrice ? formatPrice(product.originalPrice - product.price) : 'N/A'}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base leading-7 text-slate-600">
                      {product.description || 'This product includes a verified digital warranty and fast support.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Warranty</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{product.warrantyMonths} months manufacturer coverage</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Availability</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{product.inStock ? 'Ready to ship' : 'Currently unavailable'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        className="rounded-2xl h-12"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" /> Add to cart
                      </Button>
                      <Link href="/customer/checkout" className="w-full">
                        <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-200">
                          Buy now
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600">
                      <div className="rounded-2xl bg-slate-50 p-4 flex items-center gap-3">
                        <Truck className="h-5 w-5 text-blue-600" />
                        Fast delivery support
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        Verified warranty
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-slate-700" />
                        Digital serial tracking
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-8">
              <Card className="border-slate-200/80 bg-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {specs.length ? (
                    specs.map((spec) => (
                      <div key={spec.label} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                        <span className="text-sm font-semibold text-slate-500">{spec.label}</span>
                        <span className="text-sm font-bold text-slate-900 text-right">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Specification details are not available for this product.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 bg-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <CardHeader>
                  <CardTitle>Warranty Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-7 text-slate-600">
                    {product.warrantyTerms || 'Standard manufacturer warranty applies with digital activation at purchase.'}
                  </p>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <p className="font-bold">Warranty highlights</p>
                    <ul className="mt-3 space-y-2 text-emerald-800">
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Digital activation on sale completion</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Claim eligibility tracked by serial number</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Service support through seller and customer portals</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Need to verify an existing unit? Use the warranty check page to search by unique serial ID.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
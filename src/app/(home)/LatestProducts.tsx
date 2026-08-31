"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGetProductsQuery } from "@/lib/redux/features/product/productApi";
import { addToCart } from "@/lib/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { toast } from "sonner";

export default function LatestProducts() {
  const dispatch = useAppDispatch();

  const { data: latestResponse, isLoading } = useGetProductsQuery({
    limit: 3,
    isPublished: true,
    isActive: true,
  });

  const latestProducts = latestResponse?.data ?? [];

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const p = item.product;
    dispatch(
      addToCart({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        originalPrice: p.comparePrice,
        image: p.images?.[0],
        warrantyMonths: p.warrantyMonths,
      }),
    );
    toast.success(`${p.name} added to cart!`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Latest Arrivals
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Newly listed appliances with standard warranties
          </p>
        </div>
        <Link href="/products">
          <Button variant="ghost" className="font-bold text-blue-600 hover:text-blue-700">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-slate-200" />
            ))
          : latestProducts.map((item) => {
              const p = item.product;
              return (
                <Card key={item.id} className="flex gap-4 rounded-3xl border-slate-200/80 bg-white p-4 transition-all hover:shadow-xl">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={p.images?.[0] ?? "/placeholder.png"}
                      alt={p.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Badge className="mb-1 bg-slate-100 text-[10px] font-extrabold text-slate-700">
                        🛡️ {p.warrantyMonths} Months Warranty
                      </Badge>
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 transition-colors hover:text-blue-600">
                          {p.name}
                        </h3>
                      </Link>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900">
                        ৳{p.price.toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(item, e)}
                        className="rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        + Add
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
      </div>
    </section>
  );
}

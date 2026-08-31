"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowRight, Wind, Cpu, Lightbulb, Tv } from "lucide-react";
import { useGetCategoriesQuery } from "@/lib/redux/features/product/productApi";

const CATEGORIES = [
  { name: "Fans", icon: Wind, color: "bg-blue-500/10 text-blue-600" },
  { name: "AC", icon: Cpu, color: "bg-emerald-500/10 text-emerald-600" },
  { name: "Lights", icon: Lightbulb, color: "bg-amber-500/10 text-amber-600" },
  { name: "Appliances", icon: Tv, color: "bg-purple-500/10 text-purple-600" },
];

export default function CategoriesSection() {
  const { data: categoriesData = [] } = useGetCategoriesQuery();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Explore Categories
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Browse our genuine electrical products
          </p>
        </div>
        <Link href="/products">
          <Button variant="ghost" className="font-bold text-blue-600 hover:text-blue-700">
            All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const apiCategory = categoriesData.find(
            (entry) => entry.name.toLowerCase() === cat.name.toLowerCase(),
          );

          return (
            <Link key={cat.name} href={`/products?category=${cat.name}`}>
              <Card className="group overflow-hidden rounded-3xl border-slate-200/80 bg-white p-6 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-xl">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${cat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 transition-colors group-hover:text-blue-600">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {apiCategory?.productCount
                    ? `${apiCategory.productCount} Products`
                    : "Explore Now"}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

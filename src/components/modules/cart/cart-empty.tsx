"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function CartEmpty() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="h-9 w-9 text-primary" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Your cart is empty
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          Looks like you haven&apos;t added anything yet. Start exploring and
          find something you love.
        </p>

        <Link href="/products">
          <Button size="lg" className="mt-7 w-full rounded-xl sm:w-auto">
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

export default function QuickWarrantyCheck() {
  const router = useRouter();
  const [productId, setProductId] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = productId.trim();

    if (!id) return;

    router.push(`/warranty?id=${encodeURIComponent(id.toUpperCase())}`);
  };

  return (
    <div className="h-full rounded-xl bg-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 sm:gap-3">
      

        <div className="min-w-0">
          <h2 className="text-sm font-semibold sm:text-base">Check Warranty</h2>

          <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground sm:text-xs">
            Verify your product warranty
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-4 sm:mt-5">
        <label htmlFor="product-id" className="sr-only">
          Product ID
        </label>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground sm:size-4"
          />

          <input
            id="product-id"
            name="productId"
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Product ID · FAN-001928"
            autoComplete="off"
            spellCheck={false}
            required
            className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 pl-9 text-xs font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 sm:h-11 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="mt-2.5 flex h-10 w-full items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition active:scale-[0.98] hover:bg-primary/90 sm:h-11 sm:text-sm"
        >
          Check Warranty
          <ArrowRight className="ml-1.5 size-3.5 sm:size-4" />
        </button>
      </form>
    </div>
  );
}

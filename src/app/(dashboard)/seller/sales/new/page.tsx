import type { Metadata } from "next";
import { Suspense } from "react";
import NewSaleContent from "@/components/modules/seller/sales/new/NewSaleContent";

export const metadata: Metadata = {
  title: "New Offline Sale | JEE",
  description: "Search a unique product ID and issue an instant digital warranty.",
};

export default function NewSalePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground font-semibold">Loading POS terminal...</div>}>
      <NewSaleContent />
    </Suspense>
  );
}
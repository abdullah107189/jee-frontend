import { CartView } from "@/components/modules/cart/cart-view";
import type { Metadata } from "next";

/* ----------------------------- SEO Metadata ----------------------------- */
export const metadata: Metadata = {
  title: "Shopping Cart | Jee Store",
  description:
    "Review your shopping cart, update quantities and proceed to secure checkout at Jee Store — Bangladesh's trusted tech & lifestyle e-commerce platform.",
  keywords: ["cart", "shopping cart", "checkout", "Jee Store", "Bangladesh"],
  robots: { index: false, follow: true }, // Cart pages shouldn't be indexed
  alternates: { canonical: "https://jeestore.com/cart" },
};

export default function CartPage() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Subtle brand gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent"
      />

      <div className="relative container-page py-6 sm:py-8 lg:py-10">
        <CartView />
      </div>
    </main>
  );
}

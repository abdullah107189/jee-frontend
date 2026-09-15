import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search, ShieldCheck } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "Product Not Found",
  description:
    "The product you are looking for does not exist or has been moved.",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <section className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 text-center">
      {/* Subtle brand gradient backdrop (matches /cart) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent"
      />

      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Error 404
      </p>
      <h1 className="mt-4 text-6xl font-black tracking-tight text-foreground sm:text-7xl">
        Product not found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
        The product you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
        <Link
          href="/products"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Search className="h-4 w-4" />
          Browse products
        </Link>
        <Link
          href="/warranty"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ShieldCheck className="h-4 w-4" />
          Check warranty
        </Link>
      </div>
    </section>
  );
}

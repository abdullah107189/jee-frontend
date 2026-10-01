import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyCategoryProps {
  category: { id: string; name: string; fullSlug: string };
  siblings: Array<{
    id: string;
    name: string;
    fullSlug: string;
    icon: string | null;
  }>;
}

export function EmptyCategory({ category, siblings }: EmptyCategoryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Package className="h-10 w-10 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-bold">No products in {category.name} yet</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We're adding new products soon. Explore similar categories meanwhile.
      </p>

      {siblings.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Explore similar categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {siblings.map((sib) => (
              <Link
                key={sib.id}
                href={`/categories/${sib.fullSlug}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {sib.name}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/products">
        <Button className="mt-8 rounded-full">Browse All Products</Button>
      </Link>
    </div>
  );
}
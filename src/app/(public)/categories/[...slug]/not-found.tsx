import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PackageX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold">Category not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The category you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/products">
        <Button className="mt-6 rounded-full">Browse All Products</Button>
      </Link>
    </main>
  );
}
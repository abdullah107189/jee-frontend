// app/products/layout.tsx
import { PublicLayout } from "@/components/layout/PublicLayout";
import type { ReactNode } from "react";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

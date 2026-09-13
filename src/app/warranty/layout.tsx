// app/warranty/layout.tsx
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ReactNode } from "react";

export default function WarrantyLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

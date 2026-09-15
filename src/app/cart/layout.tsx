import type { ReactNode } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
export default async function CartLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}

import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Check Warranty | JEE Store",
  description: "Verify your product warranty status and validity using your serial number.",
};

export default function WarrantyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

import type { ReactNode } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
export default async function Checkout({
    children,
}: {
    children: ReactNode;
}) {
    return <PublicLayout>{children}</PublicLayout>;
}

import type { ReactNode } from "react"; 
export default async function CartLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

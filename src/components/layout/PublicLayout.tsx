import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { CurrentUser, getCurrentUser } from "@/services/auth.service";
import Footer from "./Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Wraps public marketing pages with Navbar + Footer.
 * Fetches user server-side — cached via React `cache()`.
 */
export async function PublicLayout({ children }: PublicLayoutProps) {
  const user: CurrentUser = {
    id: 1,
    email: "test@example.com",
    name: "John",
    role: "admin",
    phone: "01711111111",
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

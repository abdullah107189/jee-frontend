// app/checkout/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "../../../components/modules/checkout/checkout-form";
import { auth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your order securely with delivery address and payment method.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = await auth();

  if (!user) redirect("/login?redirect=/checkout");

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <CheckoutForm
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
        }}
      />
    </main>
  );
}
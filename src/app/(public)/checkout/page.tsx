import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth/session";
import { CheckoutForm } from "@/components/modules/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your order securely with delivery address and payment method.",
  robots: { index: false, follow: false },
};

const API_URL = process.env.API_URL!;

interface SavedAddress {
  fullName?: string;
  phone?: string;
  email?: string;
  divisionId?: string;
  divisionName?: string;
  districtId?: string;
  districtName?: string;
  upazilaId?: string;
  upazilaName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}

export default async function CheckoutPage() {
  // 1. Auth check
  const user = await auth();
  if (!user) redirect("/login?redirect=/checkout");

  // 2. Fetch saved address (customer profile)
  let savedAddress: SavedAddress | null = null;
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/customers/me`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      savedAddress = json?.data?.shippingAddress ?? null;
    }
  } catch {
    // ignore — fallback to manual fill
  }

  // 3. Render
  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <CheckoutForm
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
        }}
        savedAddress={savedAddress}
      />
    </main>
  );
}
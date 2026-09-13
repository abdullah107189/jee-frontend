import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Truck, BadgeCheck, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/services/auth.service";
import { LoginForm } from "@/components/modules/login/login-form";
import Image from "next/image";

/* ----------------------------- SEO Metadata ----------------------------- */
export const metadata: Metadata = {
  title: "Sign In | Jee Store",
  description:
    "Sign in to your Jee Store account to track orders, manage warranties, and shop premium smartphones, gadgets, and home appliances in Bangladesh.",
  keywords: ["login", "sign in", "Jee Store", "account", "Bangladesh gadgets"],
  openGraph: {
    title: "Sign In | Jee Store",
    description:
      "Sign in to your Jee Store account — Bangladesh's trusted tech & lifestyle store.",
    url: "https://jeestore.com/login",
    siteName: "Jee Store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Jee Store",
    description:
      "Sign in to your Jee Store account — Bangladesh's trusted tech store.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://jeestore.com/login" },
};

/* -------------------- Redirect if already logged in -------------------- */
export default async function LoginPage() {
  // Server-side check — prevents flash of login page for logged-in users
  const user = await getCurrentUser();
  if (user) {
    redirect(`/${user.role}`);
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]"
      />
      {/* Decorative blobs — JEE brand blue */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* ============ LEFT: Branding (SSR) ============ */}
          <section className="hidden flex-col justify-center lg:flex">
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0 p-1"
            >
              <Image
                src="/JEE.png"
                alt="JEE Logo"
                width={100}
                height={200}
                className="w-25 h-auto"
              />
            </Link>

            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Welcome back to Jee Store</span>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground xl:text-5xl">
              Sign in and continue
              <span className="block jee-gradient-text">shopping smarter.</span>
            </h1>

            <p className="mb-8 max-w-md text-base text-muted-foreground">
              Access your orders, warranties, wishlist and exclusive member
              deals — all in one place.
            </p>

            <ul className="space-y-4">
              {[
                {
                  icon: Truck,
                  title: "Track Your Orders",
                  desc: "Real-time delivery updates",
                },
                {
                  icon: BadgeCheck,
                  title: "Manage Warranties",
                  desc: "One-click warranty checks",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure & Private",
                  desc: "Your data stays protected",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <li
                  key={title}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ============ RIGHT: Login Form (Client Island) ============ */}
          <section className="flex items-center justify-center">
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}

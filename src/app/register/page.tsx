import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Sparkles, Truck, BadgeCheck } from "lucide-react";
import { RegisterForm } from "@/components/modules/register/register-form";
import Image from "next/image";

/* ----------------------------- SEO Metadata ----------------------------- */
export const metadata: Metadata = {
  title: "Create Account | JEE Shope",
  description:
    "Create your free JEE Shope account to shop premium smartphones, gadgets, laptops and accessories in Bangladesh. Track orders, manage warranties and get exclusive deals.",
  keywords: [
    "register",
    "sign up",
    "JEE Shope",
    "create account",
    "Bangladesh gadgets",
    "online shopping",
  ],
  openGraph: {
    title: "Create Account | JEE Shope",
    description:
      "Join JEE Shope today — Bangladesh's trusted tech & lifestyle e-commerce platform.",
    url: "https://jeestore.com/register",
    siteName: "JEE Shope",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Account | JEE Shope",
    description:
      "Join JEE Shope today — Bangladesh's trusted tech & lifestyle e-commerce platform.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://jeestore.com/register" },
};

/* -------------------------- Static Feature Data ------------------------- */
const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Nationwide shipping across Bangladesh",
  },
  {
    icon: BadgeCheck,
    title: "100% Genuine",
    description: "Authentic products with warranty",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Your data is always protected",
  },
];

/* ------------------------------- Page ---------------------------------- */
export default function RegisterPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-background via-background to-primary/5">
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-50 mask-[radial-gradient(ellipse_at_center,white,transparent_75%)]"
      />
      {/* Decorative blobs */}
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
          {/* ============ LEFT: Brand / Value Props (SSR-rendered) ============ */}
          <section className="hidden flex-col justify-center lg:flex">
            {/* Logo */}
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

            {/* Badge */}
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Join 10,000+ Happy Customers</span>
            </div>

            {/* Headline */}
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground xl:text-5xl">
              Create your account
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Start shopping smarter.
              </span>
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-md text-base text-muted-foreground">
              Get access to exclusive deals, order tracking, warranty
              management, and a seamless shopping experience across Bangladesh.
            </p>

            {/* Feature List */}
            <ul className="space-y-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li
                    key={feature.title}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {feature.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ============ RIGHT: Register Form (Client island) ============ */}
          <section className="flex items-center justify-center">
            <RegisterForm />
          </section>
        </div>
      </div>
    </main>
  );
}

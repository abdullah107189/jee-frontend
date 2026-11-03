import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Package,
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  RotateCcw,
  Truck,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-foreground">
      {/* Top Hotline & Support Strip (Apple Gadgets style) */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Hotline */}
            <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition hover:border-primary/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Phone className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Hotline (10 AM - 10 PM)
                </p>
                <a
                  href="tel:+8809612345678"
                  className="text-base sm:text-lg font-black tracking-tight text-foreground hover:text-primary transition-colors block truncate"
                >
                  +880 9612-345678
                </a>
              </div>
            </div>

            {/* Flagship Showroom */}
            <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition hover:border-primary/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">
                  Flagship Store & HQ
                </p>
                <p className="text-sm font-bold text-foreground truncate">
                  Plot #45, Gulshan-2, Dhaka-1212
                </p>
              </div>
            </div>

            {/* Email Support */}
            <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition hover:border-primary/40 sm:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Mail className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">
                  Email Support & Queries
                </p>
                <a
                  href="mailto:support@jee.com.bd"
                  className="text-sm font-bold text-foreground hover:text-primary transition-colors block truncate"
                >
                  support@jee.com.bd
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Social (Spans 2 cols on lg) */}
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/JEE.png"
                alt="JEE Logo"
                width={100}
                height={200}
                className="w-24 h-auto object-contain"
              />
            </Link>

            <p className="text-sm font-medium leading-relaxed text-muted-foreground max-w-sm">
              Bangladesh&apos;s leading technology retail and wholesale network. Enjoy authentic electronics with verifiable digital QR warranty tracking and fast Cash on Delivery nationwide.
            </p>

            {/* Social Icons */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition shadow-2xs"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-pink-500/10 hover:text-pink-600 hover:border-pink-500/30 transition shadow-2xs"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30 transition shadow-2xs"
                >
                  <Youtube className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 transition shadow-2xs"
                >
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Customer Care */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-muted-foreground">
              <li>
                <Link href="/customer/orders" className="hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-primary transition-colors">
                  Verify QR Warranty
                </Link>
              </li>
              <li>
                <Link href="/customer/warranties" className="hover:text-primary transition-colors">
                  Claim Warranty Service
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-primary transition-colors">
                  Warranty Policies & Terms
                </Link>
              </li>
              <li>
                <Link href="/customer/orders" className="hover:text-primary transition-colors">
                  Return & Refund Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Explore Products */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Browse All Products
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Smart Phones & Accessories
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Laptops & Computers
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Headphones & Audio
                </Link>
              </li>
              <li>
                <Link href="/customer/profile" className="hover:text-primary transition-colors">
                  Merchant / Seller Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Guarantees (Apple Gadgets style) */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground mb-4">
              Why Choose JEE
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground block">100% Authentic</strong>
                  Genuine brand boxed products
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground block">Digital QR Warranty</strong>
                  Verifiable tamper-proof records
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Truck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground block">Cash on Delivery</strong>
                  Nationwide home delivery
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <RotateCcw className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground block">Easy Replacement</strong>
                  Hassle-free verified claim policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Payment Strip & Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-muted-foreground text-center md:text-left">
            &copy; {currentYear} JEE Bangladesh. All rights reserved. Built for seamless online & offline commerce.
          </p>

          {/* Accepted Payments Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
              Accepted Payments:
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-muted text-[11px] font-bold text-foreground border border-border/80">
              Cash on Delivery
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-[11px] font-bold text-pink-600 dark:text-pink-400 border border-pink-500/20">
              bKash
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-[11px] font-bold text-orange-600 dark:text-orange-400 border border-orange-500/20">
              Nagad
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-[11px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Rocket
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Visa / Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

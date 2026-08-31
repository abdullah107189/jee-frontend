import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/MainLayout";  
import TrustBadges from "./(home)/TrustBadges";
import CategoriesSection from "./(home)/CategoriesSection";
import FeaturedProducts from "./(home)/FeaturedProducts";
import LatestProducts from "./(home)/LatestProducts";
import { HeroSection } from "./(home)/HeroSection";

export const metadata: Metadata = {
  title: {
    default: "Vision Electronics — Authentic Appliances with Digital Warranty",
    template: "%s | Vision Electronics",
  },
  description:
    "Shop genuine electronics online or verify offline purchases instantly via unique product IDs & QR codes. Fans, AC, lights & appliances with verified digital warranty.",
  keywords: [
    "electronics bangladesh",
    "digital warranty",
    "ceiling fan",
    "authentic appliances",
    "warranty check",
  ],
  openGraph: {
    title: "Vision Electronics — Authentic Appliances with Digital Warranty",
    description:
      "Genuine electronics with verifiable digital warranty via Unique Product IDs & QR codes.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

// JSON-LD for rich results in Google
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vision Electronics",
  description:
    "Authentic appliances with digital warranty verification system.",
};

export default function HomePage() {
  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-12 pb-16 sm:space-y-16">
        <HeroSection />
        <TrustBadges />
        <CategoriesSection />
        <FeaturedProducts />
        <LatestProducts />
      </div>
    </MainLayout>
  );
}

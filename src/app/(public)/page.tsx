// app/page.tsx — Home (SLIM NOW!)
import type { Metadata } from "next"; 
import { HeroSection } from "@/components/modules/home/HeroSection";
import TrustBadges from "@/components/modules/home/TrustBadges";
import CategoriesSection from "@/components/modules/home/CategoriesSection";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
import LatestProducts from "@/components/modules/home/LatestProducts";

export const metadata: Metadata = {
  title: "Authentic Appliances with Digital Warranty",
  description:
    "Shop genuine electronics online or verify offline purchases instantly via unique product IDs & QR codes.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JEE",
  url: "https://jeestore.com",
  description: "Authentic appliances with digital warranty verification.",
  logo: "https://jeestore.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+8809612345678",
    contactType: "customer service",
    areaServed: "BD",
  },
};

export default function HomePage() {
  return (
    <>
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
    </>
  );
}

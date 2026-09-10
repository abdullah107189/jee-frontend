import Image from "next/image";
import { heroSlides, trustBadges } from "./HeroSlide";
import { HeroSlider } from "./HeroSlider";
import QuickWarrantyCheck from "./QuickWarrantyCheck";
import { TrustBadgeStrip } from "./TrustBadgeStrip";

export function HeroSection() {
  return (
    <section
      aria-label="Featured deals and offers"
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      {/* visually hidden but present for SEO/a11y — the slider itself has no
          single canonical page heading, so this gives crawlers and screen
          readers one real h1 for the section */}
      <h1 className="sr-only">
        Shop the latest smartphones, laptops and gadgets in Bangladesh
      </h1>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {/* Main Banner */}
        <div className="min-w-0 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <HeroSlider slides={heroSlides} />
          </div>
        </div>

        {/* Right / Bottom */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-1  ">
          {/* Warranty */}
          <div className="min-w-0 aspect-video overflow-hidden rounded-xl border border-border bg-card">
            <QuickWarrantyCheck />
          </div>

          {/* Second Banner */}
          <div className="relative aspect-video min-w-0 overflow-hidden rounded-xl">
            <Image
              src="/images/hero/ac_hero.webp"
              alt="Air conditioner offer"
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <TrustBadgeStrip items={trustBadges} />
    </section>
  );
}

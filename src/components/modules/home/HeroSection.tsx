import Image from "next/image";
import { HeroSlider } from "./HeroSlider";
import QuickWarrantyCheck from "./QuickWarrantyCheck";
import { heroSlides } from "@/dammyData/HeroSlide";
import TrustBadges from "./TrustBadges";
import type { HeroSlide } from "@/lib/types/hero.types";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export async function HeroSection() {
  let slides: HeroSlide[] = heroSlides;
  let sideBannerImage = "/images/hero/ac_hero.webp";
  let sideBannerAlt = "Air conditioner offer";

  try {
    const res = await fetch(`${API_URL}/settings/public`, {
      next: { revalidate: 60 },
    }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.data?.heroSlides && json.data.heroSlides.length > 0) {
        slides = json.data.heroSlides.map((s: any, idx: number) => ({
          id: s.id || `slide-${idx}`,
          title: s.title,
          subtitle: s.subtitle,
          ctaLabel: s.ctaLabel || "Shop now",
          ctaHref: s.ctaHref || "/products",
          imageSrc: s.imageSrc,
          imageAlt: s.imageAlt || s.title,
          theme: idx % 2 === 0 ? "indigo" : "coral",
        }));
      }
      if (json?.data?.heroSideBanner?.imageSrc) {
        sideBannerImage = json.data.heroSideBanner.imageSrc;
        sideBannerAlt = json.data.heroSideBanner.alt || sideBannerAlt;
      }
    }
  } catch (err) {
    console.error("[HeroSection] error fetching hero settings:", err);
  }

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
            <HeroSlider slides={slides} />
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
              src={sideBannerImage}
              alt={sideBannerAlt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <TrustBadges />
    </section>
  );
}

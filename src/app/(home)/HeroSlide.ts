import { HeroSlide, TrustBadgeItem } from "@/Types/hero.types";

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-iphone-17",
    title: "iPhone 17 Pro Max, in stock now",
    subtitle: "Titanium build, A19 Pro chip — official warranty included",
    ctaLabel: "Shop iPhone 17",
    ctaHref: "/images/hero/fan1.jpg",
    imageSrc: "/images/hero/fan1.jpg",
    imageAlt: "iPhone 17 Pro Max in natural titanium finish",
    theme: "indigo",
  },
  {
    id: "slide-macbook-air-m5",
    title: "MacBook Air M5, up to ৳15,000 off",
    subtitle: "0% EMI up to 12 months on all card purchases",
    ctaLabel: "Shop MacBooks",
    ctaHref: "/category/laptops",
    imageSrc: "/images/hero/light.jpg",
    imageAlt: "MacBook Air M5 open on a desk",
    theme: "coral",
  },
  {
    id: "slide-galaxy-watch-ultra",
    title: "Galaxy Watch Ultra, ৳5,000 off",
    subtitle: "Track every workout, call and text from your wrist",
    ctaLabel: "Shop smartwatches",
    ctaHref: "/category/smart-watch",
    imageSrc: "/images/hero/ac_hero.webp",
    imageAlt: "Galaxy Watch Ultra on a wrist",
    theme: "indigo",
  },
];

export const trustBadges: TrustBadgeItem[] = [
  { id: "emi", label: "36 months EMI", icon: "emi" },
  { id: "delivery", label: "Fastest home delivery", icon: "delivery" },
  { id: "exchange", label: "Exchange facility", icon: "exchange" },
  { id: "price", label: "Best price deals", icon: "price" },
  { id: "support", label: "After-sales service", icon: "support" },
];

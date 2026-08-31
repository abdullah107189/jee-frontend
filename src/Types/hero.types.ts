export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  theme: "indigo" | "coral";
}

export type TrustBadgeIcon =
  | "emi"
  | "delivery"
  | "exchange"
  | "price"
  | "support";

export interface TrustBadgeItem {
  id: string;
  label: string;
  icon: TrustBadgeIcon;
}
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
  | "authentic"
  | "warranty"
  | "delivery"
  | "support"
  | "secure";

export interface TrustBadgeItem {
  id: string;
  label: string;
  icon: TrustBadgeIcon;
}

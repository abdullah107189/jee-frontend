import { TrustBadgeItem, TrustBadgeIcon } from "@/Types/hero.types";
import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  Headset,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<TrustBadgeIcon, LucideIcon> = {
  authentic: BadgeCheck,
  warranty: ShieldCheck,
  delivery: Truck,
  support: Headset,
  secure: ShieldCheck,
};

interface TrustBadgeStripProps {
  items: TrustBadgeItem[];
}

export function TrustBadgeStrip({ items }: TrustBadgeStripProps) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
      {items.map((item) => {
        const Icon = ICONS[item.icon];

        return (
          <li
            key={item.id}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-surface-raised px-3.5 py-3"
          >
            <Icon
              className="h-4 w-4 shrink-0 text-accent-signal sm:h-[18px] sm:w-[18px]"
              aria-hidden="true"
            />

            <span className="text-xs font-medium leading-5 text-text-muted sm:text-sm">
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

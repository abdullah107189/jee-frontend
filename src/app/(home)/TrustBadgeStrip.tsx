import { Wallet, Truck, RefreshCcw, Tag, Headset, type LucideIcon } from "lucide-react";

import type { TrustBadgeIcon, TrustBadgeItem } from "@/types/hero.types";

const ICONS: Record<TrustBadgeIcon, LucideIcon> = {
  emi: Wallet,
  delivery: Truck,
  exchange: RefreshCcw,
  price: Tag,
  support: Headset,
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
              className="h-4 w-4 shrink-0 text-accent-signal"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-text-muted sm:text-sm">
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
import { TrustBadgeItem, TrustBadgeIcon } from "@/lib/types/hero.types";
import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  Headset,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<TrustBadgeIcon, LucideIcon> = {
  authentic: BadgeCheck,
  warranty: ShieldCheck,
  delivery: Truck,
  support: Headset,
  secure: LockKeyhole,
};

interface TrustBadgeStripProps {
  items: TrustBadgeItem[];
}

export function TrustBadgeStrip({ items }: TrustBadgeStripProps) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = ICONS[item.icon];

        return (
          <li
            key={item.id}
            className="
              flex min-h-12 items-center gap-2.5
              rounded-xl
              border border-border/60
              bg-surface-raised/80
              px-3
              py-2.5
              transition-colors
              hover:border-accent-signal/30
            "
          >
            <span
              className="
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-lg
                bg-accent-signal/10
              "
            >
              <Icon className="h-4 w-4 text-accent-signal" aria-hidden="true" />
            </span>

            <span className="text-xs font-medium leading-4 text-text-muted sm:text-sm">
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

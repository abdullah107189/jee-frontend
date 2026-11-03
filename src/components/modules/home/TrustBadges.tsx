import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    desc: "Carefully packed & fast shipping",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  },
  {
    icon: ShieldCheck,
    title: "100% Genuine Warranty",
    desc: "Active digital verification",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  },
  {
    icon: RotateCcw,
    title: "Easy Claim Process",
    desc: "Online repair & replace service",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "24/7 hotline & technical desk",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
  },
];

export default function TrustBadges() {
  return (
    <section aria-label="Why shop with us" className="mt-3 sm:mt-4 lg:mt-5">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 rounded-xl sm:rounded-2xl border border-border bg-card p-2.5 sm:p-3.5 lg:p-4 shadow-2xs">
        {badges.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-3 shrink-0 ${color}`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-foreground leading-tight truncate sm:whitespace-normal">
                {title}
              </h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight truncate sm:whitespace-normal mt-0.5">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

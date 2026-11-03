import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    desc: "Carefully packaged & insured",
    color: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20",
  },
  {
    icon: ShieldCheck,
    title: "100% Verified Warranty",
    desc: "Activated at time of purchase",
    color: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20",
  },
  {
    icon: RotateCcw,
    title: "Easy Claiming Flow",
    desc: "Repair or replacement online",
    color: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20",
  },
  {
    icon: Headphones,
    title: "24/7 Helpline Support",
    desc: "Dedicated service assistance",
    color: "bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20",
  },
];

export default function TrustBadges() {
  return (
    <section aria-label="Why shop with us" className="mt-3">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/80 bg-card text-card-foreground p-3 shadow-sm lg:grid-cols-4">
        {badges.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="flex items-center gap-3">
            <div className={`rounded-2xl p-3 ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">{title}</h2>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

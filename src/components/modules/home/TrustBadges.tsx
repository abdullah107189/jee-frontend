import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const badges = [
  { icon: Truck, title: "Fast Nationwide Delivery", desc: "Carefully packaged & insured", color: "bg-blue-50 text-blue-600" },
  { icon: ShieldCheck, title: "100% Verified Warranty", desc: "Activated at time of purchase", color: "bg-emerald-50 text-emerald-600" },
  { icon: RotateCcw, title: "Easy Claiming Flow", desc: "Repair or replacement online", color: "bg-amber-50 text-amber-600" },
  { icon: Headphones, title: "24/7 Helpline Support", desc: "Dedicated service assistance", color: "bg-purple-50 text-purple-600" },
];

export default function TrustBadges() {
  return (
    <section aria-label="Why shop with us" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:grid-cols-4">
        {badges.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="flex items-center gap-3">
            <div className={`rounded-2xl p-3 ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

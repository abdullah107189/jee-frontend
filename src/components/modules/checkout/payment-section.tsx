"use client";

import { CheckCircle2, Truck, Wallet } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/Card";
import type { CheckoutFormValues } from "@/app/(public)/checkout/_lib/schema";
import { PlanOption } from "./plan-option";
import { SectionHeading } from "./section-heading";

interface PaymentSectionProps {
  form: UseFormReturn<CheckoutFormValues>;
  paymentPlan?: "COD";
  total: number;
}

export function PaymentSection({
  form,
  paymentPlan = "COD",
  total,
}: PaymentSectionProps) {
  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-5 p-4 sm:p-6">
        <SectionHeading
          icon={Wallet}
          title="Payment Method"
          description="Cash on Delivery available nationwide."
        />

        <div className="space-y-2">
          <PlanOption
            title="Cash on Delivery"
            description={`Pay ৳${total.toLocaleString()} when your package arrives at your doorstep.`}
            icon={Truck}
            selected={paymentPlan === "COD"}
            onSelect={() => form.setValue("paymentPlan", "COD")}
          />
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>পণ্য হাতে পেয়ে টাকা দিন (Cash on Delivery)</span>
        </div>
      </CardContent>
    </Card>
  );
}
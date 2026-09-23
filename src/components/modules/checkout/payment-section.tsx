"use client";

import {
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { CheckoutFormValues } from "@/app/(public)/checkout/_lib/schema";
import { PAYMENT_GATEWAYS } from "@/app/(public)/checkout/_lib/schema";
import { PlanOption } from "./plan-option";
import { SectionHeading } from "./section-heading";

const MERCHANT_NUMBER = "017XXXXXXXX";

interface PaymentSectionProps {
  form: UseFormReturn<CheckoutFormValues>;
  paymentPlan: "COD" | "FULL";
  paymentGateway: "Bkash" | "Rocket" | "Nagad" | undefined;
  total: number;
  advanceAmount: number;
  isVerifying: boolean;
  gatewayVerified: boolean;
  onVerify: () => void;
}

export function PaymentSection({
  form,
  paymentPlan,
  paymentGateway,
  total,
  advanceAmount,
  isVerifying,
  gatewayVerified,
  onVerify,
}: PaymentSectionProps) {
  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-5 p-4 sm:p-6">
        <SectionHeading
          icon={Wallet}
          title="Payment Method"
          description="Choose how you want to pay."
        />

        {/* Payment plans — 2 ta only */}
        <div className="space-y-2">
          <PlanOption
            title="Cash on Delivery"
            description={`Pay ৳${total.toLocaleString()} on delivery`}
            icon={Truck}
            selected={paymentPlan === "COD"}
            onSelect={() => form.setValue("paymentPlan", "COD")}
          />

          <PlanOption
            title="Full Payment"
            description={`Pay ৳${total.toLocaleString()} now — no cash on delivery`}
            icon={CreditCard}
            selected={paymentPlan === "FULL"}
            onSelect={() => form.setValue("paymentPlan", "FULL")}
          />
        </div>

        {/* Gateway — only FULL */}
        {paymentPlan === "FULL" && (
          <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Payment Gateway
            </p>

            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_GATEWAYS.map((gw) => {
                const active = paymentGateway === gw;
                return (
                  <button
                    key={gw}
                    type="button"
                    onClick={() => form.setValue("paymentGateway", gw)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-semibold transition",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {gw}
                  </button>
                );
              })}
            </div>

            {paymentGateway && (
              <div className="rounded-lg bg-primary/5 p-3 text-sm">
                <p className="font-medium">
                  Send{" "}
                  <span className="font-bold text-primary">
                    ৳{advanceAmount.toLocaleString()}
                  </span>{" "}
                  via{" "}
                  <span className="font-semibold text-primary">
                    {paymentGateway}
                  </span>{" "}
                  to:
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums">
                  📱 {MERCHANT_NUMBER}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Full payment — no cash on delivery.
                </p>
              </div>
            )}

            {paymentGateway && !gatewayVerified && (
              <>
                <FormField
                  control={form.control}
                  name="senderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your {paymentGateway} number *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="01XXXXXXXXX"
                          inputMode="tel"
                          className="h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. 8N7A2B1C"
                          className="h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={onVerify}
                  disabled={isVerifying}
                  className="h-11 w-full gap-2 rounded-xl"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Verify Payment
                    </>
                  )}
                </Button>
              </>
            )}

            {gatewayVerified && (
              <div className="flex items-start gap-3 rounded-lg bg-emerald-500/10 p-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Payment verified
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ৳{advanceAmount.toLocaleString()} received via{" "}
                    {paymentGateway}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
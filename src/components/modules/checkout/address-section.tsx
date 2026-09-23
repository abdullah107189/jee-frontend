"use client";

import { MapPin, Truck } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { BdAddressSelector } from "@/components/shared/BdAddressSelector";
import { cn } from "@/lib/utils";
import type { BDAddress } from "@/lib/data/bangladesh";
import type { CheckoutFormValues } from "@/app/(public)/checkout/_lib/schema";
import { SectionHeading } from "./section-heading";

interface AddressSectionProps {
    form: UseFormReturn<CheckoutFormValues>;
    bdAddress: Partial<BDAddress>;
    onBdAddressChange: (value: Partial<BDAddress>) => void;
    deliveryFee: number;
    insideDhaka: boolean;
}

export function AddressSection({
    form,
    bdAddress,
    onBdAddressChange,
    deliveryFee,
    insideDhaka,
}: AddressSectionProps) {
    return (
        <Card className="rounded-xl">
            <CardContent className="space-y-5 p-4 sm:p-6">
                <SectionHeading
                    icon={MapPin}
                    title="Delivery Address"
                    description="Where should we deliver your order?"
                />

                {/* BD structured location */}
                <BdAddressSelector
                    value={bdAddress}
                    onChange={onBdAddressChange}
                    errors={{
                        divisionId: !bdAddress.divisionId ? "Required" : undefined,
                        districtId: !bdAddress.districtId ? "Required" : undefined,
                        upazilaId: !bdAddress.upazilaId ? "Required" : undefined,
                    }}
                />

                {/* Delivery fee hint */}
                {bdAddress.districtId && (
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
                            insideDhaka
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground",
                        )}
                    >
                        <Truck className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            {insideDhaka ? "Inside Dhaka" : "Outside Dhaka District"} —{" "}
                            <span className="font-semibold">৳{deliveryFee}</span> delivery
                        </span>
                    </div>
                )}

                <Separator />

                {/* Contact */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter full name"
                                        className="h-11 rounded-xl"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone *</FormLabel>
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
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="you@example.com"
                                    className="h-11 rounded-xl"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="House / road / area"
                                    className="h-11 rounded-xl"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apartment / Floor (optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Apt, floor, landmark"
                                        className="h-11 rounded-xl"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Zip code (optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="1207"
                                        className="h-11 rounded-xl"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
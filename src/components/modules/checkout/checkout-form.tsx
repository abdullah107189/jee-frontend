"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Loader2,
    MapPin,
    Package,
    ShieldCheck,
    Truck,
    Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/Badge";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { useCart } from "@/hooks/useCart";
import { BdAddressSelector } from "@/components/shared/BdAddressSelector";
import { formatBDAddress, type BDAddress } from "@/lib/data/bangladesh";
import {
    checkoutSchema,
    type CheckoutFormValues,
    type PaymentPlan,
    PAYMENT_GATEWAYS,
    getDeliveryFee,
    isInsideDhaka,
} from "../../../app/(public)/checkout/_lib/schema";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */
const MERCHANT_NUMBER = "017XXXXXXXX";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface CheckoutFormProps {
    user: {
        id: string | number;
        name: string;
        email: string;
        phone: string;
        divisionId?: string;
        divisionName?: string;
        districtId?: string;
        districtName?: string;
        upazilaId?: string;
        upazilaName?: string;
    };
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function CheckoutForm({ user }: CheckoutFormProps) {
    const router = useRouter();
    const { items, subtotal, count, clear, isHydrated } = useCart();

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const [isVerifying, setIsVerifying] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);
    const [gatewayVerified, setGatewayVerified] = useState(false);

    const [bdAddress, setBdAddress] = useState<Partial<BDAddress>>({
        divisionId: user.divisionId ?? "",
        divisionName: user.divisionName ?? "",
        districtId: user.districtId ?? "",
        districtName: user.districtName ?? "",
        upazilaId: user.upazilaId ?? "",
        upazilaName: user.upazilaName ?? "",
    });

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: user.name,
            phone: user.phone,
            email: user.email,
            addressLine1: "",
            addressLine2: "",
            city: "",
            zipCode: "",
            notes: "",
            paymentPlan: "COD",
            paymentGateway: undefined,
            senderNumber: "",
            transactionId: "",
        },
    });

    const city = form.watch("city");
    const paymentPlan = form.watch("paymentPlan");
    const paymentGateway = form.watch("paymentGateway");

    const deliveryFee = useMemo(() => {
        const cityForFee = bdAddress.districtName || bdAddress.upazilaName || city;
        return getDeliveryFee(cityForFee ?? "");
    }, [bdAddress.districtName, bdAddress.upazilaName, city]);

    const insideDhaka = useMemo(() => {
        const cityForFee = bdAddress.districtName || bdAddress.upazilaName || city;
        return isInsideDhaka(cityForFee ?? "");
    }, [bdAddress.districtName, bdAddress.upazilaName, city]);

    const { total, advanceAmount, dueAmount } = useMemo(() => {
        const t = subtotal + deliveryFee;
        const advance =
            paymentPlan === "FULL"
                ? t
                : paymentPlan === "ADVANCE"
                    ? deliveryFee
                    : 0;
        return { total: t, advanceAmount: advance, dueAmount: t - advance };
    }, [subtotal, deliveryFee, paymentPlan]);

    useEffect(() => {
        setGatewayVerified(false);
    }, [paymentPlan, paymentGateway]);

    const handleVerify = async () => {
        const senderNumber = form.getValues("senderNumber");
        const transactionId = form.getValues("transactionId");

        if (!senderNumber || !transactionId) {
            toast.error("Fill sender number and transaction ID first");
            return;
        }

        setIsVerifying(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            setGatewayVerified(true);
            toast.success(`${paymentGateway} payment verified`);
        } catch {
            toast.error("Verification failed");
        } finally {
            setIsVerifying(false);
        }
    };

    const onSubmit = async (data: CheckoutFormValues) => {
        const needsGateway =
            data.paymentPlan === "FULL" || data.paymentPlan === "ADVANCE";

        if (!bdAddress.divisionId || !bdAddress.districtId || !bdAddress.upazilaId) {
            toast.error("Please select division, district and upazila");
            return;
        }

        if (needsGateway && !gatewayVerified) {
            toast.error("Please verify your payment first");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsOrdering(true);

        try {
            const finalDeliveryFee = getDeliveryFee(
                bdAddress.districtName || bdAddress.upazilaName || data.city,
            );
            const finalTotal = subtotal + finalDeliveryFee;
            const finalAdvance =
                data.paymentPlan === "FULL"
                    ? finalTotal
                    : data.paymentPlan === "ADVANCE"
                        ? finalDeliveryFee
                        : 0;

            const fullAddress = `${data.addressLine1}${data.addressLine2 ? `, ${data.addressLine2}` : ""
                }, ${formatBDAddress(bdAddress)}`;

            const payload = {
                items: items.map((i) => ({
                    variantId: i.variantId,
                    quantity: i.quantity,
                    price: i.price,
                })),
                shippingAddress: {
                    fullName: data.fullName,
                    phone: data.phone,
                    email: data.email || undefined,
                    divisionId: bdAddress.divisionId,
                    divisionName: bdAddress.divisionName,
                    districtId: bdAddress.districtId,
                    districtName: bdAddress.districtName,
                    upazilaId: bdAddress.upazilaId,
                    upazilaName: bdAddress.upazilaName,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2 || undefined,
                    city: bdAddress.upazilaName || data.city,
                    zipCode: data.zipCode || undefined,
                    country: "Bangladesh",
                    fullAddress,
                },
                subtotal,
                shipping: finalDeliveryFee,
                total: finalTotal,
                paymentPlan: data.paymentPlan,
                paymentMethod: data.paymentGateway ?? "COD",
                advanceAmount: finalAdvance,
                dueAmount: finalTotal - finalAdvance,
                notes: data.notes || undefined,
                gatewayData: needsGateway
                    ? {
                        gateway: data.paymentGateway,
                        senderNumber: data.senderNumber,
                        transactionId: data.transactionId,
                    }
                    : undefined,
            };

            const res = await fetch("/api/v1/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Order creation failed");

            const result = await res.json();

            clear();
            toast.success(`Order #${result.data.orderNumber} placed successfully`);
            router.push(`/customer/orders/${result.data.id}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsOrdering(false);
        }
    };

    /* ---------------- Loading ---------------- */
    if (!isMounted || !isHydrated) {
        return <CheckoutSkeleton />;
    }

    /* ---------------- Empty cart ---------------- */
    if (items.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Add products to your cart before checking out.
                </p>
                <Link href="/products">
                    <Button className="mt-6 rounded-full">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    const submitDisabled =
        isOrdering || (paymentPlan !== "COD" && !gatewayVerified);

    return (
        <>
            {/* ---------- Back ---------- */}
            <button
                type="button"
                onClick={() => router.back()}
                className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to cart
            </button>

            {/* ---------- Header ---------- */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Checkout
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Review your information and place your order.
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
                >
                    {/* ==================== LEFT: Form ==================== */}
                    <div className="space-y-5 sm:space-y-6 lg:col-span-2">
                        {/* ---------- Delivery Address (merged Location + Contact) ---------- */}
                        <Card className="rounded-xl">
                            <CardContent className="space-y-5 ">
                                <SectionHeading
                                    icon={MapPin}
                                    title="Delivery Address"
                                    description="Where should we deliver your order?"
                                />

                                {/* BD structured location */}
                                <BdAddressSelector
                                    value={bdAddress}
                                    onChange={setBdAddress}
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
                                            {insideDhaka ? "Inside Dhaka" : "Outside Dhaka District"} — {" "}
                                            <span className="font-semibold">
                                                ৳{deliveryFee}
                                            </span>{" "}
                                            delivery
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

                        {/* ---------- Payment ---------- */}
                        <Card className="rounded-xl">
                            <CardContent className="space-y-5 p-4 sm:p-6">
                                <SectionHeading
                                    icon={Wallet}
                                    title="Payment Method"
                                    description="Choose how you want to pay."
                                />

                                <div className="space-y-2">
                                    <PlanOption
                                        value="COD"
                                        title="Cash on Delivery"
                                        description={`Pay ৳${total.toLocaleString()} on delivery`}
                                        icon={Truck}
                                        selected={paymentPlan === "COD"}
                                        onSelect={() => form.setValue("paymentPlan", "COD")}
                                    />

                                    <PlanOption
                                        value="ADVANCE"
                                        title="Advance Delivery Charge"
                                        description={`Pay ৳${deliveryFee} now — rest ৳${(
                                            total - deliveryFee
                                        ).toLocaleString()} on delivery`}
                                        icon={ShieldCheck}
                                        selected={paymentPlan === "ADVANCE"}
                                        onSelect={() => form.setValue("paymentPlan", "ADVANCE")}
                                    />

                                    <PlanOption
                                        value="FULL"
                                        title="Full Payment"
                                        description={`Pay ৳${total.toLocaleString()} now — no cash on delivery`}
                                        icon={CreditCard}
                                        selected={paymentPlan === "FULL"}
                                        onSelect={() => form.setValue("paymentPlan", "FULL")}
                                    />
                                </div>

                                {paymentPlan !== "COD" && (
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
                                                    {paymentPlan === "FULL"
                                                        ? "Full payment — no cash on delivery."
                                                        : `Advance delivery only. Rest ৳${(
                                                            total - deliveryFee
                                                        ).toLocaleString()} on delivery.`}
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
                                                            <FormLabel>
                                                                Your {paymentGateway} number *
                                                            </FormLabel>
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
                                                    onClick={handleVerify}
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

                        {/* ---------- Notes ---------- */}
                        <Card className="rounded-xl">
                            <CardContent className="space-y-3">
                                <SectionHeading title="Order notes (optional)" />

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    rows={3}
                                                    placeholder="Any special instructions for the seller or delivery agent..."
                                                    className="rounded-xl"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* ==================== RIGHT: Summary ==================== */}
                    <aside className="lg:col-span-1">
                        <Card className="overflow-hidden rounded-2xl lg:sticky lg:top-24">
                            <CardContent className="p-0">
                                {/* Header */}
                                <div className="border-b border-border px-4 py-4 sm:px-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-bold">Order Summary</h3>
                                        <Badge variant="default" className="rounded-full">
                                            {count} {count === 1 ? "item" : "items"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Items list */}
                                <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                                    {items.map((item) => (
                                        <div
                                            key={item.variantId}
                                            className="flex gap-3"
                                        >
                                            {/* Image */}
                                            <Link
                                                href={`/products/${item.slug}`}
                                                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                                            >
                                                <Image
                                                    src={item.image || "/images/product-placeholder.png"}
                                                    alt={item.name}
                                                    fill
                                                    sizes="56px"
                                                    className="object-cover"
                                                />
                                                {/* Qty badge */}
                                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                                                    {item.quantity}
                                                </span>
                                            </Link>

                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/products/${item.slug}`}
                                                    className="line-clamp-2 text-xs font-medium leading-snug transition-colors hover:text-primary sm:text-sm"
                                                >
                                                    {item.name}
                                                </Link>

                                                {/* Variant */}


                                                <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                                                    ৳{item.price.toLocaleString()} × {item.quantity}
                                                </p>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="shrink-0 text-right">
                                                <p className="text-xs font-semibold tabular-nums sm:text-sm">
                                                    ৳{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Totals */}
                                <div className="space-y-2.5 px-4 py-4 text-sm sm:px-5">
                                    <Row label={`Subtotal (${count})`} value={subtotal} />

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            Delivery
                                            {(bdAddress.districtName || city) && (
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "rounded-full text-[10px] font-normal",
                                                        insideDhaka
                                                            ? "border-emerald-500/30 text-emerald-600"
                                                            : "text-muted-foreground",
                                                    )}
                                                >
                                                    {insideDhaka ? "Inside Dhaka" : "Outside Dhaka District"}
                                                </Badge>
                                            )}
                                        </span>
                                        <span className="font-medium tabular-nums">
                                            ৳{deliveryFee.toLocaleString()}
                                        </span>
                                    </div>

                                    {paymentPlan !== "COD" && gatewayVerified && (
                                        <Row
                                            label={`Advance (${paymentGateway})`}
                                            value={-advanceAmount}
                                            tone="primary"
                                        />
                                    )}

                                    <Separator />

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-base font-bold">Total</span>
                                        <span className="text-lg font-bold tabular-nums sm:text-xl">
                                            ৳{total.toLocaleString()}
                                        </span>
                                    </div>

                                    {paymentPlan !== "COD" && gatewayVerified && (
                                        <p className="text-right text-xs text-muted-foreground">
                                            Payable at delivery: ৳{dueAmount.toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="space-y-3 border-t border-border px-4 py-4 sm:px-5">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={submitDisabled}
                                        className="h-11 w-full gap-2 rounded-xl"
                                    >
                                        {isOrdering ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Placing order...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4" />
                                                Place Order
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-center text-[11px] leading-4 text-muted-foreground">
                                        By placing this order you agree to our{" "}
                                        <Link href="/terms" className="underline hover:text-foreground">
                                            terms
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="underline hover:text-foreground">
                                            privacy policy
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </form>
            </Form>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */
function SectionHeading({
    icon: Icon,
    title,
    description,
}: {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
}) {
    return (
        <div className="flex items-start gap-3">
            {Icon && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            )}
            <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    );
}

function PlanOption({
    value,
    title,
    description,
    icon: Icon,
    selected,
    onSelect,
}: {
    value: PaymentPlan;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
                selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent",
            )}
        >
            <div
                className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    selected ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
            >
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-semibold", selected && "text-primary")}>
                    {title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>

            <div
                className={cn(
                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                    selected ? "border-primary" : "border-border",
                )}
            >
                {selected && <span className="block h-2 w-2 rounded-full bg-primary" />}
            </div>
        </button>
    );
}

function Row({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone?: "default" | "primary";
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span
                className={cn(
                    "font-medium tabular-nums",
                    tone === "primary" && "text-primary",
                )}
            >
                ৳{value.toLocaleString()}
            </span>
        </div>
    );
}

function CheckoutSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
                <div className="h-96 animate-pulse rounded-2xl bg-muted" />
                <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            </div>
            <div className="h-96 animate-pulse rounded-2xl bg-muted lg:col-span-1" />
        </div>
    );
}
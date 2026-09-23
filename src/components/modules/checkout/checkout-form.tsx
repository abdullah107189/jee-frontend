"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Loader2, Package } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/form";
import { useCart } from "@/hooks/useCart";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { formatBDAddress, type BDAddress } from "@/lib/data/bangladesh";
import {
    checkoutSchema,
    type CheckoutFormValues,
    getDeliveryFee,
    isInsideDhaka,
} from "@/app/(public)/checkout/_lib/schema";
import { createOrderAction } from "@/actions/order.actions";
import { AddressSection } from "./address-section";
import { PaymentSection } from "./payment-section";
import { OrderSummary } from "./order-summary";
import { NotesSection } from "./notes-section";
import { CheckoutSkeleton } from "./checkout-skeleton";

interface CheckoutFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    savedAddress?: {
        fullName?: string;
        phone?: string;
        email?: string;
        divisionId?: string;
        divisionName?: string;
        districtId?: string;
        districtName?: string;
        upazilaId?: string;
        upazilaName?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        zipCode?: string;
        country?: string;
    } | null;
}

export function CheckoutForm({ user, savedAddress }: CheckoutFormProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { items, subtotal, count, isHydrated } = useCart();

    const [isMounted, setIsMounted] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);
    const [gatewayVerified, setGatewayVerified] = useState(false);

    const [bdAddress, setBdAddress] = useState<Partial<BDAddress>>({
        divisionId: savedAddress?.divisionId ?? "",
        divisionName: savedAddress?.divisionName ?? "",
        districtId: savedAddress?.districtId ?? "",
        districtName: savedAddress?.districtName ?? "",
        upazilaId: savedAddress?.upazilaId ?? "",
        upazilaName: savedAddress?.upazilaName ?? "",
    });

    useEffect(() => setIsMounted(true), []);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: savedAddress?.fullName ?? user.name,
            phone: savedAddress?.phone ?? user.phone,
            email: savedAddress?.email ?? user.email,
            addressLine1: savedAddress?.addressLine1 ?? "",
            addressLine2: savedAddress?.addressLine2 ?? "",
            zipCode: savedAddress?.zipCode ?? "",
            notes: "",
            paymentPlan: "COD",
            paymentGateway: undefined,
            senderNumber: "",
            transactionId: "",
        },
    });

    const paymentPlan = form.watch("paymentPlan");
    const paymentGateway = form.watch("paymentGateway");

    const deliveryFee = useMemo(() => {
        const cityForFee = bdAddress.districtName || bdAddress.upazilaName;
        return getDeliveryFee(cityForFee ?? "");
    }, [bdAddress.districtName, bdAddress.upazilaName]);

    const insideDhaka = useMemo(() => {
        const cityForFee = bdAddress.districtName || bdAddress.upazilaName;
        return isInsideDhaka(cityForFee ?? "");
    }, [bdAddress.districtName, bdAddress.upazilaName]);

    const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);
    const advanceAmount = paymentPlan === "FULL" ? total : 0;

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
        // Address validation
        if (
            !bdAddress.divisionId ||
            !bdAddress.districtId ||
            !bdAddress.upazilaId
        ) {
            toast.error("Please select division, district and upazila");
            return;
        }

        // Payment verification (FULL only)
        if (data.paymentPlan === "FULL" && !gatewayVerified) {
            toast.error("Please verify your payment first");
            return;
        }

        // Cart check
        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsOrdering(true);

        try {
            const fullAddress = `${data.addressLine1}${data.addressLine2 ? `, ${data.addressLine2}` : ""
                }, ${formatBDAddress(bdAddress)}`;

            const metadata =
                data.paymentPlan === "FULL"
                    ? {
                        gateway: data.paymentGateway,
                        senderNumber: data.senderNumber,
                        transactionId: data.transactionId,
                        verified: gatewayVerified,
                    }
                    : undefined;

            const fd = new FormData();
            fd.set(
                "items",
                JSON.stringify(
                    items.map((i) => ({
                        variantId: i.variantId,
                        quantity: i.quantity,
                    })),
                ),
            );
            fd.set(
                "shippingAddress",
                JSON.stringify({
                    fullName: data.fullName,
                    phone: data.phone,
                    email: data.email || undefined,
                    division: bdAddress.divisionName,
                    district: bdAddress.districtName,
                    upazila: bdAddress.upazilaName,
                    streetAddress: data.addressLine1,        // ← NEW
                    apartment: data.addressLine2 || undefined, // ← NEW
                    zipCode: data.zipCode || undefined,
                }),
            );
            fd.set("paymentWay", data.paymentPlan);
            fd.set("shipping", String(deliveryFee));
            fd.set("notes", data.notes ?? "");
            if (metadata) fd.set("metadata", JSON.stringify(metadata));

            const result = await createOrderAction(null, fd);
            console.log("[ORDER RESULT]", result);  // ← ADD
            if (!result.success || !result.orderId) {
                toast.error(result.message ?? "Order create failed");
                setIsOrdering(false);
                return;
            }

            dispatch(clearCart());
            toast.success(`Order #${result.orderNumber} placed successfully`);
            router.push(`/customer/orders/${result.orderId}`);
        } catch (error) {
            console.error("[CHECKOUT_ERROR]", error);
            toast.error("Failed to place order. Please try again.");
            setIsOrdering(false);
        }
    };

    if (!isMounted || !isHydrated) {
        return <CheckoutSkeleton />;
    }

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
        isOrdering || (paymentPlan === "FULL" && !gatewayVerified);

    return (
        <>
            <button
                type="button"
                onClick={() => router.back()}
                className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to cart
            </button>

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
                    <div className="space-y-5 sm:space-y-6 lg:col-span-2">
                        <AddressSection
                            form={form}
                            bdAddress={bdAddress}
                            onBdAddressChange={setBdAddress}
                            deliveryFee={deliveryFee}
                            insideDhaka={insideDhaka}
                        />

                        <PaymentSection
                            form={form}
                            paymentPlan={paymentPlan}
                            paymentGateway={paymentGateway}
                            total={total}
                            advanceAmount={advanceAmount}
                            isVerifying={isVerifying}
                            gatewayVerified={gatewayVerified}
                            onVerify={handleVerify}
                        />

                        <NotesSection form={form} />
                    </div>

                    <aside className="lg:col-span-1">
                        <OrderSummary
                            items={items}
                            count={count}
                            subtotal={subtotal}
                            deliveryFee={deliveryFee}
                            total={total}
                            paymentPlan={paymentPlan}
                            insideDhaka={insideDhaka}
                            addressSelected={!!bdAddress.districtId}
                        />

                        <div className="mt-4 space-y-3">
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
                    </aside>
                </form>
            </Form>
        </>
    );
}
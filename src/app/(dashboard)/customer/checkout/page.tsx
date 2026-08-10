// app/(dashboard)/customer/checkout/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; 
import {
  useCreateOrderMutation,
  useVerifyBKashMutation,
} from "@/lib/redux/features/order/orderApi";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '../../../../hooks/use-toast';
import { Loader2, ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useGetCartItemsQuery } from "@/lib/redux/features/cart/cartApi";
import type { CartItem } from "@/lib/types/cart.types";

// Validation Schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^(01)[3-9]\d{8}$/, "Invalid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().optional(),
  notes: z.string().optional(),

  // bKash fields
  bKashNumber: z
    .string()
    .regex(/^(01)[3-9]\d{8}$/, "Invalid bKash number")
    .optional(),
  transactionId: z.string().min(5, "Transaction ID is required").optional(),
  paymentMethod: z.enum(["BKASH", "COD"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isBkashVerified, setIsBkashVerified] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "form" | "verification" | "complete"
  >("form");

  const { data: cartData, isLoading } = useGetCartItemsQuery();
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();
  const [verifyBKash, { isLoading: isVerifying }] = useVerifyBKashMutation();

  const items = (cartData ?? []) as CartItem[];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 100; // with delivery

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  // Verify bKash payment
  const handleVerifyBKash = async (data: {
    bKashNumber: string;
    transactionId: string;
  }) => {
    try {
      const result = await verifyBKash({
        bKashNumber: data.bKashNumber,
        transactionId: data.transactionId,
        amount: 70, // Advance amount
      }).unwrap();

      if (result.data.verified) {
        setIsBkashVerified(true);
        setPaymentStep("verification");
        toast({
          title: "Payment Verified ✅",
          description: "Your bKash payment has been verified",
        });
      } else {
        toast({
          title: "Verification Failed",
          description:
            result.data.message || "Please check your transaction details",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to verify payment",
        variant: "destructive",
      });
    }
  };

  // Submit order
  const onSubmit = async (data: CheckoutFormValues) => {
    // For bKash, must be verified first
    if (data.paymentMethod === "BKASH" && !isBkashVerified) {
      toast({
        title: "Payment Not Verified",
        description: "Please verify your bKash payment first",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = {
        items: items.map((item: CartItem) => ({
          productItemId: item.productItemId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
        },
        paymentMethod: data.paymentMethod,
        bKashData:
          data.paymentMethod === "BKASH"
            ? {
                bKashNumber: data.bKashNumber!,
                transactionId: data.transactionId!,
              }
            : undefined,
        notes: data.notes,
      };

      const result = await createOrder(orderData).unwrap();

      setPaymentStep("complete");

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Order #${result.data.orderNumber}`,
      });

      // Redirect to order details after 2 seconds
      setTimeout(() => {
        router.push(`/customer/orders/${result.data.id}`);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Failed to place order",
        description: error?.data?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (paymentStep === "complete") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Placed! 🎉</h2>
          <p className="text-muted-foreground mb-6">
            Your order has been placed successfully. You will receive a
            confirmation email shortly.
          </p>
          <Button onClick={() => router.push("/customer/orders")}>
            View Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </button>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-lg">Delivery Address</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter full name" />
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
                              placeholder="Enter phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter city" />
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
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter zip code" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full px-3 py-2 border rounded-md resize-none"
                            rows={3}
                            placeholder="Any special instructions..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-lg mb-4">
                      Payment Method
                    </h3>

                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                              <input
                                type="radio"
                                value="BKASH"
                                checked={field.value === "BKASH"}
                                onChange={() => {
                                  field.onChange("BKASH");
                                  setIsBkashVerified(false);
                                  setPaymentStep("form");
                                }}
                                className="w-4 h-4"
                              />
                              <CreditCard className="w-5 h-5 text-green-600" />
                              <span>Pay with bKash (70 BDT Advance)</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                              <input
                                type="radio"
                                value="COD"
                                checked={field.value === "COD"}
                                onChange={() => {
                                  field.onChange("COD");
                                  setIsBkashVerified(false);
                                  setPaymentStep("form");
                                }}
                                className="w-4 h-4"
                              />
                              <span>Cash on Delivery</span>
                            </label>
                          </div>
                        )}
                      />

                      {/* bKash Payment Details */}
                      {paymentMethod === "BKASH" && (
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <p className="text-sm font-medium mb-2">
                            Please send 70 BDT to this bKash number:
                          </p>
                          <p className="text-lg font-bold text-center mb-4">
                            📱 017XXXXXXXX
                          </p>

                          {!isBkashVerified ? (
                            <div className="space-y-3">
                              <FormField
                                control={form.control}
                                name="bKashNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>bKash Number *</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Enter your bKash number"
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
                                        placeholder="Enter transaction ID"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  const bKashNumber =
                                    form.getValues("bKashNumber");
                                  const transactionId =
                                    form.getValues("transactionId");
                                  if (bKashNumber && transactionId) {
                                    handleVerifyBKash({
                                      bKashNumber,
                                      transactionId,
                                    });
                                  } else {
                                    toast({
                                      title: "Missing Information",
                                      description:
                                        "Please fill both bKash number and transaction ID",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                disabled={isVerifying}
                              >
                                {isVerifying ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  "✅ Verify Payment"
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center text-green-600">
                              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-medium">Payment Verified ✅</p>
                              <p className="text-sm text-muted-foreground">
                                Your bKash payment has been verified
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/customer/cart")}
                    >
                      Back to Cart
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={
                        isOrdering ||
                        (paymentMethod === "BKASH" && !isBkashVerified)
                      }
                    >
                      {isOrdering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="space-y-2 max-h-80 overflow-auto">
                {items.map((item : CartItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm py-1"
                  >
                    <span className="truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium whitespace-nowrap">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{(total - 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>৳100</span>
                </div>
                {paymentMethod === "BKASH" && (
                  <div className="flex justify-between text-blue-600">
                    <span>Advance Paid (bKash)</span>
                    <span>-৳70</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ৳
                      {paymentMethod === "BKASH"
                        ? (total - 70).toLocaleString()
                        : total.toLocaleString()}
                    </span>
                  </div>
                  {paymentMethod === "BKASH" && (
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      Payable at delivery: ৳{(total - 70).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// app/(dashboard)/customer/checkout/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; 
import { createOrderAction } from "@/actions/customer.actions";
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
import { useToast } from '../../../../hooks/use-toast';
import { Loader2, ArrowLeft, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import type { CartItem } from "@/lib/types/cart.types";

// Validation Schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^(01)[3-9]\d{8}$/, "Invalid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.literal("COD"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const items = useAppSelector((state) => state.cart.items) as CartItem[];
  const [isOrdering, setIsOrdering] = useState(false);

  const isLoading = useAppSelector((state) => !state.cart.hydrated);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 100; // with delivery

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
    },
  });

  // Submit order
  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setIsOrdering(true);
      const orderData = {
        items: items.map((item: CartItem) => ({
          productItemId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
        },
        paymentMethod: "COD",
        notes: data.notes,
      };

      const result = await createOrderAction(orderData);

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
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading checkout...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Add products before checking out</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link
        href="/cart"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Delivery Information</h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="01XXXXXXXXX"
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City / District *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Dhaka, Chittagong..." />
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
                        <FormLabel>Delivery Address *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="House, Road, Area details"
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
                        <FormLabel>Postal Code (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 1205" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                      <div className="flex items-center gap-3 p-3.5 border rounded-xl bg-muted/40">
                        <Truck className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                          <span className="font-semibold text-sm">Cash on Delivery</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Pay in cash when you receive the product.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs sm:text-sm font-semibold text-emerald-700">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>পণ্য হাতে পেয়ে টাকা দিন</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/cart")}
                    >
                      Back to Cart
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isOrdering}
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
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 text-right mt-1">
                    পণ্য হাতে পেয়ে টাকা দিন
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Terms & Conditions | Your Store",
    description:
        "Read the terms and conditions for shopping at our electronics store.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
                {/* Header */}
                <div className="mb-10">
                    <p className="mb-3 text-sm font-medium text-primary">
                        Legal
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Terms & Conditions
                    </h1>

                    <p className="mt-4 text-muted-foreground">
                        Please read these terms carefully before placing an order
                        with us.
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Last updated: September 20, 2026
                    </p>
                </div>

                <Card>
                    <CardContent className="p-6 sm:p-8">
                        <div className="space-y-10">
                            {/* 1 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    1. About Our Store
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We are an online electronics store offering products
                                    such as smartphones, laptops, computer accessories,
                                    networking equipment, smart devices, and other
                                    electronic products.
                                </p>
                            </section>

                            <Separator />

                            {/* 2 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    2. Orders
                                </h2>

                                <div className="mt-3 space-y-3 leading-7 text-muted-foreground">
                                    <p>
                                        By placing an order through our website, you agree
                                        to provide accurate and complete information.
                                    </p>

                                    <p>
                                        An order is considered successfully placed after
                                        you receive an order confirmation from us.
                                    </p>

                                    <p>
                                        We reserve the right to cancel an order if there
                                        is an inventory issue, pricing error, suspected
                                        fraudulent activity, or other legitimate reason.
                                    </p>
                                </div>
                            </section>

                            <Separator />

                            {/* 3 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    3. Product Information
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We make reasonable efforts to ensure that product
                                    names, descriptions, images, specifications, prices,
                                    and availability are accurate. However, minor
                                    differences may occur between product images and
                                    actual products.
                                </p>
                            </section>

                            <Separator />

                            {/* 4 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    4. Pricing & Payment
                                </h2>

                                <div className="mt-3 space-y-3 leading-7 text-muted-foreground">
                                    <p>
                                        All product prices displayed on our website are
                                        subject to change without prior notice.
                                    </p>

                                    <p>
                                        Available payment methods may include Cash on
                                        Delivery and other payment methods supported by
                                        our checkout system.
                                    </p>

                                    <p>
                                        If a pricing or calculation error is discovered,
                                        we may contact you before processing the order.
                                    </p>
                                </div>
                            </section>

                            <Separator />

                            {/* 5 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    5. Delivery
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Delivery times may vary depending on your location,
                                    product availability, courier service, and other
                                    circumstances. Estimated delivery times are not
                                    guaranteed unless explicitly stated otherwise.
                                </p>
                            </section>

                            <Separator />

                            {/* 6 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    6. Cancellation & Returns
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Order cancellation and return eligibility depend on
                                    the product, order status, and our applicable return
                                    policy. Products must generally be returned in
                                    accordance with the conditions communicated by our
                                    support team.
                                </p>
                            </section>

                            <Separator />

                            {/* 7 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    7. Warranty
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Where applicable, products may include a
                                    manufacturer or seller warranty. Warranty coverage,
                                    duration, exclusions, and claim procedures depend on
                                    the specific product.
                                </p>
                            </section>

                            <Separator />

                            {/* 8 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    8. Account Responsibility
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    If you create an account, you are responsible for
                                    maintaining the confidentiality of your account
                                    information and for activities performed through
                                    your account.
                                </p>
                            </section>

                            <Separator />

                            {/* 9 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    9. Prohibited Use
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    You must not use our website for fraudulent
                                    activities, unauthorized access, abuse of our
                                    services, interference with the website, or any
                                    activity that violates applicable law.
                                </p>
                            </section>

                            <Separator />

                            {/* 10 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    10. Changes to These Terms
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We may update these Terms & Conditions from time to
                                    time. Updated terms will be published on this page
                                    with a revised effective date.
                                </p>
                            </section>

                            <Separator />

                            {/* Contact */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    Contact Us
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    If you have questions about these terms, please
                                    contact our customer support team.
                                </p>

                                <Link
                                    href="/contact"
                                    className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                                >
                                    Contact Support →
                                </Link>
                            </section>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

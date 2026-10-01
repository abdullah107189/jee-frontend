import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Privacy Policy | Your Store",
    description:
        "Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
                {/* Header */}
                <div className="mb-10">
                    <p className="mb-3 text-sm font-medium text-primary">
                        Legal
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-4 text-muted-foreground">
                        Your privacy matters to us. This policy explains how we
                        collect, use, and protect your information.
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
                                    1. Information We Collect
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    When you use our website or place an order, we may
                                    collect information necessary to provide our
                                    services.
                                </p>

                                <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                                    <li>Name and contact information</li>
                                    <li>Delivery and billing address</li>
                                    <li>Phone number and email address</li>
                                    <li>Order and purchase information</li>
                                    <li>Account information</li>
                                    <li>Information you provide when contacting support</li>
                                </ul>
                            </section>

                            <Separator />

                            {/* 2 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    2. How We Use Your Information
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We use collected information to operate and improve
                                    our services, including:
                                </p>

                                <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                                    <li>Processing and delivering orders</li>
                                    <li>Managing your customer account</li>
                                    <li>Providing customer support</li>
                                    <li>Processing payments</li>
                                    <li>Sending order-related notifications</li>
                                    <li>Improving our products and services</li>
                                    <li>Preventing fraud and unauthorized activity</li>
                                </ul>
                            </section>

                            <Separator />

                            {/* 3 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    3. Payment Information
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Depending on the payment method you choose, payment
                                    information may be processed by the relevant payment
                                    provider. We do not retain sensitive payment
                                    credentials unless necessary and legally permitted
                                    for the operation of the service.
                                </p>
                            </section>

                            <Separator />

                            {/* 4 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    4. Cookies & Similar Technologies
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Our website may use cookies and similar technologies
                                    to keep you signed in, remember preferences,
                                    maintain shopping functionality, understand website
                                    usage, and improve the user experience.
                                </p>
                            </section>

                            <Separator />

                            {/* 5 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    5. Information Sharing
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We may share necessary information with trusted
                                    service providers such as delivery partners, payment
                                    processors, technology providers, and customer
                                    support services when required to provide our
                                    services.
                                </p>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We do not sell your personal information as a
                                    product to third parties.
                                </p>
                            </section>

                            <Separator />

                            {/* 6 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    6. Data Security
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We use reasonable technical and organizational
                                    measures to protect your information from
                                    unauthorized access, misuse, alteration, or
                                    disclosure. However, no internet-based service can
                                    guarantee absolute security.
                                </p>
                            </section>

                            <Separator />

                            {/* 7 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    7. Data Retention
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We retain information for as long as necessary to
                                    provide our services, maintain business records,
                                    resolve disputes, comply with legal obligations, and
                                    enforce our agreements.
                                </p>
                            </section>

                            <Separator />

                            {/* 8 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    8. Your Rights
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Depending on applicable law, you may have rights
                                    regarding access, correction, deletion, or other
                                    processing of your personal information.
                                </p>
                            </section>

                            <Separator />

                            {/* 9 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    9. Children's Privacy
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Our services are not intentionally designed to
                                    collect personal information from children without
                                    appropriate authorization.
                                </p>
                            </section>

                            <Separator />

                            {/* 10 */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    10. Changes to This Privacy Policy
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    We may update this Privacy Policy when our services,
                                    practices, or legal requirements change. The latest
                                    version will always be published on this page.
                                </p>
                            </section>

                            <Separator />

                            {/* Contact */}
                            <section>
                                <h2 className="text-xl font-semibold">
                                    Contact Us
                                </h2>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    If you have questions about this Privacy Policy or
                                    how your information is handled, please contact our
                                    support team.
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

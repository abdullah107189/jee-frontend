import type { Metadata } from "next";
import { auth } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Seller Dashboard | JEE",
};

export default async function SellerDashboardPage() {
    const user = await auth();
    if (!user) redirect("/login");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
                <p className="text-muted-foreground">
                    Manage your sales, warranties and profile from here.
                </p>
            </div>

            {/* Dashboard cards / stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">—</p>
                </div>
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Active Warranties</p>
                    <p className="text-2xl font-bold">—</p>
                </div>
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Pending Claims</p>
                    <p className="text-2xl font-bold">—</p>
                </div>
            </div>
        </div>
    );
}
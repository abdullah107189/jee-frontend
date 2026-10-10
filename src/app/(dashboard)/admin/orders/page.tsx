import type { Metadata } from "next";
import { AdminOrdersList } from "@/components/modules/admin/orders/admin-orders-list";
import { getAdminOrders } from "@/services/order.service";

export const metadata: Metadata = {
  title: "Orders Management | JEE Admin",
  description: "Manage, track and update customer and online store orders.",
};

interface AdminOrdersPageProps {
  searchParams?: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const status = resolvedParams.status;
  const search = resolvedParams.search;
  const page = Number(resolvedParams.page) || 1;

  const { orders, total, totalPages } = await getAdminOrders({
    status,
    search,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            Orders Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor, update order progression, and view sales details
          </p>
        </div>
      </div>

      <AdminOrdersList
        orders={orders}
        total={total}
        page={page}
        totalPages={totalPages}
        initialStatus={status ?? "all"}
        initialSearch={search ?? ""}
      />
    </div>
  );
}

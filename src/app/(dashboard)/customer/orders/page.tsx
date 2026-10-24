import type { Metadata } from "next";
import { OrdersList } from "@/components/modules/customer/orders/OrdersList";
import { getCustomerOrders } from "@/services/order.service";

export const metadata: Metadata = {
  title: "My Orders | JEE Store",
  description: "View and track all your orders and warranty information",
};

interface OrdersPageProps {
  searchParams?: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const status = resolvedParams.status;
  const search = resolvedParams.search;
  const page = Number(resolvedParams.page) || 1;

  const { orders, total } = await getCustomerOrders({
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
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track, manage, and view your purchase history
          </p>
        </div>
      </div>

      <OrdersList
        orders={orders}
        total={total}
        initialStatus={status ?? "all"}
        initialSearch={search ?? ""}
      />
    </div>
  );
}
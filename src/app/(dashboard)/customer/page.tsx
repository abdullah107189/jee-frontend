
import { Metadata } from 'next';
import { DashboardStats } from '@/components/customer/dashboard/DashboardStats';
import { RecentOrders } from '@/components/customer/dashboard/RecentOrders';
import { ActiveWarranties } from '@/components/customer/dashboard/ActiveWarranties';
import { getCustomerOrders, getCustomerStats, getCustomerWarranties } from '@/services/customer.service';

export const metadata: Metadata = {
  title: 'My Dashboard | TechStore',
  description: 'View your orders, warranties and account activity',
};

export default async function CustomerDashboardPage() {
  const [stats, orders, warranties] = await Promise.all([
    getCustomerStats(),
    getCustomerOrders(),
    getCustomerWarranties({ status: 'ACTIVE' }),
  ]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section - Server Component */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back! 👋</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your orders
          </p>
        </div>
        <a href="/products">
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
            <span className="mr-2">🛒</span>
            Continue Shopping
          </button>
        </a>
      </div>

      {/* Stats - Client Component for interactivity */}
      <DashboardStats stats={stats} />

      {/* Recent Orders & Warranties - Client Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RecentOrders orders={orders.slice(0, 3)} />
        <ActiveWarranties warranties={warranties.slice(0, 3)} />
      </div>
    </div>
  );
}
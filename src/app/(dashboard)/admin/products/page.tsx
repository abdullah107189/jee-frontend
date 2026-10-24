import ProductsListContent from "@/components/modules/admin/products/ProductsListContent";
import { adminProductService } from "@/services/admin/product.service";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  const res = await adminProductService.getAdminProducts({
    page: Number(sp.page) || 1,
    limit: 20,
    search: sp.search,
    status: sp.status,
    active: sp.active,
    stock: sp.stock,
    sort: sp.sort,
  });

  return (
    <ProductsListContent
      products={res.data}
      meta={res.meta}
      initialFilters={{
        search: sp.search ?? "",
        status: sp.status ?? "all",
        active: sp.active ?? "all",
        stock: sp.stock ?? "all",
        sort: sp.sort ?? "newest",
      }}
    />
  );
}
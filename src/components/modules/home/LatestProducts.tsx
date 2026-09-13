import { getProducts } from "@/services/product.service";
import LatestProductsClient from "./LatestProductsClient";

export default async function LatestProducts() {
  const latestResponse = await getProducts({
    limit: 3,
    isPublished: true,
    isActive: true,
  });

  return <LatestProductsClient products={latestResponse.data} />;
}

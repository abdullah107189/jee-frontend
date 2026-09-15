 
import { productService } from "@/services/product.service";
import LatestProductsClient from "./LatestProductsClient";

export default async function LatestProducts() {
  const latestResponse = await productService.getProducts({
    limit: 3,
    isPublished: true,
    isActive: true,
  });

  return <LatestProductsClient products={latestResponse.data} />;
}

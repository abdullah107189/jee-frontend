import { ProductDetails } from "@/components/modules/products/productDetails/product-details"; 
import { productService } from "@/services/product.service";
import { notFound } from "next/navigation";
 

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  // const product = await productService.getProductDetailsBySlug(slug);
  const product = {};

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      
      <ProductDetails product={product} />
    </main>
  );
}
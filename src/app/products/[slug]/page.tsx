import { ProductDetails } from "@/components/products/productDetails/product-details";
import { productsData } from "@/dammyData/products";
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

  const product = productsData.find(
    (item) =>
      item.slug === slug &&
      item.isPublished &&
      item.isActive
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      
      <ProductDetails product={product} />
    </main>
  );
}
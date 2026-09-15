import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/modules/products/productDetails/product-details";
import { productServices } from "@/services/product.service"; 

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/* -------------------------------------------------------------------------- */
/* Metadata — dynamic SEO per product                                         */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productServices.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const title = product.name;
  const description =
    product.description?.slice(0, 160) ??
    `Buy ${product.name} online in Bangladesh with verified warranty.`;

  const image = product.images[0];

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand?.name ?? "",
      product.category?.name ?? "",
      "buy online bangladesh",
      "authentic product",
    ].filter(Boolean),
    openGraph: {
      type: "website",
      title,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined,
      siteName: "JEE",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Page — Server Component (SSR)                                              */
/* -------------------------------------------------------------------------- */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await productServices.getProductBySlug(slug);

  if (!product || !product.isPublished || !product.isActive) {
    notFound();
  }

  /* ---------------- JSON-LD for rich results ---------------- */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? "",
    image: product.images,
    sku: product.variants[0]?.sku ?? product.id,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand.name }
      : undefined,
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: `https://jeestore.com/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.comparePrice && product.comparePrice > product.price
      ? {
          aggregateRating: undefined,
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-background">
        <ProductDetails product={product} />
      </main>
    </>
  );
}

import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import { VariantSelector } from "./variant-selector";
import { ProductSpecifications } from "./product-specifications";
import { ProductGallery } from "./product-gallery";
import Breadcrumb from "@/components/shared/Breadcrumb";

type ProductDetailsProps = {
  product: any;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const defaultVariant =
    product.variants.find((variant: any) => variant.isDefault) ??
    product.variants[0];

  if (!defaultVariant) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">
          This product currently has no available variant.
        </p>
      </div>
    );
  }

  const discount =
    defaultVariant.comparePrice &&
    defaultVariant.comparePrice > defaultVariant.price
      ? Math.round(
          ((defaultVariant.comparePrice - defaultVariant.price) /
            defaultVariant.comparePrice) *
            100,
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Breadcrumb></Breadcrumb>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* LEFT */}
        <ProductGallery
          images={defaultVariant.images}
          productName={product.name}
        />

        {/* RIGHT */}
        <div className="flex flex-col">
          {/* Brand */}
          <p className="mb-2 text-sm font-medium text-primary">
            {product.brandId}
          </p>

          {/* Product name */}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          {/* Description */}
          {product.description && (
            <p className="mt-4 leading-7 text-muted-foreground">
              {product.description}
            </p>
          )}

          <Separator className="my-6" />

          {/* Price */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">
              ৳{Number(defaultVariant.price).toLocaleString()}
            </span>

            {defaultVariant.comparePrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ৳{Number(defaultVariant?.comparePrice)?.toLocaleString()}
                </span>

                {discount > 0 && (
                  <Badge variant="destructive">{discount}% OFF</Badge>
                )}
              </>
            )}
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Price includes applicable taxes unless stated otherwise.
          </p>

          <Separator className="my-6" />

          {/* Variant */}
          <VariantSelector
            variants={product.variants}
            defaultVariantId={defaultVariant.id}
          />

          {/* Purchase */}
          <div className="mt-6">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Availability</span>

                <Badge variant="outline">In Stock</Badge>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex-1 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Add to Cart
                </button>

                <button className="flex-1 rounded-lg border px-5 py-3 text-sm font-semibold transition hover:bg-muted">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Warranty */}
          <div className="mt-6 rounded-xl border p-4">
            <h3 className="font-semibold">Warranty</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {product.warrantyMonths} months warranty
            </p>

            {product.warrantyTerms && (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {product.warrantyTerms}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <section className="mt-12 lg:mt-16">
        <ProductSpecifications specifications={product.specifications} />
      </section>
    </div>
  );
}

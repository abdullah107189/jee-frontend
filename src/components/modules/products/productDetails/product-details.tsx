import { ProductDetail } from "@/lib/types/product.types";
import { ProductGallery } from "./product-gallery";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/Badge";
import { VariantSelector } from "./variant-selector";
import { ProductSpecifications } from "./product-specifications";
import Breadcrumb from "@/components/shared/Breadcrumb";

interface ProductDetailsProps {
  product: ProductDetail;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  // default variant — age jeta chilo, but typed
  const defaultVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];

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
    <div className="mxw">
      {/* Breadcrumb — pore add korba */}
      <div className="md:mb-6 mb-3 text-sm">
        <Breadcrumb name={product?.name}></Breadcrumb>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* LEFT — Gallery */}
        <ProductGallery
          images={defaultVariant.images}
          productName={product.name}
        />

        {/* RIGHT — Info */}
        <div className="flex flex-col">
          {/* Brand */}
          {product.brand && (
            <p className="mb-2 text-sm font-medium text-primary">
              {product.brand.name}
            </p>
          )}

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
              ৳{defaultVariant.price.toLocaleString()}
            </span>

            {defaultVariant.comparePrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ৳{defaultVariant.comparePrice.toLocaleString()}
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

          {/* Variant selector */}
          <VariantSelector
            variants={product.variants}
            defaultVariantId={defaultVariant.id}
          />

          {/* Purchase */}
          <div className="mt-6 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Availability</span>

              <Badge
                variant={defaultVariant.inStock ? "outline" : "destructive"}
              >
                {defaultVariant.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={!defaultVariant.inStock}
                className="flex-1 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                Add to Cart
              </button>

              <button
                type="button"
                disabled={!defaultVariant.inStock}
                className="flex-1 rounded-lg border px-5 py-3 text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
              >
                Buy Now
              </button>
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

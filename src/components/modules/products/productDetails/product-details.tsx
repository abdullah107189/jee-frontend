"use client";

import { useMemo, useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Check,
  Bell,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/components/shared/Breadcrumb";

import { ProductGallery } from "./product-gallery";
import { VariantSelector } from "./variant-selector";
import { ProductSpecifications } from "./product-specifications";
import { RelatedProducts } from "./related-products";

import type {
  ProductCardData,
  ProductDetail,
  ProductVariantDetail,
} from "@/lib/types/product.types";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

interface ProductDetailsProps {
  product: ProductDetail;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const dispatch = useAppDispatch();

  /* ---------- Default variant ---------- */
  const initialVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];

  /* ---------- Selected variant state ---------- */
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDetail>(initialVariant);

  /* ---------- Quantity state ---------- */
  const [stockQuantity, setStockQuantity] = useState(1);

  if (!initialVariant) {
    return (
      <div className="container-page py-16">
        <p className="text-muted-foreground">
          This product currently has no available variant.
        </p>
      </div>
    );
  }

  /* ---------- Derived values from selected variant ---------- */
  const inStock = selectedVariant.inStock ?? selectedVariant.stockQuantity > 0;

  const discount =
    selectedVariant.comparePrice &&
    selectedVariant.comparePrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.comparePrice - selectedVariant.price) /
            selectedVariant.comparePrice) *
            100,
        )
      : 0;

  /* ---------- Gallery images ---------- */
  const galleryImages = useMemo(
    () =>
      selectedVariant.images?.length ? selectedVariant.images : product.images,
    [selectedVariant, product.images],
  );

  /* ---------- Variant change ---------- */
  const handleVariantChange = (variant: ProductVariantDetail) => {
    setSelectedVariant(variant);

    // নতুন variant select করলে quantity আবার 1 হবে
    setStockQuantity(1);
  };

  /* ---------- Add to cart ---------- */

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: selectedVariant.id,
        slug: product.slug,
        name: product.name,
        price: selectedVariant.price,
        image:
          selectedVariant.images?.[0] ||
          product.images?.[0] ||
          "/product-placeholder.jpg",
        warrantyMonths: product.warrantyMonths,
        stockQuantity,
        maxQuantity: selectedVariant.stockQuantity,
      }),
    );

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container-page">
      {/* Breadcrumb */}
      <div className="mb-3 text-xs sm:text-sm md:mb-6">
        <Breadcrumb name={product.name} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-12">
        {/* ==================== LEFT: Gallery ==================== */}
        <ProductGallery
          key={selectedVariant.id}
          images={galleryImages}
          productName={product.name}
        />

        {/* ==================== RIGHT: Info ==================== */}
        <div className="flex flex-col">
          {/* Brand + Stock */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            {product.brand && (
              <p className="text-xs text-muted-foreground sm:text-sm">
                Brand:{" "}
                <span className="font-bold text-foreground">
                  {product.brand.name}
                </span>
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Add to wishlist"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <Badge
                variant={inStock ? "outline" : "destructive"}
                className="text-[10px] sm:text-xs"
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-2xl font-bold text-primary sm:text-3xl">
              ৳{selectedVariant.price.toLocaleString()}
            </span>

            {selectedVariant.comparePrice && (
              <>
                <span className="text-base text-muted-foreground line-through sm:text-lg">
                  ৳{selectedVariant.comparePrice.toLocaleString()}
                </span>

                {discount > 0 && (
                  <Badge variant="destructive" className="text-xs font-bold">
                    -{discount}%
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground sm:line-clamp-4">
              {product.description}
            </p>
          )}

          <Separator className="my-4 sm:my-6" />

          {/* Variant Selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariant.id}
            onVariantChange={handleVariantChange}
          />

          {/* Quantity + Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
            <QuantitySelector
              max={selectedVariant.stockQuantity}
              value={stockQuantity}
              onChange={setStockQuantity}
            />

            {inStock ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11 min-w-[140px] flex-1 gap-2 rounded-full border-primary text-primary hover:bg-primary/10 sm:h-12"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add To Cart
                </Button>

                <Button
                  type="button"
                  size="lg"
                  className="h-11 min-w-[140px] flex-1 gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 sm:h-12"
                >
                  <Zap className="h-4 w-4" />
                  Buy Now
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled
                  className="h-11 min-w-[140px] flex-1 gap-2 rounded-full border-destructive/40 text-destructive sm:h-12"
                >
                  Out of Stock
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11 min-w-[140px] flex-1 gap-2 rounded-full sm:h-12"
                >
                  <Bell className="h-4 w-4" />
                  Notify Me
                </Button>
              </>
            )}
          </div>

          {/* Warranty */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:p-4">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 sm:h-5 sm:w-5" />

            <div>
              <p className="text-xs font-semibold sm:text-sm">
                {product.warrantyMonths >= 12
                  ? `${Math.floor(product.warrantyMonths / 12)} Year(s) Warranty`
                  : `${product.warrantyMonths} Month(s) Warranty`}
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                {product.warrantyTerms ??
                  "Official manufacturer warranty included."}
              </p>
            </div>
          </div>

          {/* Variant summary */}
          {Object.keys(selectedVariant.attributes ?? {}).length > 0 && (
            <p className="mt-3 text-[11px] text-muted-foreground sm:text-xs">
              SKU: <span className="font-mono">{selectedVariant.sku}</span>
            </p>
          )}
        </div>
      </div>

      {/* ==================== Tabs + Related ==================== */}
      <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-[1fr_300px] lg:gap-8 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="flex h-auto w-full justify-start gap-0 overflow-x-auto rounded-none border-b border-border bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <TabTrigger value="description" label="Description" />
              <TabTrigger value="specification" label="Specification" />
              <TabTrigger value="reviews" label="Reviews" count={0} />
              <TabTrigger value="questions" label="Questions" count={0} />
            </TabsList>

            <TabsContent value="description" className="mt-4 sm:mt-6">
              <h2 className="mb-3 text-base font-bold sm:text-lg">
                Description
              </h2>

              <DescriptionContent
                description={product.description}
                specifications={product.specifications}
              />
            </TabsContent>

            <TabsContent value="specification" className="mt-4 sm:mt-6">
              <ProductSpecifications specifications={product.specifications} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 sm:mt-6">
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            </TabsContent>

            <TabsContent value="questions" className="mt-4 sm:mt-6">
              <p className="text-sm text-muted-foreground">No questions yet.</p>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <RelatedProducts products={product.relatedProducts ?? []} />
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function TabTrigger({
  value,
  label,
  count,
}: {
  value: string;
  label: string;
  count?: number;
}) {
  return (
    <TabsTrigger
      value={value}
      className="flex-shrink-0 rounded-none border-b-2 border-transparent px-3 py-2.5 text-xs font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:px-4 sm:text-sm"
    >
      {label}

      {typeof count === "number" && (
        <span className="text-muted-foreground"> ({count})</span>
      )}
    </TabsTrigger>
  );
}

/* -------------------------------------------------------------------------- */
/* Quantity Selector                                                          */
/* -------------------------------------------------------------------------- */

function QuantitySelector({
  max,
  value,
  onChange,
}: {
  max: number;
  value: number;
  onChange: (stockQuantity: number) => void;
}) {
  const decrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const isDecreaseDisabled = value <= 1;
  const isIncreaseDisabled = value >= max || max <= 0;

  return (
    <div className="flex h-11 items-center rounded-full border border-border sm:h-12">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={decrease}
        disabled={isDecreaseDisabled}
        className="flex h-full cursor-pointer w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:w-10"
      >
        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>

      <span
        aria-live="polite"
        className="min-w-7 select-none text-center text-sm font-semibold sm:min-w-8"
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={increase}
        disabled={isIncreaseDisabled}
        className="flex h-full cursor-pointer w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:w-10"
      >
        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
}

function DescriptionContent({
  description,
  specifications,
}: {
  description: string | null;
  specifications: Record<string, unknown> | null;
}) {
  const bullets = specifications
    ? Object.entries(specifications).map(([k, v]) => `${k}: ${String(v)}`)
    : [];

  return (
    <div className="space-y-2 text-sm leading-7 text-muted-foreground">
      {description && <p>{description}</p>}

      {bullets.length > 0 && (
        <ul className="mt-3 list-inside list-disc space-y-1.5">
          {bullets.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      {!description && bullets.length === 0 && <p>No description available.</p>}
    </div>
  );
}

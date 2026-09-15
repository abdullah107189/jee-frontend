"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Types — matches backend `ProductVariantDetail`                             */
/* -------------------------------------------------------------------------- */
export type Variant = {
  id: string;
  sku?: string;
  attributes: Record<string, string | number | boolean | null>;
  price: number;
  comparePrice?: number | null;    // ✅ null allowed
  images?: string[];
  isDefault?: boolean;
  stockQuantity?: number;
  inStock?: boolean;
};

type VariantSelectorProps = {
  variants: Variant[];
  defaultVariantId: string;
  onVariantChange?: (variant: Variant) => void;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * Check whether a candidate variant is compatible with the current selection
 * on all attributes except the one being filtered.
 */
function isCompatible(
  candidate: Variant,
  selected: Variant | undefined,
  excludeKey: string,
): boolean {
  if (!selected) return true;

  return Object.entries(selected.attributes ?? {}).every(
    ([key, value]) =>
      key === excludeKey || candidate.attributes?.[key] === value,
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function VariantSelector({
  variants,
  defaultVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] =
    useState(defaultVariantId);

  /* ---------------- Attribute groups ---------------- */
  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};

    variants.forEach((variant) => {
      Object.entries(variant.attributes ?? {}).forEach(([key, value]) => {
        if (value == null) return;

        const strValue = String(value);

        if (!groups[key]) groups[key] = [];
        if (!groups[key].includes(strValue)) {
          groups[key].push(strValue);
        }
      });
    });

    return groups;
  }, [variants]);

  /* ---------------- Selected variant ---------------- */
  const selectedVariant = variants.find(
    (v) => v.id === selectedVariantId,
  );

  /* ---------------- Handlers ---------------- */
  const handleSelect = (variant: Variant) => {
    setSelectedVariantId(variant.id);
    onVariantChange?.(variant);
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="space-y-6">
      {Object.entries(attributeGroups).map(([attributeName, values]) => {
        const selectedValue = selectedVariant?.attributes?.[attributeName];

        return (
          <div key={attributeName}>
            <Label className="mb-3 block capitalize">
              {attributeName}:{" "}
              <span className="font-normal text-muted-foreground">
                {String(selectedValue ?? "")}
              </span>
            </Label>

            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                // Find a variant that matches this value
                // AND is compatible with the current selection on other attributes
                const matchingVariant = variants.find(
                  (variant) =>
                    String(variant.attributes?.[attributeName]) === value &&
                    isCompatible(variant, selectedVariant, attributeName),
                );

                const active = String(selectedValue) === value;

                return (
                  <Button
                    key={value}
                    type="button"
                    variant={active ? "default" : "outline"}
                    disabled={!matchingVariant}
                    onClick={() => {
                      if (matchingVariant) handleSelect(matchingVariant);
                    }}
                    className={cn(
                      "capitalize",
                      active && "ring-2 ring-primary/20",
                    )}
                  >
                    {value}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
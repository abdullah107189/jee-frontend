"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ProductVariantDetail } from "@/lib/types/product.types";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
export type Variant = ProductVariantDetail;

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string;
  onVariantChange: (variant: Variant) => void;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
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
  selectedVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  /* ---------------- Attribute groups ---------------- */
  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};

    variants.forEach((variant) => {
      Object.entries(variant.attributes ?? {}).forEach(([key, value]) => {
        if (value == null) return;

        const strValue = String(value);

        if (!groups[key]) groups[key] = [];
        if (!groups[key].includes(strValue)) groups[key].push(strValue);
      });
    });

    return groups;
  }, [variants]);

  const handleSelect = (variant: Variant) => {
    if (variant.id !== selectedVariantId) {
      onVariantChange(variant);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {Object.entries(attributeGroups).map(([attributeName, values]) => {
        const selectedValue = selectedVariant?.attributes?.[attributeName];

        return (
          <div key={attributeName}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
              {attributeName}:{" "}
              <span className="font-normal text-foreground">
                {String(selectedValue ?? "—")}
              </span>
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {values.map((value) => {
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
                    size="sm"
                    disabled={!matchingVariant}
                    onClick={() =>
                      matchingVariant && handleSelect(matchingVariant)
                    }
                    className={cn(
                      "h-8 rounded-full px-3 text-xs font-medium capitalize sm:h-9 sm:px-4",
                      active && "shadow-sm",
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

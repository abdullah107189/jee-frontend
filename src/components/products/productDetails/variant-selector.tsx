"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";

type Variant = {
  id: string;
  price: number;
  comparePrice?: number;
  attributes: Record<string, string>;
};

type VariantSelectorProps = {
  variants: Variant[];
  defaultVariantId: string;
};

export function VariantSelector({
  variants,
  defaultVariantId,
}: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] =
    useState(defaultVariantId);

  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};

    variants.forEach((variant) => {
      Object.entries(variant.attributes).forEach(
        ([key, value]) => {
          if (!groups[key]) {
            groups[key] = [];
          }

          if (!groups[key].includes(value)) {
            groups[key].push(value);
          }
        }
      );
    });

    return groups;
  }, [variants]);

  const selectedVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );

  return (
    <div className="space-y-6">
      {Object.entries(attributeGroups).map(
        ([attributeName, values]) => {
          const selectedValue =
            selectedVariant?.attributes?.[attributeName];

          return (
            <div key={attributeName}>
              <Label className="mb-3 block capitalize">
                {attributeName}:{" "}
                <span className="font-normal text-muted-foreground">
                  {selectedValue}
                </span>
              </Label>

              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const matchingVariant = variants.find(
                    (variant) =>
                      variant.attributes?.[attributeName] ===
                        value &&
                      Object.entries(
                        selectedVariant?.attributes ?? {}
                      ).every(
                        ([key, selectedValue]) =>
                          key === attributeName ||
                          variant.attributes?.[key] ===
                            selectedValue
                      )
                  );

                  const active =
                    selectedValue === value;

                  return (
                    <Button
                      key={value}
                      type="button"
                      variant={active ? "default" : "outline"}
                      disabled={!matchingVariant}
                      onClick={() => {
                        if (matchingVariant) {
                          setSelectedVariantId(
                            matchingVariant.id
                          );
                        }
                      }}
                    >
                      {value}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

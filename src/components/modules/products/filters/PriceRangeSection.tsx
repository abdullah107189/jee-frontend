"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";

interface PriceRangeSectionProps {
  priceRange: [number, number];
  maxPrice: number;
  onPriceChange: (range: [number, number]) => void;
  debounceMs?: number;
}

export function PriceRangeSection({
  priceRange,
  maxPrice,
  onPriceChange,
  debounceMs = 1000,
}: PriceRangeSectionProps) {
  const [minInput, setMinInput] = useState(
    String(priceRange[0]),
  );

  const [maxInput, setMaxInput] = useState(
    String(priceRange[1]),
  );

  const isTypingRef = useRef(false);

  /* ------------------------------------------------------------------------ */
  /* Sync URL / external price → inputs                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (isTypingRef.current) return;

    setMinInput(String(priceRange[0]));
    setMaxInput(String(priceRange[1]));
  }, [priceRange]);

  /* ------------------------------------------------------------------------ */
  /* Debounce                                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isTypingRef.current) return;

    const timer = setTimeout(() => {
      const min =
        minInput === ""
          ? 0
          : Number(minInput);

      const max =
        maxInput === ""
          ? maxPrice
          : Number(maxInput);

      if (
        Number.isNaN(min) ||
        Number.isNaN(max)
      ) {
        return;
      }

      /*
       * Don't allow min > max.
       */
      const safeMin = Math.max(
        0,
        Math.min(min, max),
      );

      const safeMax = Math.min(
        maxPrice,
        Math.max(max, safeMin),
      );

      /*
       * Don't query if nothing changed.
       */
      if (
        safeMin === priceRange[0] &&
        safeMax === priceRange[1]
      ) {
        return;
      }

      onPriceChange([
        safeMin,
        safeMax,
      ]);

      isTypingRef.current = false;
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [
    minInput,
    maxInput,
    maxPrice,
    priceRange,
    onPriceChange,
    debounceMs,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Min                                                                       */
  /* ------------------------------------------------------------------------ */

  const handleMinChange = (
    value: string,
  ) => {
    // Digits only
    if (
      value !== "" &&
      !/^\d+$/.test(value)
    ) {
      return;
    }

    isTypingRef.current = true;

    setMinInput(value);
  };

  /* ------------------------------------------------------------------------ */
  /* Max                                                                       */
  /* ------------------------------------------------------------------------ */

  const handleMaxChange = (
    value: string,
  ) => {
    // Digits only
    if (
      value !== "" &&
      !/^\d+$/.test(value)
    ) {
      return;
    }

    isTypingRef.current = true;

    setMaxInput(value);
  };

  /* ------------------------------------------------------------------------ */
  /* Min blur                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleMinBlur = () => {
    const value =
      minInput === ""
        ? 0
        : Number(minInput);

    const max =
      maxInput === ""
        ? maxPrice
        : Number(maxInput);

    const safeValue = Math.max(
      0,
      Math.min(value, max),
    );

    setMinInput(String(safeValue));
  };

  /* ------------------------------------------------------------------------ */
  /* Max blur                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleMaxBlur = () => {
    const value =
      maxInput === ""
        ? maxPrice
        : Number(maxInput);

    const min =
      minInput === ""
        ? 0
        : Number(minInput);

    const safeValue = Math.min(
      maxPrice,
      Math.max(value, min),
    );

    setMaxInput(String(safeValue));
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Min */}

      <div className="space-y-1.5">
        <label
          htmlFor="min-price"
          className="text-xs font-medium text-muted-foreground"
        >
          Min price
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
            ৳
          </span>

          <Input
            id="min-price"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minInput}
            onChange={(e) =>
              handleMinChange(
                e.target.value,
              )
            }
            onBlur={handleMinBlur}
            placeholder="0"
            className="h-9 pl-7 text-sm"
          />
        </div>
      </div>

      {/* Max */}

      <div className="space-y-1.5">
        <label
          htmlFor="max-price"
          className="text-xs font-medium text-muted-foreground"
        >
          Max price
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
            ৳
          </span>

          <Input
            id="max-price"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={maxInput}
            onChange={(e) =>
              handleMaxChange(
                e.target.value,
              )
            }
            onBlur={handleMaxBlur}
            placeholder={String(maxPrice)}
            className="h-9 pl-7 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

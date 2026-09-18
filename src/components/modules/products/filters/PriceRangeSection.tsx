"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface PriceRangeSectionProps {
  priceRange: [number, number];
  maxPrice: number;
  onPriceChange: (range: [number, number]) => void;
  debounceMs?: number;
}

/* -------------------------------------------------------------------------- */
/* Debounce hook                                                              */
/* -------------------------------------------------------------------------- */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function PriceRangeSection({
  priceRange,
  maxPrice,
  onPriceChange,
  debounceMs = 500,
}: PriceRangeSectionProps) {
  /* ---------------- Local state (UI) ---------------- */
  /** Inputs stored as STRING so user can clear `0` */
  const [minInput, setMinInput] = useState(String(priceRange[0]));
  const [maxInput, setMaxInput] = useState(String(priceRange[1]));
  const [sliderValue, setSliderValue] = useState<number[]>(priceRange);

  /** Track if user is currently typing in an input */
  const isTypingRef = useRef(false);

  /* ---------------- Debounced values ---------------- */
  const debouncedMin = useDebounce(minInput, debounceMs);
  const debouncedMax = useDebounce(maxInput, debounceMs);

  /* ---------------- Sync external → local (skip while typing) ---------------- */
  useEffect(() => {
    if (isTypingRef.current) return;

    setMinInput(String(priceRange[0]));
    setMaxInput(String(priceRange[1]));
    setSliderValue(priceRange);
  }, [priceRange[0], priceRange[1]]);

  /* ---------------- Commit debounced input ---------------- */
  useEffect(() => {
    const minVal = debouncedMin === "" ? 0 : Number(debouncedMin);
    const maxVal = debouncedMax === "" ? maxPrice : Number(debouncedMax);

    if (Number.isNaN(minVal) || Number.isNaN(maxVal)) return;

    // Clamp
    const safeMin = Math.max(0, Math.min(minVal, maxVal));
    const safeMax = Math.min(maxPrice, Math.max(maxVal, safeMin));

    // No change → skip
    if (safeMin === priceRange[0] && safeMax === priceRange[1]) return;

    onPriceChange([safeMin, safeMax]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax]);

  /* ---------------- Input handlers ---------------- */
  const handleMinChange = (value: string) => {
    isTypingRef.current = true;

    // Only digits allowed
    if (value !== "" && !/^\d+$/.test(value)) return;

    setMinInput(value);
  };

  const handleMaxChange = (value: string) => {
    isTypingRef.current = true;

    if (value !== "" && !/^\d+$/.test(value)) return;

    setMaxInput(value);
  };

  const handleMinBlur = () => {
    isTypingRef.current = false;

    const value = minInput === "" ? 0 : Number(minInput);
    const clamped = Math.max(0, Math.min(value, priceRange[1]));

    setMinInput(String(clamped));
  };

  const handleMaxBlur = () => {
    isTypingRef.current = false;

    const value = maxInput === "" ? maxPrice : Number(maxInput);
    const clamped = Math.min(maxPrice, Math.max(value, priceRange[0]));

    setMaxInput(String(clamped));
  };

  /* ---------------- Slider handlers ---------------- */
  const handleSliderChange = (value: number[]) => {
    isTypingRef.current = false;
    setSliderValue(value);
  };

  const handleSliderCommit = (value: number[]) => {
    if (value.length !== 2) return;

    const [min, max] = value;
    setMinInput(String(min));
    setMaxInput(String(max));
    onPriceChange([min, max]);
  };

  /* ---------------- Render ---------------- */
  return (
    <>
      {/* ==================== Slider ==================== */}
      <div className="px-1 pt-1">
        <Slider
          value={sliderValue}
          min={0}
          max={maxPrice}
          step={500}
          onValueChange={handleSliderChange}
          onValueCommitted={handleSliderCommit}
          className={cn(
            // Thumb cursor
            "**:[[role=slider]]:h-4 **:[[role=slider]]:w-4",
            "**:[[role=slider]]:cursor-grab **:[[role=slider]]:active:cursor-grabbing",
            // Smooth transitions
            "**:[[role=slider]]:transition-shadow **:[[role=slider]]:duration-150",
          )}
        />

        {/* Live range display under slider */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>৳ {(sliderValue[0] ?? 0).toLocaleString("en-US")}</span>
          <span className="text-muted-foreground/60">—</span>
          <span>৳ {(sliderValue[1] ?? maxPrice).toLocaleString("en-US")}</span>
        </div>
      </div>

      {/* ==================== Min / Max Inputs ==================== */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <label
            htmlFor="min-price"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
          >
            Min
          </label>

          <Input
            id="min-price"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={minInput}
            onChange={(e) => handleMinChange(e.target.value)}
            onBlur={handleMinBlur}
            placeholder="0"
            className="h-9 text-xs"
          />
        </div>

        <div>
          <label
            htmlFor="max-price"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
          >
            Max
          </label>

          <Input
            id="max-price"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={maxInput}
            onChange={(e) => handleMaxChange(e.target.value)}
            onBlur={handleMaxBlur}
            placeholder={String(maxPrice)}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </>
  );
}

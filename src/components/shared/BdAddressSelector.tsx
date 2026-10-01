"use client";

import { useMemo } from "react";
import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
  type BDAddress,
} from "@/lib/data/bangladesh";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface BdAddressSelectorProps {
  value: Partial<BDAddress>;
  onChange: (next: Partial<BDAddress>) => void;
  errors?: {
    divisionId?: string;
    districtId?: string;
    upazilaId?: string;
  };
  disabled?: boolean;
  /** Layout mode — stacked or inline */
  layout?: "stacked" | "grid";
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function BdAddressSelector({
  value,
  onChange,
  errors,
  disabled,
  layout = "grid",
}: BdAddressSelectorProps) {
  /* ---------- Derived lists ---------- */
  const districts = useMemo(
    () => (value.divisionId ? getDistrictsByDivision(value.divisionId) : []),
    [value.divisionId],
  );

  const upazilas = useMemo(
    () => (value.districtId ? getUpazilasByDistrict(value.districtId) : []),
    [value.districtId],
  );

  /* ---------- Handlers ---------- */
  const handleDivision = (divisionId: string) => {
    const division = DIVISIONS.find((d) => d.id === divisionId);
    onChange({
      divisionId,
      divisionName: division?.name ?? "",
      districtId: "",
      districtName: "",
      upazilaId: "",
      upazilaName: "",
    });
  };

  const handleDistrict = (districtId: string) => {
    const district = districts.find((d) => d.id === districtId);
    onChange({
      ...value,
      districtId,
      districtName: district?.name ?? "",
      upazilaId: "",
      upazilaName: "",
    });
  };

  const handleUpazila = (upazilaId: string) => {
    const upazila = upazilas.find((u) => u.id === upazilaId);
    onChange({
      ...value,
      upazilaId,
      upazilaName: upazila?.name ?? "",
    });
  };

  /* ---------- Render ---------- */
  return (
    <div
      className={cn(
        layout === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-3"
          : "space-y-3",
      )}
    >
      {/* Division */}
      <div className="space-y-1.5">
        <Label htmlFor="division" className="text-xs font-medium">
          Division *
        </Label>
        <Select
          value={value.divisionId ?? ""}
          onValueChange={handleDivision}
          disabled={disabled}
        >
          <SelectTrigger
            id="division"
            className={cn(
              "h-11 rounded-xl",
              errors?.divisionId && "border-destructive",
            )}
          >
            {/* ✅ Show NAME not ID */}
            <SelectValue placeholder="Select division">
              {value.divisionName || undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {DIVISIONS.map((division) => (
              <SelectItem key={division.id} value={division.id}>
                {division.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.divisionId && (
          <p className="text-xs text-destructive">{errors.divisionId}</p>
        )}
      </div>

      {/* District */}
      <div className="space-y-1.5">
        <Label htmlFor="district" className="text-xs font-medium">
          District *
        </Label>
        <Select
          value={value.districtId ?? ""}
          onValueChange={handleDistrict}
          disabled={disabled || !value.divisionId}
        >
          <SelectTrigger
            id="district"
            className={cn(
              "h-11 rounded-xl",
              errors?.districtId && "border-destructive",
            )}
          >
            <SelectValue placeholder="Select district">
              {value.districtName || undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.districtId && (
          <p className="text-xs text-destructive">{errors.districtId}</p>
        )}
      </div>

      {/* Upazila */}
      <div className="space-y-1.5">
        <Label htmlFor="upazila" className="text-xs font-medium">
          Upazila / Thana *
        </Label>
        <Select
          value={value.upazilaId ?? ""}
          onValueChange={handleUpazila}
          disabled={disabled || !value.districtId}
        >
          <SelectTrigger
            id="upazila"
            className={cn(
              "h-11 rounded-xl",
              errors?.upazilaId && "border-destructive",
            )}
          >
            <SelectValue placeholder="Select upazila">
              {value.upazilaName || undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {upazilas.map((upazila) => (
              <SelectItem key={upazila.id} value={upazila.id}>
                {upazila.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.upazilaId && (
          <p className="text-xs text-destructive">{errors.upazilaId}</p>
        )}
      </div>
    </div>
  );
}
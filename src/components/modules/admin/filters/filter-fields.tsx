"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterAdmin, FilterType } from "@/lib/types/filter.types";
import { cn } from "@/lib/utils";

interface FilterFieldsProps {
  filter: FilterAdmin;
  index: number;
  onChange: (filter: FilterAdmin) => void;
  onRemove: () => void;
}

const FILTER_TYPES: { value: FilterType; label: string }[] = [
  { value: "MULTI_SELECT", label: "Multi Select (Checkboxes)" },
  { value: "SINGLE_SELECT", label: "Single Select (Radio)" },
  { value: "RANGE", label: "Range (Min-Max)" },
  { value: "BOOLEAN", label: "Boolean (Yes/No)" },
];

export function FilterFields({
  filter,
  index,
  onChange,
  onRemove,
}: FilterFieldsProps) {
  const updateField = <K extends keyof FilterAdmin>(
    key: K,
    value: FilterAdmin[K],
  ) => {
    onChange({ ...filter, [key]: value });
  };

  const addOption = () => {
    onChange({
      ...filter,
      options: [...filter.options, { value: "", label: "", sortOrder: filter.options.length }],
    });
  };

  const updateOption = (optIndex: number, value: string) => {
    const updated = filter.options.map((opt, i) =>
      i === optIndex ? { ...opt, value } : opt,
    );
    onChange({ ...filter, options: updated });
  };

  const removeOption = (optIndex: number) => {
    onChange({
      ...filter,
      options: filter.options.filter((_, i) => i !== optIndex),
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-slate-300" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Filter {index + 1}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter name + type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Filter Name *</Label>
          <Input
            placeholder="e.g. Brand"
            value={filter.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="h-10 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Type *</Label>
          <Select
            value={filter.type}
            onValueChange={(val) => updateField("type", val as FilterType)}
          >
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Options (for MULTI_SELECT / SINGLE_SELECT) */}
      {(filter.type === "MULTI_SELECT" || filter.type === "SINGLE_SELECT") && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Options *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              className="h-7 text-xs rounded-lg"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Option
            </Button>
          </div>

          {filter.options.length === 0 && (
            <p className="text-xs text-slate-400 italic py-2">
              No options. Click "Add Option" to add.
            </p>
          )}

          <div className="space-y-1.5">
            {filter.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <Input
                  placeholder={`Option ${optIndex + 1} (e.g. OPPO)`}
                  value={option.value}
                  onChange={(e) => updateOption(optIndex, e.target.value)}
                  className="h-9 rounded-lg flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                  onClick={() => removeOption(optIndex)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Range info */}
      {filter.type === "RANGE" && (
        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          Range filter automatic compute hobe products er min/max value theke.
        </div>
      )}

      {/* Boolean info */}
      {filter.type === "BOOLEAN" && (
        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          Boolean filter — Yes / No option auto-generate hobe.
        </div>
      )}
    </div>
  );
}
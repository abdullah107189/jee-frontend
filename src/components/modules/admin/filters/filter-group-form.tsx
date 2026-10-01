"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Save, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    createFilterGroupAction,
    updateFilterGroupAction,
} from "@/actions/filter.actions";
import type {
    FilterAdmin,
    FilterGroupAdmin,
} from "@/lib/types/filter.types";
import { FilterFields } from "./filter-fields";

/* ─────────── Schema (FIXED) ─────────── */

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().optional(),
    categoryId: z.string().min(1, "Category required"),
    sortOrder: z.number().int().min(0).optional(),   // ← NO coerce
    isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryOption {
    id: string;
    name: string;
    level: number;
    fullSlug: string;
}

interface FilterGroupFormProps {
    mode: "create" | "edit";
    group?: FilterGroupAdmin;
    categories: CategoryOption[];
}

export function FilterGroupForm({
    mode,
    group,
    categories,
}: FilterGroupFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState<FilterAdmin[]>(
        group?.filters?.map((f) => ({
            name: f.name,
            label: f.label,
            type: f.type,
            sortOrder: f.sortOrder,
            options: f.options.map((o) => ({
                value: o.value,
                label: o.label,
                sortOrder: o.sortOrder,
            })),
        })) ?? [],
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: group?.name ?? "",
            slug: group?.slug ?? "",
            categoryId: group?.categoryId ?? "",
            sortOrder: group?.sortOrder ?? 0,
            isActive: group?.isActive ?? true,
        },
    });

    // ... filter handlers same

    const onSubmit = async (data: FormValues) => {
        // Validation
        if (filters.length === 0) {
            toast.error("At least 1 filter required");
            return;
        }

        // ... rest same

        startTransition(async () => {
            const fd = new FormData();
            fd.set("name", data.name);
            if (data.slug) fd.set("slug", data.slug);
            fd.set("categoryId", data.categoryId ?? "");
            if (data.sortOrder !== undefined) {
                fd.set("sortOrder", String(data.sortOrder));
            }
            if (data.isActive) fd.set("isActive", "on");
            fd.set("filters", JSON.stringify(filters));

            const res =
                mode === "create"
                    ? await createFilterGroupAction(null, fd)
                    : await updateFilterGroupAction(group!.id, null, fd);

            if (res.success) {
                toast.success(res.message);
                router.push("/admin/filters");
                router.refresh();
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Group Info Card */}
            <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-bold">Group Info</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                                {...form.register("name")}
                                placeholder="e.g. Phone Filters"
                                className="h-11 rounded-xl"
                                disabled={mode === "edit"}
                            />
                            {form.formState.errors.name && (
                                <p className="text-xs text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label>Category *</Label>
                            {mode === "edit" ? (
                                <Input
                                    value={group?.category.name ?? ""}
                                    disabled
                                    className="h-11 rounded-xl bg-slate-50"
                                />
                            ) : (
                                <Select
                                    value={form.watch("categoryId") ?? ""}
                                    onValueChange={(val) => {
                                        if (val !== null) {
                                            form.setValue("categoryId", val);
                                        }
                                    }}
                                >


                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat?.name}>
                                                {"  ".repeat(cat.level)}
                                                {cat?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {form.formState.errors.categoryId && (
                                <p className="text-xs text-red-500">
                                    {form.formState.errors.categoryId.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Slug (auto from name)</Label>
                            <Input
                                {...form.register("slug")}
                                placeholder="phone-filters"
                                className="h-11 rounded-xl font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Sort Order</Label>
                            <Input
                                type="number"
                                {...form.register("sortOrder", { valueAsNumber: true })}   // ← FIX
                                className="h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={form.watch("isActive") ?? false}
                            onCheckedChange={(val) => form.setValue("isActive", val === true)}
                        />
                        <Label className="cursor-pointer">Active</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Filters Card */}
            <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Filters</h2>
                            <p className="text-xs text-slate-500">
                                Add filters (Brand, Color, Size, etc.)
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFilters([
                                    ...filters,
                                    {
                                        name: "",
                                        label: "",
                                        type: "MULTI_SELECT",
                                        sortOrder: filters.length,
                                        options: [],
                                    },
                                ]);
                            }}
                            className="h-10 rounded-xl"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Filter
                        </Button>
                    </div>

                    {filters.length === 0 && (
                        <div className="py-12 text-center text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                            No filters yet. Click "Add Filter" to start.
                        </div>
                    )}

                    <div className="space-y-3">
                        {filters.map((filter, i) => (
                            <FilterFields
                                key={i}
                                filter={filter}
                                index={i}
                                onChange={(f) =>
                                    setFilters(filters.map((fl, idx) => (idx === i ? f : fl)))
                                }
                                onRemove={() => setFilters(filters.filter((_, idx) => idx !== i))}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isPending}
                    className="h-11 rounded-xl"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 rounded-xl"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {mode === "create" ? "Create Filter Group" : "Update"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
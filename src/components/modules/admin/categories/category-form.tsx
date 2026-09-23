"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

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
    createCategoryAction,
    updateCategoryAction,
} from "@/actions/category.actions";

import type { AdminCategory } from "@/lib/types/category.types";

/* ─────────────────────────────
   Schema
───────────────────────────── */

const categorySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),

    slug: z
        .string()
        .regex(
            /^[a-z0-9-]*$/,
            "Only lowercase letters, numbers, hyphens"
        )
        .optional()
        .or(z.literal("")),

    description: z
        .string()
        .max(500, "Description must be 500 characters or less")
        .optional()
        .or(z.literal("")),

    parentId: z
        .string()
        .optional()
        .or(z.literal("")),

    icon: z
        .string()
        .optional()
        .or(z.literal("")),

    image: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),

    sortOrder: z.coerce
        .number()
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});

type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormOutput = z.output<typeof categorySchema>;

/* ─────────────────────────────
   Props
───────────────────────────── */

interface CategoryFormProps {
    mode: "create" | "edit";
    category?: AdminCategory;
    parentOptions: AdminCategory[];
}

/* ─────────────────────────────
   Component
───────────────────────────── */

export function CategoryForm({
    mode,
    category,
    parentOptions,
}: CategoryFormProps) {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const form = useForm<
        CategoryFormInput,
        unknown,
        CategoryFormOutput
    >({
        resolver: zodResolver(categorySchema),

        defaultValues: {
            name: category?.name ?? "",
            slug: category?.slug ?? "",
            description: category?.description ?? "",
            parentId: category?.parentId ?? "",
            icon: category?.icon ?? "",
            image: category?.image ?? "",
            sortOrder: category?.sortOrder ?? 0,
            isActive: category?.isActive ?? true,
        },

    });

    /* ─────────────────────────────
       Submit
    ───────────────────────────── */

    const onSubmit = (data: CategoryFormOutput) => {
        startTransition(async () => {
            try {
                const fd = new FormData();

                /* Name */
                fd.set("name", data.name);

                /* Slug */
                if (data.slug) {
                    fd.set("slug", data.slug);
                }

                /* Description */
                if (data.description) {
                    fd.set(
                        "description",
                        data.description
                    );
                }

                /* Parent */
                // Never pass null to FormData.set.
                if (
                    data.parentId !== undefined &&
                    data.parentId !== null &&
                    data.parentId !== ""
                ) {
                    fd.set("parentId", data.parentId);
                }

                /* Icon */
                if (data.icon) {
                    fd.set("icon", data.icon);
                }

                /* Image */
                if (data.image) {
                    fd.set("image", data.image);
                }

                /* Sort order */
                if (data.sortOrder !== undefined) {
                    fd.set(
                        "sortOrder",
                        String(data.sortOrder)
                    );
                }

                /* Active */
                // Send explicit value so false is also handled.
                fd.set(
                    "isActive",
                    data.isActive ? "on" : "off"
                );

                const res =
                    mode === "create"
                        ? await createCategoryAction(
                            null,
                            fd
                        )
                        : await updateCategoryAction(
                            category!.id,
                            null,
                            fd
                        );

                if (res.success) {
                    toast.success(res.message);

                    router.push("/admin/categories");
                    router.refresh();
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                console.error(error);

                toast.error(
                    "Something went wrong. Please try again."
                );
            }
        });
    };

    /* ─────────────────────────────
       Render
    ───────────────────────────── */

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full"
        >
            <Card className="rounded-2xl border-none shadow-lg">
                <CardContent className="space-y-6 p-6">

                    {/* ───────────────── Name ───────────────── */}

                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name *
                        </Label>

                        <Input
                            id="name"
                            {...form.register("name")}
                            placeholder="e.g. Ceiling Fan"
                            className="h-12 rounded-xl"
                        />

                        {form.formState.errors.name && (
                            <p className="text-xs text-red-500">
                                {
                                    form.formState.errors
                                        .name.message
                                }
                            </p>
                        )}
                    </div>

                    {/* ───────────────── Slug ───────────────── */}

                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Slug{" "}
                            <span className="text-slate-400">
                                (auto from name)
                            </span>
                        </Label>

                        <Input
                            id="slug"
                            {...form.register("slug")}
                            placeholder="ceiling-fan"
                            className="h-12 rounded-xl font-mono"
                        />

                        {form.formState.errors.slug && (
                            <p className="text-xs text-red-500">
                                {
                                    form.formState.errors
                                        .slug.message
                                }
                            </p>
                        )}
                    </div>

                    {/* ───────────────── Description ───────────────── */}

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description
                        </Label>

                        <textarea
                            id="description"
                            {...form.register("description")}
                            placeholder="Short description"
                            rows={3}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />

                        {form.formState.errors.description && (
                            <p className="text-xs text-red-500">
                                {
                                    form.formState.errors
                                        .description.message
                                }
                            </p>
                        )}
                    </div>

                    {/* ───────────────── Parent ───────────────── */}

                    <div className="space-y-2">
                        <Label htmlFor="parentId">
                            Parent Category
                        </Label>

                        <Select
                            value={form.watch("parentId") || "none"}
                            onValueChange={(value) => {
                                form.setValue(
                                    "parentId",
                                    value === "none" ? "" : value
                                );
                            }}
                        >
                            <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="No parent (top-level)" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="none">
                                    No parent (top-level)
                                </SelectItem>

                                {parentOptions.map((cat) => (
                                    <SelectItem
                                        key={cat.id}
                                        value={cat.id}
                                    >
                                        {"  ".repeat(
                                            cat.level ?? 0
                                        )}
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {form.formState.errors.parentId && (
                            <p className="text-xs text-red-500">
                                {
                                    form.formState.errors
                                        .parentId.message
                                }
                            </p>
                        )}
                    </div>

                    {/* ───────────────── Icon + Image ───────────────── */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Icon */}

                        <div className="space-y-2">
                            <Label htmlFor="icon">
                                Icon (URL)
                            </Label>

                            <Input
                                id="icon"
                                {...form.register("icon")}
                                placeholder="https://..."
                                className="h-12 rounded-xl"
                            />

                            {form.formState.errors.icon && (
                                <p className="text-xs text-red-500">
                                    {
                                        form.formState.errors
                                            .icon.message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Image */}

                        <div className="space-y-2">
                            <Label htmlFor="image">
                                Image (URL)
                            </Label>

                            <Input
                                id="image"
                                {...form.register("image")}
                                placeholder="https://..."
                                className="h-12 rounded-xl"
                            />

                            {form.formState.errors.image && (
                                <p className="text-xs text-red-500">
                                    {
                                        form.formState.errors
                                            .image.message
                                    }
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ───────────────── Sort + Active ───────────────── */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Sort Order */}

                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">
                                Sort Order
                            </Label>

                            <Input
                                id="sortOrder"
                                type="number"
                                {...form.register(
                                    "sortOrder"
                                )}
                                className="h-12 rounded-xl"
                            />

                            {form.formState.errors.sortOrder && (
                                <p className="text-xs text-red-500">
                                    {
                                        form.formState.errors
                                            .sortOrder.message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Active */}

                        <div className="flex items-center gap-2 pt-8">
                            <Checkbox
                                id="isActive"
                                checked={
                                    form.watch(
                                        "isActive"
                                    ) ?? false
                                }
                                onCheckedChange={(value) => {
                                    form.setValue(
                                        "isActive",
                                        value === true,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        }
                                    );
                                }}
                            />

                            <Label
                                htmlFor="isActive"
                                className="cursor-pointer"
                            >
                                Active
                            </Label>
                        </div>
                    </div>

                    {/* ───────────────── Actions ───────────────── */}

                    <div className="flex justify-end gap-3 border-t pt-4">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isPending}
                            className="h-12 rounded-xl"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-12 rounded-xl"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />

                                    {mode === "create"
                                        ? "Create Category"
                                        : "Update Category"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

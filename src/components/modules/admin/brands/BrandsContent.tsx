"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Loader2,
  X,
  CheckCircle,
  Globe,
  ImageIcon,
} from "lucide-react";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { BrandsResponse } from "@/services/brand.service";
import type { Brand } from "@/lib/fixtures/product/types";
import {
  createBrandAction,
  updateBrandAction,
  deleteBrandAction,
} from "@/actions/brand.actions";

interface AdminBrandsPageProps {
  brands: BrandsResponse;
}

export default function AdminBrandsPage({ brands }: AdminBrandsPageProps) {
  const [brandList, setBrandList] = useState<Brand[]>(brands.data ?? []);
  const [search, setSearch] = useState("");

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add / Edit Modal State
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formLogo, setFormLogo] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setBrandList(brands.data ?? []);
  }, [brands.data]);

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return brandList;
    }

    return brandList.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        brand.slug.toLowerCase().includes(query),
    );
  }, [brandList, search]);

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setFormName("");
    setFormSlug("");
    setFormLogo("");
    setFormDescription("");
    setFormIsActive(true);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormName(brand.name);
    setFormSlug(brand.slug);
    setFormLogo(brand.logo || "");
    setFormDescription(brand.description || "");
    setFormIsActive(brand.isActive ?? true);
    setFormModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingBrand) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(autoSlug);
    }
  };

  const handleSubmitBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Brand name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBrand) {
        const res = await updateBrandAction(editingBrand.id, {
          name: formName.trim(),
          slug: formSlug.trim() || undefined,
          logo: formLogo.trim() || undefined,
          description: formDescription.trim() || undefined,
          isActive: formIsActive,
        });

        if (!res.success) {
          toast.error(res.message || "Failed to update brand.");
          return;
        }

        toast.success(`Brand "${formName}" updated successfully.`);
        setBrandList((prev) =>
          prev.map((b) =>
            b.id === editingBrand.id
              ? {
                  ...b,
                  name: formName.trim(),
                  slug: formSlug.trim() || b.slug,
                  logo: formLogo.trim() || null,
                  description: formDescription.trim() || null,
                  isActive: formIsActive,
                }
              : b,
          ),
        );
        setFormModalOpen(false);
      } else {
        const res = await createBrandAction({
          name: formName.trim(),
          slug: formSlug.trim() || undefined,
          logo: formLogo.trim() || undefined,
          description: formDescription.trim() || undefined,
          isActive: formIsActive,
        });

        if (!res.success) {
          toast.error(res.message || "Failed to create brand.");
          return;
        }

        toast.success(`Brand "${formName}" created successfully.`);
        const createdBrand: Brand = res.data || {
          id: String(Date.now()),
          name: formName.trim(),
          slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, "-"),
          logo: formLogo.trim() || null,
          description: formDescription.trim() || null,
          isActive: formIsActive,
        };
        setBrandList((prev) => [createdBrand, ...prev]);
        setFormModalOpen(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const res = await deleteBrandAction(itemToDelete.id);
      if (!res.success) {
        toast.error(res.message || "Failed to delete brand.");
        return;
      }

      toast.success(`Brand "${itemToDelete.name}" deleted successfully.`);
      setBrandList((prev) => prev.filter((b) => b.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch {
      toast.error("Failed to delete brand.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Tag className="h-5 w-5" />
            </div>

            <div>
              <h1 className="page-header-title">
                Brands
              </h1>

              <p className="page-header-desc">
                Manage product brands, logos, and manufacturer details.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="h-10 rounded-xl px-4 shadow-lg shadow-blue-500/20 sm:h-12 sm:rounded-2xl"
        >
          <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Add Brand
        </Button>
      </div>

      {/* Error State */}
      {!brands.success && (
        <Card className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">
            {brands.message || "Failed to load brands."}
          </p>
        </Card>
      )}

      {/* Main Card */}
      <Card className="overflow-hidden rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem]">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands by name or slug..."
              className="h-10 w-full rounded-xl border border-input bg-background dark:bg-muted/30 pl-10 transition-all focus:border-blue-500 focus:ring-blue-500/20 sm:h-12"
            />
          </div>

          <div className="text-sm font-medium text-muted-foreground">
            {filteredBrands.length}{" "}
            {filteredBrands.length === 1 ? "brand" : "brands"}
          </div>
        </div>

        {/* Loading / Empty / Table */}
        {!brands.success && brandList.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Loader2 className="h-5 w-5" />
              </div>

              <p className="font-semibold text-slate-800">
                Unable to load brands
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {brands.message || "Please try again later."}
              </p>
            </div>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Tag className="h-6 w-6" />
              </div>

              <h3 className="font-semibold text-foreground">
                {search ? "No brands found" : "No brands yet"}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try searching with a different keyword."
                  : "Create your first brand to get started."}
              </p>

              {!search && (
                <Button onClick={handleOpenAddModal} className="mt-4 rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Brand
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-muted-foreground sm:px-6 sm:py-5">
                    Brand Name
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-muted-foreground sm:px-6 sm:py-5">
                    Slug
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-muted-foreground sm:px-6 sm:py-5">
                    Description
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-muted-foreground sm:px-6 sm:py-5">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-right font-semibold text-muted-foreground sm:px-6 sm:py-5">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/40">
                {filteredBrands.map((brand) => {
                  const initials = (brand.name || "BR")
                    .trim()
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={brand.id}
                      className="bg-card transition-colors hover:bg-muted/30"
                    >
                      {/* Brand */}
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {brand.logo ? (
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/40 sm:h-10 sm:w-10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-full w-full object-contain p-1"
                                onError={(e) => {
                                  // Fallback to initials if image fails
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600 sm:h-10 sm:w-10">
                              {initials}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">
                              {brand.name}
                            </p>
                            <p className="text-xs text-slate-400">Brand</p>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-4 py-4 sm:px-6">
                        <code className="rounded-lg bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                          {brand.slug}
                        </code>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-4 sm:px-6 max-w-xs truncate text-xs text-muted-foreground">
                        {brand.description || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 sm:px-6">
                        <Badge
                          variant={brand.isActive !== false ? "success" : "outline"}
                          className="rounded-full px-3 py-1 text-xs"
                        >
                          {brand.isActive !== false ? "Active" : "Disabled"}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right sm:px-6">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-xl p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:h-10 sm:w-10"
                            title="Edit brand"
                            onClick={() => handleOpenEditModal(brand)}
                          >
                            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-xl p-0 text-red-400 hover:bg-red-50 hover:text-red-600 sm:h-10 sm:w-10"
                            title="Delete brand"
                            onClick={() =>
                              handleDeleteClick(brand.id, brand.name)
                            }
                          >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Brand Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card text-card-foreground shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {editingBrand ? "Edit Brand" : "Create New Brand"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingBrand
                      ? `Updating details for ${editingBrand.name}`
                      : "Add a new brand to categorize products"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFormModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitBrand} className="p-6 space-y-4">
              {/* Brand Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Sony, Vision, Walton..."
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="rounded-xl border-slate-200 focus:border-blue-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Slug (URL Keyword)
                </label>
                <Input
                  placeholder="e.g. vision-electronics"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="rounded-xl border-slate-200 font-mono text-xs focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Leave empty to generate automatically from name.
                </p>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Logo / Image URL
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://... or image link"
                    value={formLogo}
                    onChange={(e) => setFormLogo(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-blue-500 flex-1"
                  />
                  {formLogo ? (
                    <div className="h-10 w-10 shrink-0 rounded-xl border border-border overflow-hidden bg-muted/40 flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formLogo}
                        alt="Preview"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description
                </label>
                <Textarea
                  rows={3}
                  placeholder="Brief description about the manufacturer or brand..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="rounded-xl border-slate-200 text-sm focus:border-blue-500"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-3">
                <div>
                  <span className="text-sm font-semibold text-slate-800">
                    Active Status
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Show this brand in storefront filters and product forms
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormModalOpen(false)}
                  className="rounded-xl"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {editingBrand ? "Save Changes" : "Create Brand"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? Products linked to this brand may need to be updated."
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}

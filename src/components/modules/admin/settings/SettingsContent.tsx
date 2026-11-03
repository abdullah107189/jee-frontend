"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  CreditCard,
  ShieldCheck,
  Database,
  Save,
  RefreshCw,
  CheckCircle2,
  Lock,
  Flame,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import type { SystemSettings } from "@/services/admin.service";
import type { ProductCardData } from "@/lib/types/product.types";
import {
  updateSystemSettingsAction,
  getDatabaseBackupAction,
} from "@/actions/admin.actions";
import { toast } from "sonner";

interface Props {
  initialSettings: SystemSettings;
  availableProducts?: ProductCardData[];
}

export default function SettingsContent({ initialSettings, availableProducts = [] }: Props) {
  const [activeTab, setActiveTab] = useState<
    "general" | "payment" | "warranty" | "security" | "featured"
  >("general");

  // Form states
  const [storeName, setStoreName] = useState(initialSettings?.storeName || "JEE Bangladesh");
  const [supportEmail, setSupportEmail] = useState(initialSettings?.supportEmail || "support@JEE.bd");
  const [supportPhone, setSupportPhone] = useState(initialSettings?.supportPhone || "+880 1700-000000");
  const [currency, setCurrency] = useState(initialSettings?.currency || "BDT (৳)");

  const [codEnabled, setCodEnabled] = useState(initialSettings?.codEnabled ?? true);

  const [defaultWarrantyMonths, setDefaultWarrantyMonths] = useState(
    initialSettings?.defaultWarrantyMonths ?? 12
  );
  const [warrantyTerms, setWarrantyTerms] = useState(
    initialSettings?.warrantyTerms ||
      "Covers manufacturing defects for motor and mainboard components. Physical, liquid or accidental damage voids warranty automatically."
  );

  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState(
    initialSettings?.auditLoggingEnabled ?? true
  );

  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>(
    initialSettings?.featuredProductIds || []
  );
  const [selectedProductIdToAdd, setSelectedProductIdToAdd] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleAddFeaturedProduct = () => {
    if (!selectedProductIdToAdd) {
      toast.error("Please select a product to add.");
      return;
    }
    if (featuredProductIds.length >= 8) {
      toast.error("Maximum 8 featured products allowed! Remove an item first.");
      return;
    }
    if (featuredProductIds.includes(selectedProductIdToAdd)) {
      toast.error("This product is already in the featured showcase!");
      return;
    }
    setFeaturedProductIds([...featuredProductIds, selectedProductIdToAdd]);
    setSelectedProductIdToAdd("");
    toast.success("Product added to featured showcase.");
  };

  const handleRemoveFeaturedProduct = (productId: string) => {
    setFeaturedProductIds(featuredProductIds.filter((id) => id !== productId));
    toast.info("Product removed from featured showcase.");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSystemSettingsAction({
        storeName: storeName.trim(),
        supportEmail: supportEmail.trim(),
        supportPhone: supportPhone.trim(),
        currency: currency.trim(),
        codEnabled,
        defaultWarrantyMonths: Number(defaultWarrantyMonths) || 12,
        warrantyTerms: warrantyTerms.trim(),
        auditLoggingEnabled,
        featuredProductIds: featuredProductIds.slice(0, 8),
      });

      toast.success(res.message || "System configuration saved successfully!");
    } catch (err: any) {
      console.error("Save settings error:", err);
      toast.error(err.message || "Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackupDatabase = async () => {
    setIsBackingUp(true);
    try {
      const res = await getDatabaseBackupAction();
      const backupData = res.data;
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.setAttribute("href", url);
      link.setAttribute("download", `jee-database-snapshot-${timestamp}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Database snapshot generated and downloaded successfully!");
    } catch (err: any) {
      console.error("Backup error:", err);
      toast.error(err.message || "Failed to generate database backup.");
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            System Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">
            Configure store parameters, payment gateway integration, and warranty rules.
          </p>
        </div>
      </div>

      {/* Settings Tab Navigation (60-30-10: 60% bg-card, 30% border/muted, 10% primary accent) */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "general"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4 mr-2" /> General
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "payment"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <CreditCard className="h-4 w-4 mr-2" /> Payment Gateway
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warranty")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "warranty"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4 mr-2" /> Warranty Rules
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "security"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Database className="h-4 w-4 mr-2" /> Security & Backup
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("featured")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "featured"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Flame className="h-4 w-4 mr-2 text-red-500" /> Featured Showcase
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "featured"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {featuredProductIds.length}/8
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSaveSettings}>
        <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">General Store Profile</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official store branding and customer support contacts.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                      Store Name
                    </label>
                    <Input
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      required
                      className="rounded-xl border-border bg-background"
                      placeholder="e.g. JEE Bangladesh"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                      Display Currency
                    </label>
                    <Input
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      required
                      className="rounded-xl border-border bg-background"
                      placeholder="e.g. BDT (৳)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                      Support Email
                    </label>
                    <Input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      required
                      className="rounded-xl border-border bg-background"
                      placeholder="support@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                      Support Phone Hotline
                    </label>
                    <Input
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      required
                      className="rounded-xl border-border bg-background"
                      placeholder="+880 1700-000000"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Payment Settings</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure customer checkout and payment acceptance modes.
                  </p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl border border-border bg-muted/40 text-foreground text-sm">
                    <p className="font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cash on Delivery (COD) Active
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Customers pay in cash upon receiving and inspecting the package.
                    </p>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={codEnabled}
                        onChange={(e) => setCodEnabled(e.target.checked)}
                        className="h-5 w-5 rounded border-border accent-primary focus:ring-primary/20"
                      />
                      <span className="text-sm font-bold text-foreground">
                        Enable Cash on Delivery (COD) Option at Checkout
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "warranty" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Default Warranty Policy Configuration
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Standard duration and coverage clause assigned to new catalog items.
                  </p>
                </div>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                      Default Warranty Period (Months)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={120}
                      value={defaultWarrantyMonths}
                      onChange={(e) => setDefaultWarrantyMonths(Number(e.target.value))}
                      required
                      className="rounded-xl border-border bg-background max-w-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                      Standard Terms & Conditions Clause
                    </label>
                    <Textarea
                      rows={5}
                      value={warrantyTerms}
                      onChange={(e) => setWarrantyTerms(e.target.value)}
                      required
                      className="rounded-xl border-border bg-background leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Security & System Maintenance
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Audit trail logging and database disaster recovery.
                  </p>
                </div>
                <div className="space-y-6 pt-2">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={auditLoggingEnabled}
                      onChange={(e) => setAuditLoggingEnabled(e.target.checked)}
                      className="h-5 w-5 rounded border-border accent-primary focus:ring-primary/20 mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-bold text-foreground">
                        Enable Comprehensive Audit Logging
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Record all administrative actions, seller approvals, and order status transitions to the audit log.
                      </p>
                    </div>
                  </label>

                  <div className="p-5 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" /> Database Snapshot & Backup
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Download a real-time JSON snapshot of products, categories, orders, and registered warranties.
                      </p>
                    </div>
                    <Button
                      type="button"
                      disabled={isBackingUp}
                      onClick={handleBackupDatabase}
                      variant="outline"
                      className="rounded-xl bg-card border-border hover:bg-muted text-foreground cursor-pointer"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${isBackingUp ? "animate-spin" : ""}`}
                      />
                      {isBackingUp ? "Generating Snapshot..." : "Backup Now"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "featured" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Flame className="h-5 w-5 text-red-500" /> Homepage Featured Showcase
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select up to 8 products to display in the homepage sliding carousel (5 on desktop, 3 on tablet, 2 on mobile).
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        featuredProductIds.length >= 8
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {featuredProductIds.length} / 8 Featured Products
                    </span>
                  </div>
                </div>

                {/* Add Product Selector Box */}
                <div className="p-4 sm:p-5 rounded-2xl border border-border bg-muted/40 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Add Product to Featured Showcase
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedProductIdToAdd}
                      onChange={(e) => setSelectedProductIdToAdd(e.target.value)}
                      disabled={featuredProductIds.length >= 8}
                      className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">-- Choose a product to feature --</option>
                      {availableProducts
                        .filter((p) => !featuredProductIds.includes(p.id))
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.categoryName || "Catalog"} • ৳{p.price.toLocaleString()})
                          </option>
                        ))}
                    </select>

                    <Button
                      type="button"
                      onClick={handleAddFeaturedProduct}
                      disabled={!selectedProductIdToAdd || featuredProductIds.length >= 8}
                      className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-5 h-10 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Add to Showcase
                    </Button>
                  </div>

                  {featuredProductIds.length >= 8 ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 pt-1">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Maximum limit reached (8 products). Remove a product before adding another.
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      You can add {8 - featuredProductIds.length} more {featuredProductIds.length === 7 ? "product" : "products"}.
                    </p>
                  )}
                </div>

                {/* Current Featured Products List */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-3">
                    Currently Selected Products ({featuredProductIds.length})
                  </h4>

                  {featuredProductIds.length === 0 ? (
                    <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border bg-card/50">
                      <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                      <p className="text-sm font-bold text-foreground">
                        No specific products featured yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                        The homepage is currently displaying the latest 8 published products by default. Select products above to customize your showcase!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {featuredProductIds.map((id, index) => {
                        const product = availableProducts.find((p) => p.id === id);
                        return (
                          <div
                            key={id}
                            className="relative flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/40 transition group"
                          >
                            <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground shadow-2xs">
                              {index + 1}
                            </span>

                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50 relative">
                              {product?.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="object-cover h-full w-full"
                                />
                              ) : (
                                <Flame className="h-5 w-5 text-muted-foreground/40" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-foreground truncate">
                                {product?.name || `Product ID: ${id.slice(0, 10)}...`}
                              </p>
                              <p className="text-[11px] font-semibold text-primary mt-0.5">
                                {product?.price ? `৳${product.price.toLocaleString()}` : "Active"}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveFeaturedProduct(id)}
                              title="Remove from showcase"
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition cursor-pointer shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-border flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm cursor-pointer"
              >
                <Save className={`h-4 w-4 mr-2 ${isSaving ? "animate-spin" : ""}`} />
                {isSaving ? "Saving Configuration..." : "Save Configuration"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

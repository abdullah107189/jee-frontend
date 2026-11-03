"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import type { SystemSettings } from "@/services/admin.service";
import {
  updateSystemSettingsAction,
  getDatabaseBackupAction,
} from "@/actions/admin.actions";
import { toast } from "sonner";

interface Props {
  initialSettings: SystemSettings;
}

export default function SettingsContent({ initialSettings }: Props) {
  const [activeTab, setActiveTab] = useState<
    "general" | "payment" | "warranty" | "security"
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

  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

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

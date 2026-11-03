"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  FileText,
  BadgeCheck,
  Package,
} from "lucide-react"; 
import { claimWarrantyAction } from "@/actions/customer.actions";
import type { CustomerWarrantyDetails } from "@/services/customer.service";
import { ClaimForm } from "./ClaimForm";
import Link from "next/link";
import { formatAppDate } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string; description: string }> = {
  ACTIVE: {
    label: "Active",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    description: "Your warranty is active and valid under manufacturer policy",
  },
  EXPIRED: {
    label: "Expired",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
    description: "Your warranty period has concluded",
  },
  CLAIMED: {
    label: "Claimed",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    description: "A service or repair claim has been filed for this warranty",
  },
};

export function WarrantyDetails({ warranty }: { warranty: CustomerWarrantyDetails | null }) {
  const router = useRouter();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  if (!warranty) {
    return (
      <div className="text-center py-12 space-y-3">
        <AlertCircle className="w-14 h-14 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Warranty Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested warranty record could not be found or you do not have permission to view it.
        </p>
        <Link href="/customer/warranties">
          <Button className="rounded-xl">Back to Warranties</Button>
        </Link>
      </div>
    );
  }

  const rawStatus = (warranty.status || "ACTIVE").toUpperCase();
  const status = statusConfig[rawStatus] || statusConfig.ACTIVE;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Warranties
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="typo-badge text-primary">
              Warranty Details
            </span>
          </div>
          <h1 className="page-header-title">{warranty.productName}</h1>
          <p className="page-header-desc font-mono mt-0.5">
            Serial: {warranty.uniqueId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`text-sm px-3.5 py-1.5 rounded-xl font-bold ${status.className}`}>
            <StatusIcon className="w-4 h-4 mr-1.5" />
            {status.label}
          </Badge>
          {rawStatus === "ACTIVE" && (
            <Button
              onClick={() => setShowClaimForm(true)}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4" />
              File Claim
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status Info */}
          <Card className="rounded-2xl border-border bg-card shadow-xs">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl border ${status.className}`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground text-base">{status.label}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {status.description}
                  </p>
                  {rawStatus === "ACTIVE" && warranty.daysRemaining > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Remaining Coverage</span>
                        <span className="text-emerald-600 font-bold">
                          {warranty.daysRemaining} days remaining
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(0, (warranty.daysRemaining / (warranty.totalDays || 365)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Dates & Policy Details */}
          <Card className="rounded-2xl border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Coverage Timeline & Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                  <p className="text-xs text-muted-foreground font-semibold">Start / Purchase Date</p>
                  <p className="font-bold text-sm sm:text-base text-foreground mt-1">
                    {formatAppDate(warranty.startDate)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                  <p className="text-xs text-muted-foreground font-semibold">Expiration Date</p>
                  <p className="font-bold text-sm sm:text-base text-foreground mt-1">
                    {formatAppDate(warranty.endDate)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                  <p className="text-xs text-muted-foreground font-semibold">Coverage Term</p>
                  <p className="font-bold text-sm sm:text-base text-foreground mt-1">
                    {warranty.durationMonths || 24} Months
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                  <p className="text-xs text-muted-foreground font-semibold">Sale Origin</p>
                  <p className="font-bold text-sm sm:text-base text-foreground mt-1">
                    {warranty.saleType || "Authorized JEE Retail"}
                  </p>
                </div>
              </div>

              {warranty.terms && (
                <div className="mt-2 p-4 bg-muted/20 border border-border rounded-xl space-y-1">
                  <p className="text-xs font-bold text-foreground">Terms & Conditions:</p>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {warranty.terms}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-5">
          {/* Product Summary */}
          <Card className="rounded-2xl border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-sm">
              <p className="font-bold text-foreground">{warranty.productName}</p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted p-2 rounded-lg">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                <span>{warranty.uniqueId}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          {warranty.customerName && (
            <Card className="rounded-2xl border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-bold">Registered Owner</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5 text-xs text-muted-foreground">
                <p className="font-bold text-sm text-foreground">{warranty.customerName}</p>
                {warranty.customerPhone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    {warranty.customerPhone}
                  </p>
                )}
                {warranty.customerEmail && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    {warranty.customerEmail}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Seller Info */}
          {warranty.sellerName && (
            <Card className="rounded-2xl border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-bold">Fulfilling Merchant</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-1 text-xs">
                <p className="font-bold text-sm text-foreground">{warranty.sellerName}</p>
                <p className="text-muted-foreground">Authorized JEE Distribution Partner</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Claim Form Modal */}
      {showClaimForm && (
        <ClaimForm
          open={showClaimForm}
          onOpenChange={setShowClaimForm}
          onSubmit={async (data) => {
            setIsClaiming(true);
            try {
              const res = await claimWarrantyAction({
                warrantyId: warranty.id,
                description: data.reason || data.description || "Warranty repair claim requested by customer",
              });
              if (res?.success) {
                toast.success("Warranty claim submitted successfully!");
                setShowClaimForm(false);
              } else {
                toast.error(res?.message || "Failed to submit claim. Please try again.");
              }
            } catch (err: any) {
              toast.error(err?.message || "Error submitting claim.");
            } finally {
              setIsClaiming(false);
            }
          }}
          isLoading={isClaiming}
        />
      )}
    </div>
  );
}

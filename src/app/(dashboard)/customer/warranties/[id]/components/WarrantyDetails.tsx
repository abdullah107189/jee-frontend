"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from '../../../../../../hooks/use-toast';
import {
  ArrowLeft,
  Shield,
  Calendar,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2,
} from "lucide-react"; 
import {
  useClaimWarrantyMutation,
  useGetCustomerWarrantyDetailsQuery,
} from "@/lib/redux/features/customer/customerApi";
import { ClaimForm } from "./ClaimForm";
import Link from "next/link";

const statusConfig: Record<string, any> = {
  ACTIVE: {
    label: "Active",
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    description: "Your warranty is active and valid",
  },
  EXPIRED: {
    label: "Expired",
    icon: AlertCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    description: "Your warranty has expired",
  },
  CLAIMED: {
    label: "Claimed",
    icon: Clock,
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    description: "A claim has been filed for this warranty",
  },
};

export function WarrantyDetails({ warrantyId }: { warrantyId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [showClaimForm, setShowClaimForm] = useState(false);

  const { data, isLoading } = useGetCustomerWarrantyDetailsQuery(warrantyId);

  const [claimWarranty, { isLoading: isClaiming }] = useClaimWarrantyMutation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const warranty = data?.data;
  if (!warranty) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Warranty Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The warranty you're looking for doesn't exist.
        </p>
        <Link href="/customer/warranties">
          <Button>Back to Warranties</Button>
        </Link>
      </div>
    );
  }

  const status =
    statusConfig[warranty.status as keyof typeof statusConfig] ||
    statusConfig.ACTIVE;
  const StatusIcon = status.icon;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Warranties
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{warranty.productName}</h1>
          <p className="text-sm text-muted-foreground font-mono">
            {warranty.uniqueId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`text-base px-4 py-2 ${status.className}`}>
            <StatusIcon className="w-4 h-4 mr-2" />
            {status.label}
          </Badge>
          {warranty.status === "ACTIVE" && (
            <Button onClick={() => setShowClaimForm(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Claim Warranty
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${status.className}`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">{status.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {status.description}
                  </p>
                  {warranty.status === "ACTIVE" && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2.5 max-w-xs">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${(warranty.daysRemaining / (warranty.totalDays || 365)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {warranty.daysRemaining} days remaining
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Details */}
          <Card>
            <CardHeader>
              <CardTitle>Warranty Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {new Date(warranty.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {new Date(warranty.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {warranty.durationMonths} months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sale Type</p>
                  <p className="font-medium">{warranty.saleType}</p>
                </div>
              </div>

              {warranty.terms && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Terms:</span> {warranty.terms}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{warranty.productName}</p>
              <p className="text-muted-foreground font-mono">
                {warranty.uniqueId}
              </p>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{warranty.customerName}</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3 h-3" />
                {warranty.customerPhone}
              </p>
              {warranty.customerEmail && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  {warranty.customerEmail}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Seller Info */}
          {warranty.sellerName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{warranty.sellerName}</p>
                {warranty.saleType === "Offline" && (
                  <p className="text-muted-foreground">Offline Purchase</p>
                )}
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
          onSubmit={claimWarranty}
          isLoading={isClaiming}
        />
      )}
    </div>
  );
}

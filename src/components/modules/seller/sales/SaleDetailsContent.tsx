"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { SellerSaleDetail } from "@/lib/types/seller.types";
import {
  ArrowLeft,
  Printer,
  Receipt,
  User,
  Phone,
  Mail,
  Barcode,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Package,
} from "lucide-react";

export default function SaleDetailsContent({ sale }: { sale: SellerSaleDetail }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto print:p-0 print:max-w-none">
      {/* Header & Back Link (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <Link
            href="/seller/sales"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Sales History
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Invoice #{sale.invoiceNumber}
            </h1>
            <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase">
              Completed
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Registered on{" "}
            {new Date(sale.date || sale.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <Button
          onClick={handlePrint}
          className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 gap-2 shrink-0"
        >
          <Printer className="h-4 w-4" />
          <span>Print Receipt</span>
        </Button>
      </div>

      {/* Official Printable Invoice Receipt Card */}
      <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden print:shadow-none print:border print:rounded-none">
        {/* Receipt Top Header */}
        <div className="p-6 sm:p-8 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-xl">
              JEE
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">JEE Electronics Store</h2>
              <p className="text-xs text-muted-foreground">Official Offline Sales Receipt & Guarantee Certificate</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="font-mono text-sm font-bold text-foreground">INVOICE: {sale.invoiceNumber}</p>
            <p className="text-xs text-muted-foreground">
              Date: {new Date(sale.date || sale.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Customer & Merchant Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Buyer Details */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customer Information
              </p>
              <div className="space-y-1">
                <p className="font-bold text-sm text-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>{sale.customerName}</span>
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{sale.customerPhone}</span>
                </p>
                {sale.customerEmail && (
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{sale.customerEmail}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Payment & Transaction Info */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Payment Method & Notes
              </p>
              <div className="space-y-1">
                <p className="text-xs text-foreground font-semibold">
                  Payment Method:{" "}
                  <Badge variant="outline" className="font-mono text-[11px] ml-1">
                    {sale.paymentMethod}
                  </Badge>
                </p>
                {sale.notes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Notes: <span className="text-foreground">{sale.notes}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Purchased Product Item Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs text-muted-foreground font-semibold uppercase">
                <tr>
                  <th className="p-4">Item Description</th>
                  <th className="p-4">Serial Number</th>
                  <th className="p-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4">
                    <p className="font-bold text-foreground text-sm">{sale.productName}</p>
                    {sale.sku && (
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">Model SKU: {sale.sku}</p>
                    )}
                    {sale.variantAttributes && Object.keys(sale.variantAttributes).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {Object.entries(sale.variantAttributes).map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize"
                          >
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                      <Barcode className="h-4 w-4" />
                      <span>{sale.serialNumber}</span>
                    </p>
                  </td>
                  <td className="p-4 text-right font-bold text-foreground tabular-nums">
                    ৳{sale.salePrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal Price:</span>
                <span className="font-mono tabular-nums">৳{sale.salePrice.toLocaleString()}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-mono tabular-nums">-৳{sale.discount.toLocaleString()}</span>
                </div>
              )}
              {sale.tax > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tax:</span>
                  <span className="font-mono tabular-nums">+৳{sale.tax.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-foreground border-t border-border pt-2">
                <span>Total Paid:</span>
                <span className="font-mono tabular-nums">৳{sale.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Official Warranty Certificate Box */}
          <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground text-sm sm:text-base">
                  Official Digital Warranty Certificate
                </h3>
              </div>
              <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-xs font-bold">
                {sale.warranty?.status || "ACTIVE"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This unit is protected under official manufacturer warranty. The customer can verify coverage anytime at{" "}
              <span className="font-bold text-primary">jee.store/warranty</span> by scanning the box QR code or entering serial{" "}
              <span className="font-mono font-bold text-foreground">{sale.serialNumber}</span>.
            </p>
            {sale.warranty?.terms && (
              <p className="text-[11px] text-muted-foreground pt-1 border-t border-primary/10">
                Terms: {sale.warranty.terms}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

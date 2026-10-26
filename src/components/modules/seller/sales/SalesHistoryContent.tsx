"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  Eye,
  PlusCircle,
  Calendar,
  Receipt,
  ShieldCheck,
  User,
  ShoppingBag,
} from "lucide-react";
import type { SellerSaleItem } from "@/lib/types/seller.types";

export default function SalesHistoryContent({
  sales = [],
}: {
  sales: SellerSaleItem[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getWarrantyBadge = (status?: string) => {
    const s = String(status || "Active");
    if (s.toLowerCase().includes("active")) {
      return (
        <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-[11px] font-bold">
          Active
        </Badge>
      );
    }
    if (s.toLowerCase().includes("claimed")) {
      return (
        <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-700 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
          Claimed
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px] font-bold">
        {s}
      </Badge>
    );
  };

  const safeSales = Array.isArray(sales) ? sales : [];

  const filteredSales = safeSales.filter((sale) => {
    if (!sale) return false;
    const q = searchTerm.trim().toLowerCase();
    const pName = (sale.product || sale.productName || "").toLowerCase();
    const uId = (sale.uniqueId || sale.serialNumber || "").toLowerCase();
    const cName = (sale.customerName || "").toLowerCase();
    const cPhone = String(sale.customerPhone || "");
    const inv = (sale.invoiceNumber || sale.id || "").toLowerCase();

    const matchesSearch =
      !q ||
      pName.includes(q) ||
      uId.includes(q) ||
      cName.includes(q) ||
      cPhone.includes(q) ||
      inv.includes(q);

    if (!matchesSearch) return false;

    if (dateFilter === "ALL") return true;

    const rawTime = sale.createdAt || sale.date;
    const saleDate = new Date(rawTime);
    if (isNaN(saleDate.getTime())) return true;

    const now = new Date();
    if (dateFilter === "TODAY") {
      return saleDate.toDateString() === now.toDateString();
    }
    if (dateFilter === "THIS_WEEK") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return saleDate >= weekAgo;
    }
    if (dateFilter === "THIS_MONTH") {
      return (
        saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage) || 1;
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto px-1 sm:px-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
              📋
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Sales History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            View all recorded offline sales, printed invoices, and active warranties.
          </p>
        </div>

        <Link href="/seller/sales/new">
          <Button className="w-full sm:w-auto h-11 sm:h-12 px-5 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 text-xs sm:text-sm">
            <PlusCircle className="mr-1.5 h-4 w-4" /> New Offline Sale
          </Button>
        </Link>
      </div>

      {/* Filters Card */}
      <Card className="rounded-2xl sm:rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row gap-2.5 sm:gap-3 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by invoice, product, serial, customer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-10 sm:h-11 rounded-xl bg-white border-slate-200 focus:border-blue-500 text-xs sm:text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 sm:h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
            </select>
          </div>
        </div>

        <CardContent className="p-0">
          {filteredSales.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-2">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Receipt className="h-5 w-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                No transactions found
              </h3>
              <p className="text-xs text-slate-500">
                No recorded sales match your search or date filter.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View (sm:hidden) */}
              <div className="divide-y divide-slate-100 sm:hidden">
                {paginatedSales.map((sale) => {
                  const price = sale.price ?? sale.salePrice ?? sale.amount ?? 0;
                  return (
                    <div key={sale.id} className="p-3.5 space-y-2.5 bg-white">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {sale.invoiceNumber || sale.id.slice(-8)}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {sale.date}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-1 truncate">
                            {sale.product || sale.productName}
                          </h4>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-black text-sm text-slate-900 tabular-nums block">
                            ৳ {price.toLocaleString()}
                          </span>
                          {getWarrantyBadge(sale.warrantyStatus || sale.status)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600 min-w-0 truncate">
                          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">
                            {sale.customerName || "Walk-in Customer"}
                          </span>
                        </div>

                        <Link href={`/seller/sales/${sale.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50 text-xs font-bold"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Data Table (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Invoice & Date</th>
                      <th className="px-5 py-3.5">Product</th>
                      <th className="px-5 py-3.5">Serial Number</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5 text-right">Amount</th>
                      <th className="px-5 py-3.5 text-center">Warranty</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedSales.map((sale) => {
                      const price = sale.price ?? sale.salePrice ?? sale.amount ?? 0;
                      return (
                        <tr
                          key={sale.id}
                          className="hover:bg-slate-50/50 transition-colors bg-white"
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-bold text-xs text-blue-600 block">
                              {sale.invoiceNumber || sale.id.slice(-8)}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {sale.date}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900">
                            {sale.product || sale.productName}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">
                            <span className="bg-slate-100 px-2 py-0.5 rounded">
                              {sale.uniqueId || sale.serialNumber}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-800">
                            <div className="font-semibold">
                              {sale.customerName || "Walk-in Customer"}
                            </div>
                            {sale.customerPhone && sale.customerPhone !== "—" && (
                              <div className="text-[11px] text-slate-400 font-mono">
                                {sale.customerPhone}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right font-black text-slate-900 tabular-nums">
                            ৳ {price.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {getWarrantyBadge(sale.warrantyStatus || sale.status)}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Link href={`/seller/sales/${sale.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-semibold">
            <span>
              Page {currentPage} of {totalPages} ({filteredSales.length} total)
            </span>
            <div className="flex gap-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-lg bg-white text-xs"
              >
                Previous
              </Button>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-lg bg-white text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

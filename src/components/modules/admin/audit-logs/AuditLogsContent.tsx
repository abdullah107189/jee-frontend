"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  Download,
  Eye,
  ShieldCheck,
  X,
  Code2,
  Calendar,
  User,
  Globe,
} from "lucide-react";
import type { AuditLog } from "@/services/admin.service";
import { toast } from "sonner";

export default function AdminAuditLogsPage({ logs = [] }: { logs: AuditLog[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionCategory, setActionCategory] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const safeLogs = Array.isArray(logs) ? logs : [];

  const filteredLogs = safeLogs.filter((log) => {
    const userEmail = (log.userEmail || "").toLowerCase();
    const userName = (log.user || "").toLowerCase();
    const entity = (log.entity || "").toLowerCase();
    const action = (log.action || "").toLowerCase();
    const details = (log.details || "").toLowerCase();
    const ip = (log.ipAddress || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      userEmail.includes(search) ||
      userName.includes(search) ||
      entity.includes(search) ||
      action.includes(search) ||
      details.includes(search) ||
      ip.includes(search);

    let matchesCategory = true;
    if (actionCategory === "SELLER") {
      matchesCategory = log.action.toUpperCase().includes("SELLER");
    } else if (actionCategory === "WARRANTY") {
      matchesCategory = log.action.toUpperCase().includes("WARRANTY");
    } else if (actionCategory === "BRAND") {
      matchesCategory =
        log.action.toUpperCase().includes("BRAND") ||
        log.action.toUpperCase().includes("CATEGORY");
    } else if (actionCategory === "USER") {
      matchesCategory =
        log.action.toUpperCase().includes("USER") ||
        log.action.toUpperCase().includes("LOGIN");
    } else if (actionCategory === "SYSTEM") {
      matchesCategory =
        log.action.toUpperCase().includes("SYSTEM") ||
        log.action.toUpperCase().includes("INIT");
    }

    return matchesSearch && matchesCategory;
  });

  const handleExportLogsCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No audit logs available to export.");
      return;
    }

    const headers = [
      "ID",
      "Timestamp",
      "User",
      "Email",
      "Action",
      "Entity",
      "Details",
      "IP Address",
      "Severity",
    ];

    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${(l.user || "").replace(/"/g, '""')}"`,
      `"${(l.userEmail || "").replace(/"/g, '""')}"`,
      `"${l.action}"`,
      `"${(l.entity || "").replace(/"/g, '""')}"`,
      `"${(l.details || "").replace(/"/g, '""')}"`,
      `"${l.ipAddress || ""}"`,
      `"${l.severity || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `jee_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredLogs.length} audit logs to CSV`);
  };

  const getActionBadge = (action: string) => {
    const act = (action || "").toUpperCase();
    if (act.includes("APPROVED") || act.includes("ACTIVE")) {
      return (
        <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
          {action}
        </Badge>
      );
    }
    if (act.includes("DELETE") || act.includes("VOID") || act.includes("SUSPEND")) {
      return (
        <Badge variant="destructive" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
          {action}
        </Badge>
      );
    }
    if (act.includes("CREATE") || act.includes("INIT")) {
      return (
        <Badge className="bg-blue-600 text-white rounded-full px-2.5 py-0.5 text-xs font-semibold hover:bg-blue-700">
          {action}
        </Badge>
      );
    }
    if (act.includes("UPDATE") || act.includes("REPAIR")) {
      return (
        <Badge variant="warning" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
          {action}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs text-slate-700 font-semibold border-slate-300">
        {action}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              System Audit Logs
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="h-3 w-3" /> Live Tracking
            </span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">
            Immutable security trails, administrative decisions, and data state modifications.
          </p>
        </div>
        <Button
          onClick={handleExportLogsCSV}
          className="h-10 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/20 font-bold"
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV Logs ({filteredLogs.length})
        </Button>
      </div>

      {/* Table & Filters */}
      <Card className="rounded-2xl sm:rounded-[2rem] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border bg-card flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search audit logs by email, user, entity ID, IP, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 sm:h-12 rounded-xl w-full"
            />
          </div>
          <select
            value={actionCategory}
            onChange={(e) => setActionCategory(e.target.value)}
            className="h-10 sm:h-12 rounded-xl border border-input bg-background dark:bg-muted/40 px-4 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Categories</option>
            <option value="SELLER">Seller Management</option>
            <option value="WARRANTY">Warranties & Claims</option>
            <option value="BRAND">Brands & Catalog</option>
            <option value="USER">User & Authentication</option>
            <option value="SYSTEM">System Events</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-medium">
              <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-base font-bold text-foreground">No audit logs matching search parameters.</p>
              <p className="text-xs text-muted-foreground mt-1">
                All administrative updates, approvals, and mutations are automatically logged here in real time.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-muted-foreground whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-muted-foreground whitespace-nowrap">
                    User & Email
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-muted-foreground whitespace-nowrap">
                    Action Type
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-muted-foreground whitespace-nowrap">
                    Target Entity
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-muted-foreground whitespace-nowrap">
                    Details
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-muted-foreground text-right whitespace-nowrap">
                    IP Address
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-muted-foreground text-center whitespace-nowrap">
                    Inspect
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors bg-card">
                    <td className="px-4 sm:px-6 py-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-foreground">{log.user}</div>
                      <div className="text-xs text-muted-foreground font-mono">{log.userEmail}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                      {log.entity}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs text-foreground/80 max-w-sm truncate">
                      {log.details}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted"
                        title="View Audit Payload"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-card border border-border text-card-foreground rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">Audit Trail Entry</h3>
                  <p className="text-xs text-muted-foreground font-mono">ID: {selectedLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/40 p-3 rounded-2xl border border-border">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
                  <User className="h-3.5 w-3.5" /> Performed By
                </div>
                <div className="font-bold text-foreground">{selectedLog.user}</div>
                <div className="text-xs font-mono text-muted-foreground">{selectedLog.userEmail}</div>
              </div>

              <div className="bg-muted/40 p-3 rounded-2xl border border-border">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5" /> Timestamp & IP
                </div>
                <div className="font-mono text-xs font-bold text-foreground">{selectedLog.timestamp}</div>
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {selectedLog.ipAddress}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5" /> State Modifications & Payload
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed border border-border">
                {selectedLog.rawChanges
                  ? JSON.stringify(selectedLog.rawChanges, null, 2)
                  : JSON.stringify({ details: selectedLog.details }, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl px-6 font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

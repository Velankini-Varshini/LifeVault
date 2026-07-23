"use client";

import React from "react";
import { HardDrive, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useDashboardData } from "@/components/dashboard/dashboard-data";

const CATEGORY_COLORS: Record<string, string> = {
  Identity: "bg-indigo-500",
  Insurance: "bg-emerald-500",
  Housing: "bg-amber-500",
  Medical: "bg-rose-500",
  Education: "bg-sky-500",
  Financial: "bg-purple-500",
  Other: "bg-slate-400",
};

const LIMIT_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

export function StorageUsageCard() {
  const { categoryCounts, overviewStats, loading } = useDashboardData();

  // Pull actual storage used from overviewStats
  const storageStat = overviewStats.find((s) => s.icon === "shield");
  const usedLabel = storageStat?.value ?? "0 MB";

  // Parse MB value for percentage
  const usedMB = parseFloat(usedLabel.replace(/[^0-9.]/g, "")) || 0;
  const usedPct = Math.min((usedMB / (5 * 1024)) * 100, 100).toFixed(1); // 5 GB = 5120 MB

  const categories = Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({ name, count, color: CATEGORY_COLORS[name] ?? "bg-slate-400" }));

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-sm text-slate-500">Loading storage...</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <HardDrive className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              Vault Storage Capacity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {usedLabel} of 5.0 GB used ({usedPct}%)
            </p>
          </div>
        </div>

        <Link
          href="/settings"
          className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900 transition-colors"
        >
          <span>Upgrade</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Storage Bar */}
      <div>
        {categories.length > 0 ? (
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {categories.map((cat, idx) => {
              const pct = Math.max(1, (cat.count / Math.max(1, categories.reduce((a, c) => a + c.count, 0))) * 100);
              return (
                <div
                  key={cat.name}
                  className={`h-full ${cat.color} ${idx === 0 ? "rounded-l-full" : ""} ${idx === categories.length - 1 ? "rounded-r-full" : ""}`}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-full rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        )}
      </div>

      {/* Breakdown List */}
      {categories.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-2">No documents yet. Upload files to see the breakdown.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
          {categories.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} />
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                {item.count} file{item.count !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>256-bit AES Encryption active • Automated OCR indexing enabled</span>
      </div>
    </div>
  );
}

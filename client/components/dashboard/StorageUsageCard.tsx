"use client";

import React from "react";
import { HardDrive, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function StorageUsageCard() {
  const categoriesBreakdown = [
    { name: "Identity & Passports", count: 10, size: "420 MB", color: "bg-indigo-500" },
    { name: "Insurance Policies", count: 8, size: "380 MB", color: "bg-emerald-500" },
    { name: "Housing & Property", count: 6, size: "220 MB", color: "bg-amber-500" },
    { name: "Medical & Health", count: 5, size: "120 MB", color: "bg-rose-500" },
    { name: "Education & Certificates", count: 3, size: "60 MB", color: "bg-sky-500" },
  ];

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
            <p className="text-xs text-slate-500 dark:text-slate-400">1.2 GB of 5.0 GB used (24%)</p>
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
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full w-[35%] bg-indigo-600 rounded-l-full" />
          <div className="h-full w-[25%] bg-emerald-500" />
          <div className="h-full w-[18%] bg-amber-500" />
          <div className="h-full w-[12%] bg-rose-500" />
          <div className="h-full w-[10%] bg-sky-500 rounded-r-full" />
        </div>
      </div>

      {/* Breakdown List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        {categoriesBreakdown.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} />
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
              {item.count} files ({item.size})
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>256-bit AES Encryption active • Automated OCR indexing enabled</span>
      </div>
    </div>
  );
}

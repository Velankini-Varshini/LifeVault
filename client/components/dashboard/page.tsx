"use client";

import React from "react";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ExpiringSoon } from "@/components/dashboard/ExpiringSoon";
import { RecentUploads } from "@/components/dashboard/RecentUploads";
import { RecentAISearches } from "@/components/dashboard/RecentAISearches";
import { DocumentCategoriesGrid } from "@/components/dashboard/DocumentCategoriesGrid";
import { StorageUsageCard } from "@/components/dashboard/StorageUsageCard";
import { ShieldCheck, Sparkles, Bell } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-xl dark:border-slate-800">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                Vault Health 92%
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                AI Indexed
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good morning, Priya
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl">
              Your digital vault is encrypted & active. You have 2 documents expiring within 30 days and 3 shared policies.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/notifications"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              <span>2 Expiry Warnings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Statistics 2x2 Grid */}
      <OverviewCards />

      {/* Document Categories Grid */}
      <DocumentCategoriesGrid />

      {/* Analytics Chart & Expiry Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <ExpiringSoon />
      </div>

      {/* Recent Uploads & AI Suggestions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentUploads />
        <RecentAISearches />
      </div>

      {/* Storage Capacity & Breakdown */}
      <StorageUsageCard />
    </div>
  );
}

"use client";

import { Files, Users, Clock, ShieldCheck, TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { overviewStats, type OverviewStat } from "@/components/dashboard/dashboard-data";

const iconMap: Record<OverviewStat["icon"], LucideIcon> = {
  files: Files,
  users: Users,
  clock: Clock,
  shield: ShieldCheck,
};

const trendMap: Record<OverviewStat["trend"], { icon: LucideIcon; className: string }> = {
  up: { icon: TrendingUp, className: "text-emerald-600 dark:text-emerald-400" },
  down: { icon: TrendingDown, className: "text-amber-600 dark:text-amber-400" },
  flat: { icon: Minus, className: "text-slate-400 dark:text-slate-500" },
};

export function OverviewCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 max-w-full">
      {overviewStats.map((stat) => {
        const Icon = iconMap[stat.icon];
        const Trend = trendMap[stat.trend].icon;
        return (
          <div
            key={stat.label}
            className="group flex flex-col justify-between h-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 cursor-pointer active:scale-[0.98]"
          >
            {/* Top Row: Numeric Value + Top-Right Icon */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                    {stat.label}
                  </div>
                </div>

                <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                  <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </span>
              </div>
            </div>

            {/* Bottom Row: Trend Indicator */}
            <div className={`mt-2.5 sm:mt-3 flex items-center gap-1 border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[10px] sm:text-xs font-semibold ${trendMap[stat.trend].className}`}>
              <Trend className="h-3 w-3 shrink-0" />
              <span className="truncate">{stat.delta}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

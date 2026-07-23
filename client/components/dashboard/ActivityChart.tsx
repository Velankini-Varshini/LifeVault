"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardData } from "@/components/dashboard/dashboard-data";

export function ActivityChart() {
  const { recentUploads, loading } = useDashboardData();

  // Build a simple chart showing uploads per day from recent uploads (last 7 days)
  const today = new Date();
  const days: { label: string; documents: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = d.toLocaleDateString();
    const count = recentUploads.filter((u) => u.uploadedAt === dateStr).length;
    days.push({ label, documents: count });
  }

  const hasData = days.some((d) => d.documents > 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">Vault activity</h3>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-600" /> Uploaded Documents
          </span>
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading...</div>
        ) : !hasData ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-slate-400">No upload activity yet</p>
            <p className="text-xs text-slate-300 dark:text-slate-600">Activity will appear here once you upload documents</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={days} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="docsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94A3B8" }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} width={28} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="documents"
                stroke="#4F46E5"
                strokeWidth={2}
                fill="url(#docsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

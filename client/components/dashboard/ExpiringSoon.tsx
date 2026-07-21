import Link from "next/link";
import { expiringItems, type ExpiryItem } from "@/components/dashboard/dashboard-data";

const statusStyles: Record<ExpiryItem["status"], string> = {
  safe: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800/50",
  soon: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/50",
  urgent: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800/50",
};

const barStyles: Record<ExpiryItem["status"], string> = {
  safe: "bg-emerald-500",
  soon: "bg-amber-500",
  urgent: "bg-red-650",
};

export function ExpiringSoon() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">Expiring soon</h3>
        <Link href="/notifications" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
          See all →
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
        {expiringItems.map((item) => (
          <li key={item.label} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800/60 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.category}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-xs font-medium ring-1 ${statusStyles[item.status]}`}
              >
                {item.daysLeft}d
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${barStyles[item.status]}`}
                style={{ width: `${Math.min(100, (item.daysLeft / 120) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

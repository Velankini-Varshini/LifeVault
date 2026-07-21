import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { recentSearches } from "@/components/dashboard/dashboard-data";

export function RecentAISearches() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">Recent AI searches</h3>
        <Link href="/ai-assistant" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
          Open assistant →
        </Link>
      </div>

      <ul className="mt-4 space-y-1">
        {recentSearches.map((item) => (
          <li key={item.query}>
            <button className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-700 dark:text-slate-300">{item.query}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{item.answeredAt}</p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-indigo-500 dark:text-slate-655 dark:group-hover:text-indigo-400" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export function RecentAISearches() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">Recent AI searches</h3>
        <Link href="/ai-assistant" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
          Open assistant →
        </Link>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 py-6 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <Sparkles className="h-5 w-5 text-indigo-400" />
        </span>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No searches yet</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
          Ask the AI assistant questions about your documents and they will appear here.
        </p>
        <Link
          href="/ai-assistant"
          className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Try asking something
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

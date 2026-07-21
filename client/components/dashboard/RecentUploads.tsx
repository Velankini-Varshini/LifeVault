import Link from "next/link";
import { FileText, MoreHorizontal } from "lucide-react";
import { recentUploads, type RecentUpload } from "@/components/dashboard/dashboard-data";

const statusStyles: Record<RecentUpload["status"], string> = {
  processed: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-450 dark:ring-emerald-800/50",
  processing: "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:ring-indigo-800/50",
  "action-needed": "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800/50",
};

const statusLabel: Record<RecentUpload["status"], string> = {
  processed: "Processed",
  processing: "Processing",
  "action-needed": "Action needed",
};

export function RecentUploads() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">Recent uploads</h3>
        <Link href="/documents" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
          View vault →
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {recentUploads.map((doc) => (
          <li key={doc.name} className="flex items-center gap-3 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-850">
              <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-200">{doc.name}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-450">
                {doc.category} · {doc.uploadedAt}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusStyles[doc.status]}`}
            >
              {statusLabel[doc.status]}
            </span>
            <button
              aria-label="More actions"
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-650 dark:hover:bg-slate-800 dark:hover:text-slate-350"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

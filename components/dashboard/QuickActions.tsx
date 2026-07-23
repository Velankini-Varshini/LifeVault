import Link from "next/link";
import { UploadCloud, Files, Sparkles, Users, type LucideIcon } from "lucide-react";
import { quickActions, type QuickAction } from "@/components/dashboard/dashboard-data";

const iconMap: Record<QuickAction["icon"], LucideIcon> = {
  upload: UploadCloud,
  files: Files,
  sparkles: Sparkles,
  users: Users,
};

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">Quick actions</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon];
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/20"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-655 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-indigo-905 dark:group-hover:text-indigo-400">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-650 dark:text-slate-200 dark:group-hover:text-indigo-400">{action.label}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-450">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

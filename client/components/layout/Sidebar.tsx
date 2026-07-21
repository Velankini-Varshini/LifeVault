"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderLock,
  UploadCloud,
  Users,
  Sparkles,
  Bell,
  Settings,
  Vault,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Document vault", href: "/documents", icon: FolderLock },
  { label: "Upload", href: "/upload", icon: UploadCloud },
  { label: "Family sharing", href: "/family", icon: Users },
  { label: "AI assistant", href: "/ai-assistant", icon: Sparkles },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ onMobileItemClick }: { onMobileItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
          <Vault className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
        </span>
        <span className="font-display text-base font-semibold tracking-tight text-slate-900 dark:text-white">
          LifeVault <span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileItemClick}
              className={`flex min-h-[44px] items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800 shrink-0">
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
          <p className="text-xs font-semibold text-slate-900 dark:text-white">Personal plan</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">32 / 50 documents used</p>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full w-[64%] rounded-full bg-indigo-600" />
          </div>
          <Link
            href="/settings"
            onClick={onMobileItemClick}
            className="mt-3 inline-flex min-h-[36px] items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Upgrade plan →
          </Link>
        </div>
      </div>
    </div>
  );
}

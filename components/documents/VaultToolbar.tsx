"use client";

import Link from "next/link";
import { Search, LayoutGrid, List, UploadCloud, SlidersHorizontal } from "lucide-react";
import { documentCategories, type DocumentCategory } from "@/components/documents/vault-data";

export type ViewMode = "grid" | "list";
export type StatusFilter = "all" | "expiring" | "expired";

export function VaultToolbar({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  statusFilter,
  onStatusFilterChange,
  view,
  onViewChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  activeCategory: DocumentCategory | "all";
  onCategoryChange: (v: DocumentCategory | "all") => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Document vault
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            9 documents · 2 expiring within 30 days
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              aria-label="Grid view"
              onClick={() => onViewChange("grid")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer transition-colors ${
                view === "grid" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <LayoutGrid className="h-4.5 w-4.5" />
            </button>
            <button
              aria-label="List view"
              onClick={() => onViewChange("list")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer transition-colors ${
                view === "list" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <List className="h-4.5 w-4.5" />
            </button>
          </div>

          <Link
            href="/upload"
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:scale-95 cursor-pointer"
          >
            <UploadCloud className="h-4.5 w-4.5" />
            Upload
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            type="text"
            placeholder="Search documents…"
            className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </span>
          <FilterChip
            active={activeCategory === "all"}
            onClick={() => onCategoryChange("all")}
            label="All categories"
          />
          {documentCategories.map((cat) => (
            <FilterChip
              key={cat}
              active={activeCategory === cat}
              onClick={() => onCategoryChange(cat)}
              label={cat}
            />
          ))}

          <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

          <FilterChip
            active={statusFilter === "all"}
            onClick={() => onStatusFilterChange("all")}
            label="Any status"
          />
          <FilterChip
            active={statusFilter === "expiring"}
            onClick={() => onStatusFilterChange("expiring")}
            label="Expiring soon"
          />
          <FilterChip
            active={statusFilter === "expired"}
            onClick={() => onStatusFilterChange("expired")}
            label="Expired"
          />
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border min-h-[36px] px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer active:scale-95 ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {label}
    </button>
  );
}

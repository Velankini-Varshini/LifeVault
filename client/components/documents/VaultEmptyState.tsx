import { FolderSearch } from "lucide-react";

export function VaultEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
        <FolderSearch className="h-5 w-5 text-slate-400" />
      </span>
      <h3 className="mt-4 font-display text-sm font-semibold text-slate-900">
        No documents match those filters
      </h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        Try a different search term or clear the category and status filters.
      </p>
      <button
        onClick={onClear}
        className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Clear filters
      </button>
    </div>
  );
}

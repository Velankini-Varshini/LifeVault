"use client";

import { X, FileText, Image as ImageIcon, Download, Share2, Trash2 } from "lucide-react";
import type { VaultDocument } from "@/components/documents/vault-data";
import { StatusBadge } from "@/components/documents/StatusBadge";

export function QuickPreviewDrawer({
  doc,
  onClose,
}: {
  doc: VaultDocument | null;
  onClose: () => void;
}) {
  if (!doc) return null;
  const Icon = doc.fileKind === "pdf" ? FileText : ImageIcon;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative flex h-full w-full sm:max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">Quick preview</h2>
          <button
            aria-label="Close preview"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
            <Icon className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          </div>

          <div className="mt-6 flex items-start justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">{doc.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {doc.category} · {doc.sizeLabel}
              </p>
            </div>
            <StatusBadge status={doc.status} />
          </div>

          <dl className="mt-6 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5">
            <div className="flex items-center justify-between text-sm">
              <dt className="text-slate-500 dark:text-slate-400">Uploaded</dt>
              <dd className="font-mono text-slate-900 dark:text-slate-200">{doc.uploadedAt}</dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-slate-500 dark:text-slate-400">Expiry date</dt>
              <dd className="font-mono text-slate-900 dark:text-slate-200">{doc.expiryDate ?? "No expiry"}</dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-slate-500 dark:text-slate-400">Category</dt>
              <dd className="text-slate-900 dark:text-slate-200">{doc.category}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              AI summary
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{doc.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 cursor-pointer transition-transform">
            <Download className="h-4.5 w-4.5" />
            Download
          </button>
          <button 
            aria-label="Share document"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95 cursor-pointer transition-transform"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
          <button 
            aria-label="Delete document"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 dark:border-slate-800 dark:text-red-400 dark:hover:bg-red-950/30 active:scale-95 cursor-pointer transition-transform"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

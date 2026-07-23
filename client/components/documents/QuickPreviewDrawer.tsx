"use client";

import { useState, useEffect } from "react";
import { X, FileText, Image as ImageIcon, Download, Share2, Trash2, Check, ExternalLink, Loader2 } from "lucide-react";
import type { VaultDocument } from "@/components/documents/vault-data";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { createClient } from "@/utils/supabase/client";

export function QuickPreviewDrawer({
  doc,
  onClose,
  onDelete,
}: {
  doc: VaultDocument | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const supabase = createClient();

  // Parse storage path from the stored file URL
  const getStoragePath = (url: string): string | null => {
    try {
      const u = new URL(url);
      const marker = "/object/public/documents/";
      const idx = u.pathname.indexOf(marker);
      if (idx !== -1) return u.pathname.slice(idx + marker.length);
      return null;
    } catch {
      return null;
    }
  };

  // Generate a fresh 10-minute signed URL whenever the doc changes
  useEffect(() => {
    setPreviewUrl(null);
    if (!doc?.fileUrl) return;
    const path = getStoragePath(doc.fileUrl);
    if (!path) return;
    setPreviewLoading(true);
    supabase.storage
      .from("documents")
      .createSignedUrl(path, 600)
      .then(({ data }) => {
        if (data?.signedUrl) setPreviewUrl(data.signedUrl);
      })
      .finally(() => setPreviewLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id]);

  if (!doc) return null;

  const isPdf = doc.fileKind === "pdf";
  const Icon = isPdf ? FileText : ImageIcon;

  const handleDownload = async () => {
    if (!doc.fileUrl) return;
    setDownloading(true);
    try {
      const path = getStoragePath(doc.fileUrl);
      if (path) {
        const { data } = await supabase.storage.from("documents").createSignedUrl(path, 60);
        if (data?.signedUrl) {
          const a = document.createElement("a");
          a.href = data.signedUrl;
          a.download = doc.name;
          a.click();
          return;
        }
      }
      window.open(doc.fileUrl, "_blank");
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!doc.fileUrl) return;
    try {
      const path = getStoragePath(doc.fileUrl);
      let shareUrl = doc.fileUrl;
      if (path) {
        const { data } = await supabase.storage.from("documents").createSignedUrl(path, 60 * 60 * 24 * 7);
        if (data?.signedUrl) shareUrl = data.signedUrl;
      }
      if (navigator.share) {
        await navigator.share({ title: doc.name, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const path = getStoragePath(doc.fileUrl || "");
      if (path) await supabase.storage.from("documents").remove([path]);
      onDelete?.(doc.id);
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative flex h-full w-full sm:max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white truncate pr-4">{doc.name}</h2>
          <button
            aria-label="Close preview"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Inline Preview */}
          <div
            className="relative mx-6 mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
            style={{ minHeight: "220px" }}
          >
            {previewLoading ? (
              <div className="flex h-56 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : previewUrl ? (
              isPdf ? (
                <iframe
                  src={`${previewUrl}#toolbar=0`}
                  className="w-full rounded-2xl"
                  style={{ height: "320px" }}
                  title={doc.name}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={doc.name}
                  className="w-full rounded-2xl object-contain"
                  style={{ maxHeight: "320px" }}
                />
              )
            ) : (
              <div className="flex h-56 flex-col items-center justify-center gap-2">
                <Icon className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                <p className="text-xs text-slate-400">Preview unavailable</p>
              </div>
            )}

            {/* Open in new tab (signed URL) */}
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-white border border-slate-200/80 dark:bg-slate-900/90 dark:text-slate-300 dark:border-slate-700 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </a>
            )}
          </div>

          {/* Metadata */}
          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {doc.category} · {doc.sizeLabel}
              </p>
              <StatusBadge status={doc.status} />
            </div>

            <dl className="mt-5 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between text-sm">
                <dt className="text-slate-500 dark:text-slate-400">Uploaded</dt>
                <dd className="font-mono text-slate-900 dark:text-slate-200">{doc.uploadedAt}</dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="text-slate-500 dark:text-slate-400">Expiry date</dt>
                <dd className="font-mono text-slate-900 dark:text-slate-200">{doc.expiryDate ?? "No expiry"}</dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="text-slate-500 dark:text-slate-400">Type</dt>
                <dd className="uppercase font-mono text-slate-900 dark:text-slate-200">{doc.fileKind}</dd>
              </div>
              {doc.metadata?.person_name && (
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-slate-500 dark:text-slate-400">Name on doc</dt>
                  <dd className="text-slate-900 dark:text-slate-200">{doc.metadata.person_name}</dd>
                </div>
              )}
              {doc.metadata?.document_number && (
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-slate-500 dark:text-slate-400">Doc number</dt>
                  <dd className="font-mono text-slate-900 dark:text-slate-200">{doc.metadata.document_number}</dd>
                </div>
              )}
            </dl>

            {doc.summary && (
              <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">AI summary</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{doc.summary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2.5 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 cursor-pointer transition-all disabled:opacity-60"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download
          </button>

          <button
            onClick={handleShare}
            title={copied ? "Copied!" : "Share or copy link"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95 cursor-pointer transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete document"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 dark:border-slate-800 dark:text-red-400 dark:hover:bg-red-950/30 active:scale-95 cursor-pointer transition-all disabled:opacity-60"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Copied toast */}
        {copied && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-slate-700 pointer-events-none">
            Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}

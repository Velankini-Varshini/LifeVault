import { FileText, Image as ImageIcon } from "lucide-react";
import type { VaultDocument } from "@/components/documents/vault-data";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { ActionsMenu } from "@/components/documents/ActionsMenu";

export function DocumentRow({
  doc,
  onOpen,
}: {
  doc: VaultDocument;
  onOpen: () => void;
}) {
  const Icon = doc.fileKind === "pdf" ? FileText : ImageIcon;

  return (
    <div
      onClick={onOpen}
      className="grid w-full grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-3 sm:gap-4 border-b border-slate-100 px-3 py-3.5 text-left last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40 cursor-pointer min-h-[48px]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 shrink-0">
        <Icon className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{doc.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{doc.uploadedAt}</p>
      </div>
      <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block shrink-0">{doc.category}</span>
      <span className="hidden font-mono text-xs text-slate-500 dark:text-slate-400 md:block shrink-0">
        {doc.expiryDate ?? "—"}
      </span>
      <StatusBadge status={doc.status} />
      <span onClick={(e) => e.stopPropagation()} className="shrink-0">
        <ActionsMenu onPreview={onOpen} />
      </span>
    </div>
  );
}

import { FileText, Image as ImageIcon } from "lucide-react";
import type { VaultDocument } from "@/components/documents/vault-data";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { ActionsMenu } from "@/components/documents/ActionsMenu";

export function DocumentCard({
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
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 cursor-pointer active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-indigo-50 dark:bg-slate-800 dark:group-hover:bg-indigo-950/50">
          <Icon className="h-5.5 w-5.5 text-slate-500 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400" />
        </span>
        <ActionsMenu onPreview={onOpen} />
      </div>

      <h3 className="mt-4 truncate font-display text-sm font-semibold text-slate-900 dark:text-white">
        {doc.name}
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {doc.category} · {doc.sizeLabel}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          {doc.expiryDate ? `Expires ${doc.expiryDate}` : "No expiry"}
        </span>
        <StatusBadge status={doc.status} />
      </div>
    </div>
  );
}

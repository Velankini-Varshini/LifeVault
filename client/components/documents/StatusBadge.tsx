import type { DocumentStatus } from "@/components/documents/vault-data";

const styles: Record<DocumentStatus, string> = {
  safe: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  soon: "bg-amber-50 text-amber-700 ring-amber-200",
  urgent: "bg-red-50 text-red-700 ring-red-200",
  expired: "bg-slate-100 text-slate-500 ring-slate-200",
};

const labels: Record<DocumentStatus, string> = {
  safe: "Valid",
  soon: "Renews soon",
  urgent: "Expiring soon",
  expired: "Expired",
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

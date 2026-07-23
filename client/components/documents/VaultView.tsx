"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useVaultData, type VaultDocument, type DocumentCategory } from "@/components/documents/vault-data";
import { VaultToolbar, type ViewMode, type StatusFilter } from "@/components/documents/VaultToolbar";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentRow } from "@/components/documents/DocumentRow";
import { QuickPreviewDrawer } from "@/components/documents/QuickPreviewDrawer";
import { VaultEmptyState } from "@/components/documents/VaultEmptyState";

export function VaultView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [activeDoc, setActiveDoc] = useState<VaultDocument | null>(null);

  const { vaultDocuments, loading, deleteDocument } = useVaultData();
  const searchParams = useSearchParams();
  const docIdParam = searchParams.get("docId");

  // Automatically open preview drawer if docId is present in URL search params
  useEffect(() => {
    if (docIdParam && vaultDocuments.length > 0) {
      const match = vaultDocuments.find((d) => d.id === docIdParam);
      if (match) {
        setActiveDoc(match);
      }
    }
  }, [docIdParam, vaultDocuments]);

  const filtered = useMemo(() => {
    return vaultDocuments.filter((doc) => {
      const matchesQuery = doc.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || doc.category === category;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "expiring" && (doc.status === "soon" || doc.status === "urgent")) ||
        (statusFilter === "expired" && doc.status === "expired");
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [vaultDocuments, query, category, statusFilter]);

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <VaultToolbar
        query={query}
        onQueryChange={setQuery}
        activeCategory={category}
        onCategoryChange={setCategory}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        view={view}
        onViewChange={setView}
      />

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-500">Loading vault...</div>
      ) : filtered.length === 0 ? (
        <VaultEmptyState onClear={clearFilters} />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onOpen={() => setActiveDoc(doc)} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-2 dark:border-slate-800 dark:bg-slate-900 overflow-x-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onOpen={() => setActiveDoc(doc)} />
          ))}
        </div>
      )}

      <QuickPreviewDrawer
        doc={activeDoc}
        onClose={() => setActiveDoc(null)}
        onDelete={(id) => {
          deleteDocument(id);
          setActiveDoc(null);
        }}
      />
    </div>
  );
}

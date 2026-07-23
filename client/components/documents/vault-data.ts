import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export type DocumentCategory =
  | "Identity"
  | "Insurance"
  | "Warranty"
  | "Housing"
  | "Medical"
  | "Financial"
  | "Other";

export type DocumentStatus = "safe" | "soon" | "urgent" | "expired";

export type FileKind = "pdf" | "image";

export type VaultDocument = {
  id: string;
  name: string;
  category: DocumentCategory;
  fileKind: FileKind;
  sizeLabel: string;
  uploadedAt: string;
  expiryDate: string | null;
  daysLeft: number | null;
  status: DocumentStatus;
  summary: string;
  fileUrl?: string;
  extractedText?: string;
  metadata?: any;
};

export const documentCategories: DocumentCategory[] = [
  "Identity",
  "Insurance",
  "Warranty",
  "Housing",
  "Medical",
  "Financial",
];

export function useVaultData() {
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDocuments = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: docs, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (docs) {
      const now = new Date();
      const mapped = docs.map(d => {
        let daysLeft = null;
        let status: DocumentStatus = "safe";

        if (d.expiry_date) {
          const expDate = new Date(d.expiry_date);
          const diffTime = expDate.getTime() - now.getTime();
          daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (daysLeft < 0) status = "expired";
          else if (daysLeft <= 14) status = "urgent";
          else if (daysLeft <= 45) status = "soon";
        }

        const sizeInMB = d.file_size_bytes / (1024 * 1024);
        const sizeLabel = sizeInMB > 0.1 ? `${sizeInMB.toFixed(1)} MB` : `${(d.file_size_bytes / 1024).toFixed(0)} KB`;

        return {
          id: d.id,
          name: d.file_name,
          category: (d.category as DocumentCategory) || "Other",
          fileKind: d.file_type === "pdf" ? "pdf" : "image",
          sizeLabel,
          uploadedAt: new Date(d.created_at).toLocaleDateString(),
          expiryDate: d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : null,
          daysLeft,
          status,
          summary: d.summary || "",
          fileUrl: d.file_url,
          extractedText: d.extracted_text,
          metadata: {
            person_name: d.person_name,
            document_number: d.document_number,
            issue_date: d.issue_date,
            address: d.address
          }
        } as VaultDocument;
      });
      setVaultDocuments(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [supabase]);

  const deleteDocument = async (id: string) => {
    await supabase.from('documents').delete().eq('id', id);
    setVaultDocuments(prev => prev.filter(d => d.id !== id));
  };

  return { vaultDocuments, loading, fetchDocuments, deleteDocument };
}

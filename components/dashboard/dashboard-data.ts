"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export type OverviewStat = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: "files" | "users" | "clock" | "shield";
};

export type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: "upload" | "files" | "sparkles" | "users";
};

export const quickActions: QuickAction[] = [
  { label: "Upload document", description: "Scan or drag in a file", href: "/upload", icon: "upload" },
  { label: "Document vault", description: "Browse and filter files", href: "/documents", icon: "files" },
  { label: "Ask the assistant", description: "Query vault with AI", href: "/ai-assistant", icon: "sparkles" },
  { label: "Invite a member", description: "Share family vault access", href: "/family", icon: "users" },
];

export type RecentUpload = {
  name: string;
  category: string;
  uploadedAt: string;
  status: "processed" | "processing" | "action-needed";
};

export type RecentSearch = {
  query: string;
  answeredAt: string;
};

// Static mock for now
export const recentSearches: RecentSearch[] = [
  { query: "When does my passport expire?", answeredAt: "2 hours ago" },
  { query: "Show my insurance documents.", answeredAt: "Yesterday" },
];

export type ActivityPoint = {
  month: string;
  documents: number;
  ocrQueries: number;
};

// Mock data, calculating over months requires complex grouping queries
export const activityData: ActivityPoint[] = [
  { month: "Feb", documents: 1, ocrQueries: 2 },
  { month: "Mar", documents: 3, ocrQueries: 4 },
  { month: "Apr", documents: 2, ocrQueries: 5 },
  { month: "May", documents: 6, ocrQueries: 8 },
  { month: "Jun", documents: 5, ocrQueries: 10 },
  { month: "Jul", documents: 8, ocrQueries: 15 },
];

export type ExpiryItem = {
  label: string;
  category: string;
  daysLeft: number;
  status: "safe" | "soon" | "urgent";
};

export function useDashboardData() {
  const [overviewStats, setOverviewStats] = useState<OverviewStat[]>([]);
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [expiringItems, setExpiringItems] = useState<ExpiryItem[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (docs) {
        // Compute total docs
        const total = docs.length;

        // Compute total storage
        const bytes = docs.reduce((acc: number, curr: any) => acc + (curr.file_size_bytes || 0), 0);
        const mb = (bytes / (1024 * 1024)).toFixed(1);

        // Compute expiring docs
        const now = new Date();
        const expiringDocs = docs.filter((d: any) => d.expiry_date).map((d: any) => {
          const expDate = new Date(d.expiry_date);
          const diffTime = expDate.getTime() - now.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return {
            label: d.file_name,
            category: d.category || "Uncategorized",
            daysLeft,
            status: daysLeft <= 14 ? "urgent" : daysLeft <= 45 ? "soon" : "safe" as "urgent" | "soon" | "safe"
          };
        }).filter((d: any) => d.daysLeft >= 0).sort((a: any, b: any) => a.daysLeft - b.daysLeft);

        setExpiringItems(expiringDocs.slice(0, 5));

        setOverviewStats([
          { label: "Total Documents", value: total.toString(), delta: total > 0 ? "Active in vault" : "No documents", trend: total > 0 ? "up" : "flat", icon: "files" },
          { label: "Shared with Family", value: "0", delta: "Coming soon", trend: "flat", icon: "users" },
          { label: "Expiring Soon", value: expiringDocs.filter((d: any) => d.daysLeft <= 45).length.toString(), delta: "Action required", trend: expiringDocs.length > 0 ? "down" : "flat", icon: "clock" },
          { label: "Storage Used", value: `${mb} MB`, delta: "of 5 GB limit", trend: "up", icon: "shield" },
        ]);

        const counts: Record<string, number> = {
          Identity: 0, Insurance: 0, Medical: 0, Housing: 0, Education: 0, Financial: 0, Other: 0
        };
        docs.forEach((d: any) => {
          const cat = d.category || "Other";
          if (counts[cat] !== undefined) {
            counts[cat] += 1;
          } else {
            counts[cat] = 1;
          }
        });
        setCategoryCounts(counts);

        setRecentUploads(docs.slice(0, 5).map((d: any) => ({
          name: d.file_name,
          category: d.category || "Uncategorized",
          uploadedAt: new Date(d.created_at).toLocaleDateString(),
          status: d.ocr_status === "completed" ? "processed" : (d.ocr_status === "pending" ? "processing" : "action-needed")
        })));
      }
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  return { overviewStats, recentUploads, expiringItems, categoryCounts, loading };
}

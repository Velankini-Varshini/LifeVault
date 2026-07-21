// Mock content for the LifeVault AI dashboard.
// Shapes are stable on purpose so real API responses can drop in later.

export type OverviewStat = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: "files" | "users" | "clock" | "shield";
};

export const overviewStats: OverviewStat[] = [
  { label: "Total Documents", value: "32", delta: "+4 this month", trend: "up", icon: "files" },
  { label: "Shared with Family", value: "3", delta: "Active access", trend: "up", icon: "users" },
  { label: "Expiring Soon", value: "2", delta: "Action required", trend: "down", icon: "clock" },
  { label: "Storage Used", value: "1.2 GB", delta: "24% of 5 GB", trend: "flat", icon: "shield" },
];

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

export const recentUploads: RecentUpload[] = [
  { name: "Passport — Alina.pdf", category: "Identity", uploadedAt: "Today, 9:14 AM", status: "processed" },
  { name: "Car insurance policy.pdf", category: "Insurance", uploadedAt: "Yesterday, 4:02 PM", status: "processed" },
  { name: "Degree certificate.pdf", category: "Identity", uploadedAt: "Yesterday, 11:20 AM", status: "processed" },
  { name: "Rental lease 2026.pdf", category: "Housing", uploadedAt: "2 days ago", status: "processing" },
  { name: "Property deed.pdf", category: "Housing", uploadedAt: "3 days ago", status: "processed" },
];

export type RecentSearch = {
  query: string;
  answeredAt: string;
};

export const recentSearches: RecentSearch[] = [
  { query: "When does my passport expire?", answeredAt: "2 hours ago" },
  { query: "Show my insurance documents.", answeredAt: "Yesterday" },
  { query: "Find my degree certificate.", answeredAt: "2 days ago" },
  { query: "Summarize my property documents.", answeredAt: "3 days ago" },
  { query: "Show my Aadhaar card.", answeredAt: "5 days ago" },
];

export type ActivityPoint = {
  month: string;
  documents: number;
  ocrQueries: number;
};

export const activityData: ActivityPoint[] = [
  { month: "Feb", documents: 12, ocrQueries: 18 },
  { month: "Mar", documents: 18, ocrQueries: 24 },
  { month: "Apr", documents: 15, ocrQueries: 20 },
  { month: "May", documents: 24, ocrQueries: 35 },
  { month: "Jun", documents: 21, ocrQueries: 28 },
  { month: "Jul", documents: 30, ocrQueries: 48 },
];

export type ExpiryItem = {
  label: string;
  category: string;
  daysLeft: number;
  status: "safe" | "soon" | "urgent";
};

export const expiringItems: ExpiryItem[] = [
  { label: "Visa renewal notice", category: "Identity", daysLeft: 6, status: "urgent" },
  { label: "Car insurance policy", category: "Insurance", daysLeft: 41, status: "soon" },
  { label: "Rental lease renewal", category: "Housing", daysLeft: 96, status: "safe" },
];

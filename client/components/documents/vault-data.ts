// Mock content for the Document Vault. Shapes are stable on purpose so a
// real documents API can drop in without touching the components.

export type DocumentCategory =
  | "Identity"
  | "Insurance"
  | "Warranty"
  | "Housing"
  | "Medical"
  | "Financial";

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
};

export const vaultDocuments: VaultDocument[] = [
  {
    id: "doc-1",
    name: "Passport — Alina",
    category: "Identity",
    fileKind: "pdf",
    sizeLabel: "2.1 MB",
    uploadedAt: "Jul 14, 2026",
    expiryDate: "Mar 14, 2027",
    daysLeft: 214,
    status: "safe",
    summary: "Indian passport, issued New Delhi. Machine-readable, 10-year validity.",
  },
  {
    id: "doc-2",
    name: "Car insurance policy",
    category: "Insurance",
    fileKind: "pdf",
    sizeLabel: "884 KB",
    uploadedAt: "Jul 13, 2026",
    expiryDate: "Aug 24, 2026",
    daysLeft: 41,
    status: "soon",
    summary: "State Farm comprehensive cover, 2022 Honda Civic. Premium paid in full.",
  },
  {
    id: "doc-3",
    name: "Fridge warranty",
    category: "Warranty",
    fileKind: "image",
    sizeLabel: "1.4 MB",
    uploadedAt: "Jul 12, 2026",
    expiryDate: "Jul 20, 2026",
    daysLeft: 6,
    status: "urgent",
    summary: "Samsung 3-door fridge, extended warranty via Best Buy. Covers compressor only.",
  },
  {
    id: "doc-4",
    name: "Rental lease 2026",
    category: "Housing",
    fileKind: "pdf",
    sizeLabel: "3.2 MB",
    uploadedAt: "Jul 11, 2026",
    expiryDate: "Oct 18, 2026",
    daysLeft: 96,
    status: "safe",
    summary: "12-month lease, 2BR apartment. Renewal notice required 60 days prior.",
  },
  {
    id: "doc-5",
    name: "Vet records — Milo",
    category: "Medical",
    fileKind: "pdf",
    sizeLabel: "612 KB",
    uploadedAt: "Jul 10, 2026",
    expiryDate: null,
    daysLeft: null,
    status: "safe",
    summary: "Vaccination history and last checkup notes for Milo (dog, age 4).",
  },
  {
    id: "doc-6",
    name: "Home insurance policy",
    category: "Insurance",
    fileKind: "pdf",
    sizeLabel: "1.1 MB",
    uploadedAt: "Jul 8, 2026",
    expiryDate: "Oct 20, 2026",
    daysLeft: 98,
    status: "safe",
    summary: "Lemonade homeowners policy. Covers fire, theft, and water damage.",
  },
  {
    id: "doc-7",
    name: "Gym membership receipt",
    category: "Financial",
    fileKind: "image",
    sizeLabel: "540 KB",
    uploadedAt: "Jul 6, 2026",
    expiryDate: "Jul 26, 2026",
    daysLeft: 12,
    status: "soon",
    summary: "Annual membership, auto-renews unless cancelled 5 days before expiry.",
  },
  {
    id: "doc-8",
    name: "Laptop warranty — Dell XPS",
    category: "Warranty",
    fileKind: "pdf",
    sizeLabel: "398 KB",
    uploadedAt: "Jul 2, 2026",
    expiryDate: "Jun 30, 2026",
    daysLeft: -14,
    status: "expired",
    summary: "3-year extended warranty, expired. Out-of-warranty repair only from here.",
  },
  {
    id: "doc-9",
    name: "Tax return 2025",
    category: "Financial",
    fileKind: "pdf",
    sizeLabel: "2.8 MB",
    uploadedAt: "Jun 28, 2026",
    expiryDate: null,
    daysLeft: null,
    status: "safe",
    summary: "Filed federal and state returns. Keep for 7 years per retention guidance.",
  },
];

export const documentCategories: DocumentCategory[] = [
  "Identity",
  "Insurance",
  "Warranty",
  "Housing",
  "Medical",
  "Financial",
];

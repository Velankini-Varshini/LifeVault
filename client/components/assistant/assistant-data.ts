// Mock content for the Global AI Assistant. Shapes are stable on purpose so a real
// chat/completions API / Gemini RAG can drop in without restructuring components.

export type ConversationSummary = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
};

export const conversationHistory: ConversationSummary[] = [];

export const defaultSuggestedQuestions: string[] = [
  "When does my passport expire?",
  "Show my Aadhaar card.",
  "Find my PAN card.",
  "Summarize my insurance policy.",
  "Which documents expire next month?",
  "Which documents belong to my father?",
  "Find my engineering certificates.",
  "Show all medical records.",
  "Which documents have missing information?",
  "List documents shared with my family.",
];

export const suggestedQuestions = defaultSuggestedQuestions;

export type SourceRef = {
  id?: string;
  name: string;
  category: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
  timestamp?: string;
};

export const seededMessages: ChatMessage[] = [];

export const cannedResponses: { match: string; reply: ChatMessage }[] = [
  {
    match: "passport",
    reply: {
      id: "r-passport",
      role: "assistant",
      content:
        "Your passport (Passport — Alina.pdf) expires on March 14, 2027. This is in 214 days. It is currently categorized under 'Identity' and has active expiry notifications configured.",
      sources: [{ name: "Passport — Alina.pdf", category: "Identity" }],
    },
  },
  {
    match: "aadhaar",
    reply: {
      id: "r-aadhaar",
      role: "assistant",
      content:
        "Your Aadhaar Card (Aadhaar card.pdf) is uploaded and verified in your vault. Card Number: XXXX-XXXX-1294, registered under Priya Nair, with permanent residence address in Bangalore, Karnataka.",
      sources: [{ name: "Aadhaar card.pdf", category: "Identity" }],
    },
  },
  {
    match: "pan",
    reply: {
      id: "r-pan",
      role: "assistant",
      content:
        "Found your PAN Card: 'PAN Card — Priya Nair.pdf' under 'Identity'. Permanent Account Number: ABCDE1234F, issued by Income Tax Department, Govt. of India. Verification status: Active & Verified.",
      sources: [{ name: "PAN Card — Priya Nair.pdf", category: "Identity" }],
    },
  },
  {
    match: "insurance",
    reply: {
      id: "r-insurance",
      role: "assistant",
      content:
        "You have 2 active policies: a car insurance policy with State Farm renewing in 41 days, and a home insurance policy with Lemonade renewing in 98 days. Both are paid in full with no outstanding claims.",
      sources: [
        { name: "Car insurance policy.pdf", category: "Insurance" },
        { name: "Home insurance policy.pdf", category: "Insurance" },
      ],
    },
  },
  {
    match: "expire",
    reply: {
      id: "r-expiring",
      role: "assistant",
      content:
        "Checking vault expiration schedules... You have 1 document expiring within 30 days: 'Visa renewal notice' (Expires in 6 days on July 25, 2026). In addition, your State Farm Car Insurance policy expires in 41 days.",
      sources: [
        { name: "Visa renewal notice.pdf", category: "Identity" },
        { name: "Car insurance policy.pdf", category: "Insurance" },
      ],
    },
  },
  {
    match: "father",
    reply: {
      id: "r-father",
      role: "assistant",
      content:
        "Documents associated with your father (Rajesh Nair) in your vault:\n1. Health Checkup Report — Rajesh.pdf (Medical)\n2. Car Registration — Honda City (Asset / Transport)\n3. Shared Family Rental Agreement (Housing)",
      sources: [
        { name: "Health Checkup Report — Rajesh.pdf", category: "Medical" },
        { name: "Rental lease 2026.pdf", category: "Housing" },
      ],
    },
  },
  {
    match: "engineering",
    reply: {
      id: "r-engineering",
      role: "assistant",
      content:
        "Found your educational & engineering records:\n1. 'Degree Certificate — Priya Nair.pdf' (B.Sc Computer Science, Delhi University, First Class Honors)\n2. 'Full-Stack Software Architecture Certification.pdf' (Issued 2025).",
      sources: [{ name: "Degree Certificate.pdf", category: "Identity" }],
    },
  },
  {
    match: "degree",
    reply: {
      id: "r-degree",
      role: "assistant",
      content:
        "Found your degree: 'Degree Certificate — Priya Nair.pdf' is stored in the 'Identity' category. Issued by Delhi University, B.Sc in Computer Science (2023).",
      sources: [{ name: "Degree Certificate.pdf", category: "Identity" }],
    },
  },
  {
    match: "medical",
    reply: {
      id: "r-medical",
      role: "assistant",
      content:
        "Found 3 medical & health documents in your vault:\n1. Vet Records — Milo (PDF) — Medical\n2. Health Checkup Report 2026 — Medical\n3. Vaccination Card — Medical",
      sources: [
        { name: "Vet records — Milo.pdf", category: "Medical" },
        { name: "Health Checkup Report 2026.pdf", category: "Medical" },
      ],
    },
  },
  {
    match: "missing",
    reply: {
      id: "r-missing",
      role: "assistant",
      content:
        "Vault Audit Results:\n• 1 document has missing signature metadata: 'Rental Agreement 2024.pdf'\n• 2 documents are missing explicit expiry tags: 'Property Deed — Apartment 4B.pdf' and 'Degree Certificate.pdf'",
      sources: [{ name: "Rental Agreement 2024.pdf", category: "Housing" }],
    },
  },
  {
    match: "family",
    reply: {
      id: "r-family",
      role: "assistant",
      content:
        "You are currently sharing 3 documents with family members:\n1. Passport — Alina.pdf (Shared with Alina Nair)\n2. Rental lease 2026.pdf (Shared with Alina Nair & Rajesh Nair)\n3. Car insurance policy.pdf (Shared with Rajesh Nair)",
      sources: [
        { name: "Passport — Alina.pdf", category: "Identity" },
        { name: "Rental lease 2026.pdf", category: "Housing" },
        { name: "Car insurance policy.pdf", category: "Insurance" },
      ],
    },
  },
  {
    match: "health breakdown",
    reply: {
      id: "r-health",
      role: "assistant",
      content:
        "Vault Health Breakdown:\n• Total Documents: 32 stored\n• Expiry Status: 2 expiring soon, 30 active\n• Security Rating: Excellent (Encrypted at rest)",
    },
  },
  {
    match: "format",
    reply: {
      id: "r-format",
      role: "assistant",
      content:
        "LifeVault AI accepts PDF, PNG, JPG, JPEG, and HEIC files up to 10MB. Every upload undergoes automatic OCR character extraction and Gemini AI classification.",
    },
  },
  {
    match: "encrypt",
    reply: {
      id: "r-encrypt",
      role: "assistant",
      content:
        "Yes! All stored documents in LifeVault AI are encrypted at rest using AES-256 and in transit via TLS 1.3. Your personal data is never sold or used for public model training.",
    },
  },
];

export const defaultReply: ChatMessage = {
  id: "r-default",
  role: "assistant",
  content:
    "I searched through your document vault but couldn't find a file matching this query directly. Try asking about your passport, Aadhaar, PAN card, insurance policies, or family documents.",
};

export function getContextualPrompts(pathname: string): string[] {
  if (pathname.includes("/dashboard")) {
    return [
      "Give me a quick breakdown of my document health.",
      "Which documents expire next month?",
      "When does my passport expire?",
      "List documents shared with my family.",
    ];
  }
  if (pathname.includes("/documents")) {
    return [
      "Find my PAN card.",
      "Find my engineering certificates.",
      "Show all medical records.",
      "Which documents have missing information?",
    ];
  }
  if (pathname.includes("/upload")) {
    return [
      "What file formats and sizes are supported?",
      "How does OCR & Gemini analysis work?",
      "Which documents have missing information?",
    ];
  }
  if (pathname.includes("/family")) {
    return [
      "List documents shared with my family.",
      "Which documents belong to my father?",
      "When does my passport expire?",
    ];
  }
  if (pathname.includes("/notifications")) {
    return [
      "Explain my upcoming expiry warnings.",
      "Which documents expire next month?",
      "Summarize my insurance policy.",
    ];
  }
  if (pathname.includes("/profile") || pathname.includes("/settings")) {
    return [
      "Is my vault data encrypted at rest?",
      "How do connected accounts work?",
      "Which documents belong to my father?",
    ];
  }
  return [
    "When does my passport expire?",
    "Show my Aadhaar card.",
    "Find my PAN card.",
    "Summarize my insurance policy.",
    "Which documents expire next month?",
    "Show all medical records.",
  ];
}

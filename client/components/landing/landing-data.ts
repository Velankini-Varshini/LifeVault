// Mock content for the LifeVault AI landing page.
// Replace with CMS/API-driven content later — shapes are kept stable on purpose.

export type ExpiryChip = {
  label: string;
  daysLeft: number;
  status: "safe" | "soon" | "urgent";
};

export const heroExpiryChips: ExpiryChip[] = [
  { label: "Passport — Alina", daysLeft: 214, status: "safe" },
  { label: "Car insurance", daysLeft: 41, status: "soon" },
  { label: "Visa renewal notification", daysLeft: 6, status: "urgent" },
  { label: "Rental lease", daysLeft: 96, status: "safe" },
];

export type Feature = {
  title: string;
  description: string;
  icon: "shield" | "search" | "bell" | "fileText" | "users" | "sparkles";
};

export const coreFeatures: Feature[] = [
  {
    title: "One vault for every document",
    description:
      "Passports, insurance policies, warranties, leases, medical records — scanned, tagged, and stored the moment you upload them.",
    icon: "shield",
  },
  {
    title: "Ask instead of searching",
    description:
      "“When does my passport expire?” gets answered in one line, pulled straight from the document itself.",
    icon: "search",
  },
  {
    title: "Nothing quietly lapses",
    description:
      "Renewals, warranties, and subscriptions get a countdown the moment they're added, not a surprise the week they end.",
    icon: "bell",
  },
  {
    title: "Smart categorizing & metadata",
    description:
      "Our AI automatically classifies your documents, extracts key values, and generates search tags.",
    icon: "fileText",
  },
  {
    title: "Share with the people who need it",
    description:
      "Give a partner, parent, or roommate view or edit access to exactly the documents that concern them.",
    icon: "users",
  },
  {
    title: "An assistant that's actually read your files",
    description:
      "LifeVault's AI has context on everything you've stored, so it answers in specifics, not generic advice.",
    icon: "sparkles",
  },
];

export type Step = {
  title: string;
  description: string;
};

export const howItWorksSteps: Step[] = [
  {
    title: "Drop it in",
    description:
      "Drag a photo, scan, or PDF into the vault. LifeVault reads it and files it under the right category automatically.",
  },
  {
    title: "It reads the fine print",
    description:
      "Expiry dates, policy numbers, coverage details, and totals get pulled out and attached as searchable data.",
  },
  {
    title: "You get told what matters",
    description:
      "A renewal window, an upcoming expiration date, or a warranty lapse — surfaced on your timeline before it becomes a problem.",
  },
  {
    title: "You just ask",
    description:
      "Skip the folder-digging. Ask the assistant directly and get an answer sourced from your own documents.",
  },
];

export type AIPrompt = {
  prompt: string;
  answer: string;
};

export const aiExamplePrompts: AIPrompt[] = [
  {
    prompt: "When does my passport expire?",
    answer: "Alina's passport expires March 14, 2027 — 214 days from today.",
  },
  {
    prompt: "Show my insurance.",
    answer: "You have 2 active policies: Car (State Farm) and Home (Lemonade). Car renews in 41 days.",
  },
  {
    prompt: "Find my degree certificate.",
    answer: "Found 1 match: 'Degree Certificate — Priya Nair.pdf' uploaded under Education. OCR shows it was conferred June 2023.",
  },
];

export type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Personal",
    price: "$0",
    cadence: "forever",
    description: "For getting your own documents in order.",
    features: [
      "Up to 50 documents",
      "Expiry reminders",
      "Automatic category tags",
      "AI assistant — 20 questions / month",
    ],
    cta: "Start free",
  },
  {
    name: "Household",
    price: "$12",
    cadence: "per month",
    description: "For families running more than one calendar.",
    features: [
      "Unlimited documents",
      "Smart metadata classification",
      "Unlimited AI assistant",
      "Share with up to 5 members",
      "Priority OCR processing",
    ],
    highlighted: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Family Plus",
    price: "$24",
    cadence: "per month",
    description: "For multi-generational households and shared property.",
    features: [
      "Everything in Household",
      "Unlimited members & roles",
      "Document version history",
      "Dedicated export & backup",
      "Priority support",
    ],
    cta: "Talk to us",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I found out my car insurance had lapsed the hard way, once. LifeVault has caught three renewals since that I would've missed the same way.",
    name: "Priya Nair",
    role: "Product manager, Bengaluru",
  },
  {
    quote:
      "My mother-in-law's medical records, our lease, the kids' passports — one place, and I can finally answer 'where's that document' without a group chat.",
    name: "Marcus Webb",
    role: "Parent of two, Austin",
  },
  {
    quote:
      "Searching for tax forms used to take me hours of rummaging through folders. Now I just ask the AI assistant, and it locates the file in three seconds flat.",
    name: "Sofia Reyes",
    role: "Freelance Designer, Lisbon",
  },
];

export type FAQItem = {
  question: string;
  answer: string;
};

export const faqItems: FAQItem[] = [
  {
    question: "Where is my data actually stored?",
    answer:
      "Every document is encrypted at rest and in transit. You can export or permanently delete your entire vault at any time from Settings.",
  },
  {
    question: "Can I share documents without giving full access?",
    answer:
      "Yes. Family Sharing lets you grant view-only or edit access per document or per category — a partner can see the lease without seeing your medical records.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "PDFs, JPGs, PNGs, and HEIC photos straight from your phone. LifeVault runs OCR on scans and photos automatically.",
  },
  {
    question: "Does the AI assistant only answer about my documents?",
    answer:
      "Its answers are grounded in what you've uploaded — dates, numbers, and coverage details come from your vault, not a generic knowledge base.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, from Settings → Danger Zone. Your documents remain exportable for 30 days after cancellation before deletion.",
  },
];

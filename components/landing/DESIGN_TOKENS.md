# LifeVault AI — Landing Page Design Tokens

## Palette
- `--surface`         #FFFFFF   (page background)
- `--surface-muted`   #F8FAFC   (section alternation, slate-50)
- `--ink`             #0F172A   (primary text, slate-900)
- `--ink-muted`       #475569   (secondary text, slate-600)
- `--border`          #E2E8F0   (slate-200)
- `--brand`           #4F46E5   (indigo-600 — primary actions, links)
- `--brand-ink`       #EEF2FF   (indigo-50 — tinted backgrounds/chips)
- `--success`         #10B981   (emerald-500 — safe/renewed status)
- `--warning`         #F59E0B   (amber-500 — renews soon)
- `--danger`          #DC2626   (red-600 — urgent/expiring)

No decorative gradients. The only "signature" color move is the expiry-chip
traffic light (emerald → amber → red), which is functional, not ornamental.

## Type
- Display: **Sora** (600/700) — used only for H1/H2, tight tracking (-0.02em).
- Body/UI: **Inter** (400/500/600) — everything else.
- Data/utility: **JetBrains Mono** (500) — countdown numerals, document IDs,
  status labels. This is the signature typographic move: every expiry date
  in the product is rendered in mono, so numbers read as *data*, distinct
  from prose. Carried through from the hero into Features/Pricing.

next/font/google setup (drop into `app/layout.tsx`):

```ts
import { Sora, Inter, JetBrains_Mono } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" });

// <body className={`${sora.variable} ${inter.variable} ${mono.variable} font-sans`}>
```

## Tailwind config additions (`tailwind.config.ts`)

```ts
theme: {
  extend: {
    fontFamily: {
      display: ["var(--font-display)", "sans-serif"],
      sans: ["var(--font-body)", "sans-serif"],
      mono: ["var(--font-mono)", "monospace"],
    },
    colors: {
      brand: {
        DEFAULT: "#4F46E5",
        50: "#EEF2FF",
        600: "#4F46E5",
        700: "#4338CA",
      },
    },
    borderRadius: {
      xl: "0.875rem",
      "2xl": "1.25rem",
    },
  },
}
```

## Signature element
The hero does not use a generic "dashboard screenshot" mockup. Instead it
shows a small fanned stack of real expiry chips (Passport, Insurance,
Warranty, Lease) each with a live-feeling countdown in mono type, colored by
urgency. It's the one thing on the page that is animated on load (a gentle
staggered fan-out), and it recurs — quieter — as a static reference strip in
the Features and Dashboard-preview sections, so the reader learns to read it
once and recognize it everywhere.

## Motion
- Hero chip stack: staggered fade + slight rotation settle on load (once).
- Scroll-reveal: sections fade/slide up 12px on entering viewport, no bounce.
- Hover: cards lift 2px with a softer shadow; buttons shift bg one shade
  darker. No scale-pop, no shadow glow.
- Respect `prefers-reduced-motion`: disable the stagger/slide, keep opacity
  fades only.

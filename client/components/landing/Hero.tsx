"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { heroExpiryChips, type ExpiryChip } from "@/components/landing/landing-data";

const statusStyles: Record<ExpiryChip["status"], string> = {
  safe: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  soon: "bg-amber-50 text-amber-700 ring-amber-200",
  urgent: "bg-red-50 text-red-700 ring-red-200",
};

function ChipStack() {
  return (
    <div className="relative mx-auto flex h-[340px] w-full max-w-sm items-center justify-center md:mx-0">
      {heroExpiryChips.map((chip, i) => {
        const rotations = [-6, 3, -2, 5];
        const offsets = [-64, -22, 20, 62];
        return (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, y: 24, rotate: 0 }}
            animate={{ opacity: 1, y: offsets[i], rotate: rotations[i] }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease: "easeOut" }}
            className="absolute w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5"
            style={{ zIndex: i }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800">{chip.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-mono font-medium ring-1 ${statusStyles[chip.status]}`}
              >
                {chip.daysLeft}d
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  chip.status === "safe"
                    ? "bg-emerald-500"
                    : chip.status === "soon"
                      ? "bg-amber-500"
                      : "bg-red-600"
                }`}
                style={{ width: `${Math.min(100, (chip.daysLeft / 240) * 100)}%` }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-16 md:grid-cols-2 md:pb-28 md:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Now with AI-read document expiry tracking
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Every document your household owns.
            <br />
            <span className="text-indigo-600">Nothing lapses quietly.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
            LifeVault AI reads what you upload — passports, insurance, warranties, leases —
            and tells you what&apos;s expiring, what&apos;s low, and what to do about it. Ask it a
            question and get an answer, not a search result.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <PlayCircle className="h-4 w-4" />
              Watch 90-second demo
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            No credit card required · Free plan covers up to 50 documents
          </p>
        </div>

        <ChipStack />
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Camera, UploadCloud, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalAI } from "@/context/GlobalAIContext";

export function BottomQuickActions({ onOpenScan }: { onOpenScan: () => void }) {
  const router = useRouter();
  const { toggleChat } = useGlobalAI();

  return (
    <div className="sticky bottom-4 z-20 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {/* Card 1: Scan QR / Scan Document */}
        <button
          onClick={onOpenScan}
          className="group flex min-h-[56px] items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-800/50 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 cursor-pointer active:scale-95"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Camera className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h4 className="font-display text-xs font-semibold text-slate-900 dark:text-white truncate">
              Scan QR / Document
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Instant camera OCR scan</p>
          </div>
        </button>

        {/* Card 2: Upload Document */}
        <button
          onClick={() => router.push("/upload")}
          className="group flex min-h-[56px] items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-800/50 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 cursor-pointer active:scale-95"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h4 className="font-display text-xs font-semibold text-slate-900 dark:text-white truncate">
              Upload Document
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">PDF, PNG, JPG up to 10MB</p>
          </div>
        </button>

        {/* Card 3: Ask AI */}
        <button
          onClick={toggleChat}
          className="group flex min-h-[56px] items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-800/50 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 cursor-pointer active:scale-95"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h4 className="font-display text-xs font-semibold text-slate-900 dark:text-white truncate">
              Ask LifeVault AI
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Grounded document search</p>
          </div>
        </button>
      </div>
    </div>
  );
}

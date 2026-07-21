"use client";

import React, { useState } from "react";
import { Camera, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuickScanModal } from "@/components/dashboard/QuickScanModal";

export function GlobalQuickActionsDock() {
  const router = useRouter();
  const [scanModalOpen, setScanModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
        {/* Global Compact Floating Pill Dock (Scan & Upload Only) */}
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-slate-200/90 bg-white/90 p-1 sm:p-1.5 shadow-2xl shadow-slate-900/15 backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-black/40">
          {/* Action 1: 📷 Scan Document */}
          <button
            onClick={() => setScanModalOpen(true)}
            className="group flex min-h-[44px] items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <span className="hidden sm:inline whitespace-nowrap">Scan Document</span>
            <span className="sm:hidden font-semibold whitespace-nowrap">Scan</span>
          </button>

          <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Action 2: ⬆ Upload Document */}
          <button
            onClick={() => router.push("/upload")}
            className="group flex min-h-[44px] items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <UploadCloud className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <span className="hidden sm:inline whitespace-nowrap">Upload Document</span>
            <span className="sm:hidden font-semibold whitespace-nowrap">Upload</span>
          </button>
        </div>
      </div>

      {/* Live Camera Scanner Modal */}
      <QuickScanModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useGlobalAI } from "@/context/GlobalAIContext";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalAIFloatingButton() {
  const { isOpen, toggleChat } = useGlobalAI();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-40 flex items-center gap-3">
      {/* Tooltip on hover */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xl dark:border-slate-700"
          >
            <span>Ask LifeVault AI</span>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-indigo-400">
              ⌘J
            </kbd>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Toggle Global AI Assistant"
        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 cursor-pointer"
      >
        {/* Subtle Pulse Glow Ring when closed */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-2xl bg-indigo-500/40 opacity-75 blur-sm animate-pulse group-hover:opacity-100" />
        )}

        <motion.div
          key={isOpen ? "open" : "closed"}
          initial={{ rotate: -90, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          exit={{ rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
          ) : (
            <Sparkles className="h-5.5 w-5.5 sm:h-6.5 sm:w-6.5 text-white" strokeWidth={2.25} />
          )}
        </motion.div>
      </button>
    </div>
  );
}

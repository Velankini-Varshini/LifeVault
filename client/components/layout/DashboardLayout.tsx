"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GlobalAIProvider } from "@/context/GlobalAIContext";
import { GlobalAIFloatingButton } from "@/components/assistant/GlobalAIFloatingButton";
import { GlobalAIChatDrawer } from "@/components/assistant/GlobalAIChatDrawer";
import { GlobalQuickActionsDock } from "@/components/layout/GlobalQuickActionsDock";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <GlobalAIProvider>
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        {/* Sticky Responsive Topbar */}
        <Topbar onOpenMenu={() => setMenuOpen(true)} />

        {/* Slide-out Navigation Drawer (Desktop & Mobile) */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs"
              />

              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-white shadow-2xl dark:bg-slate-900 flex flex-col border-r border-slate-200 dark:border-slate-800"
              >
                <div className="absolute right-3 top-3.5 z-10">
                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close navigation menu"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer active:scale-95 transition-transform"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <Sidebar onMobileItemClick={() => setMenuOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Workspace */}
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto min-w-0 relative pb-28 sm:pb-32">
          {children}
        </main>

        {/* Global Floating Components */}
        <GlobalQuickActionsDock />
        <GlobalAIFloatingButton />
        <GlobalAIChatDrawer />
      </div>
    </GlobalAIProvider>
  );
}

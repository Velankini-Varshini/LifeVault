"use client";

import { type ReactNode } from "react";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import { GlobalAIProvider } from "@/context/GlobalAIContext";
import { GlobalAIFloatingButton } from "@/components/assistant/GlobalAIFloatingButton";
import { GlobalAIChatDrawer } from "@/components/assistant/GlobalAIChatDrawer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <GlobalAIProvider>
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        {/* Sticky Responsive Topbar (Without Hamburger Menu) */}
        <Topbar />

        {/* Main Content Workspace */}
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto min-w-0 relative pb-28 sm:pb-32">
          {children}
        </main>

        {/* Global Floating Components */}
        <GlobalAIFloatingButton />
        <GlobalAIChatDrawer />

        {/* Bottom App Navigation */}
        <BottomNav />
      </div>
    </GlobalAIProvider>
  );
}

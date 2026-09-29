"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Files, 
  Scan, 
  Upload, 
  Menu, 
  Users, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  X
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Vault", href: "/documents", icon: Files },
    { label: "Scan", href: "/scan", icon: Scan },
    { label: "Upload", href: "/upload", icon: Upload },
  ];

  const moreItems = [
    { label: "Family Sharing", href: "/family", icon: Users },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Interactive Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 sm:h-20 items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 pb-safe px-2 sm:px-6 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const showActive = isActive && !moreOpen;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-16 h-12 rounded-2xl sm:hover:bg-slate-100 sm:dark:hover:bg-slate-800 transition-colors z-10 tap-highlight-transparent"
            >
              {showActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`flex flex-col items-center justify-center gap-1 ${
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform ${isActive ? "stroke-[2.5px] scale-110" : "stroke-2"}`} />
                <span className="text-[10px] sm:text-xs font-semibold">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
        
        {/* More Button */}
        <button
          onClick={() => setMoreOpen(true)}
          className="relative flex flex-col items-center justify-center w-16 h-12 rounded-2xl sm:hover:bg-slate-100 sm:dark:hover:bg-slate-800 transition-colors z-10 tap-highlight-transparent"
        >
          {moreOpen && (
            <motion.div
              layoutId="bottom-nav-active"
              className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl -z-10"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <motion.div
            whileTap={{ scale: 0.85 }}
            className={`flex flex-col items-center justify-center gap-1 ${
              moreOpen ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Menu className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform ${moreOpen ? "stroke-[2.5px] scale-110" : "stroke-2"}`} />
            <span className="text-[10px] sm:text-xs font-semibold">More</span>
          </motion.div>
        </button>
      </nav>

      {/* More Panel (Bottom Sheet) */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 z-50 sm:mx-auto sm:max-w-md rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Menu</h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto pb-12">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] dark:text-slate-200 dark:hover:bg-slate-800 transition-all"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50/50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105 transition-all dark:bg-indigo-950/40 dark:text-indigo-400 dark:group-hover:bg-indigo-900">
                        <Icon className="h-5 w-5" />
                      </div>
                      {item.label}
                    </Link>
                  );
                })}
                
                <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />
                
                <button
                  onClick={() => {
                    setMoreOpen(false);
                    window.location.href = "/";
                  }}
                  className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98] dark:text-red-400 dark:hover:bg-red-950/20 transition-all text-left"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50/50 text-red-600 group-hover:bg-red-100 group-hover:scale-105 transition-all dark:bg-red-950/30 dark:text-red-400 dark:group-hover:bg-red-900/50">
                    <LogOut className="h-5 w-5" />
                  </div>
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

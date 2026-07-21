"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Menu,
  Vault,
  Sun,
  Moon,
  FileText,
  Tag,
  Sparkles,
  ArrowRight,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Topbar({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Dropdown & Popover States
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Sync theme state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("lifevault_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Keyboard Cmd+K listener for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Mock Search items
  const mockDocuments = [
    { name: "Passport — Alina.pdf", category: "Identity", path: "/documents" },
    { name: "PAN Card — Priya Nair.pdf", category: "Identity", path: "/documents" },
    { name: "Car Insurance Policy.pdf", category: "Insurance", path: "/documents" },
    { name: "Rental Lease 2026.pdf", category: "Housing", path: "/documents" },
  ];

  const filteredDocs = mockDocuments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      {/* LEFT: Menu Hamburger + Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMenu}
          aria-label="Open menu drawer"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer active:scale-95 transition-transform"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
            <Vault className="h-5 w-5 text-white" strokeWidth={2.25} />
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-slate-900 dark:text-white">
            LifeVault <span className="text-indigo-600 dark:text-indigo-400">AI</span>
          </span>
        </Link>
      </div>

      {/* CENTER: Smart Global Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder="Search documents, tags, or ask AI…"
            className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-9 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Search Modal Dropdown Popover */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 right-0 top-12 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
            >
              <div className="space-y-3 max-h-96 overflow-y-auto p-1">
                {/* Documents Match Section */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
                    <span>Documents</span>
                    <span>{filteredDocs.length} matches</span>
                  </div>
                  <div className="space-y-1">
                    {filteredDocs.map((doc, idx) => (
                      <Link
                        key={idx}
                        href={doc.path}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between rounded-xl px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shrink-0">
                            <FileText className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {doc.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                          {doc.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* AI Prompt Suggestions */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 px-2">
                    AI Suggestions
                  </span>
                  <div className="space-y-1">
                    {[
                      "When does my passport expire?",
                      "Find my PAN card.",
                      "Summarize my insurance policy.",
                    ].map((q, idx) => (
                      <Link
                        key={idx}
                        href="/ai-assistant"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{q}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tags Section */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 px-2">
                    Popular Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {["#Urgent", "#Identity", "#Insurance", "#Medical", "#Shared"].map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: Notifications & Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Notifications Icon + Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95 transition-transform cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </h4>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                    2 Unread
                  </span>
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  <div className="flex gap-3 rounded-xl bg-amber-50/50 p-2.5 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 font-bold">
                      !
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Visa renewal warning</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Expires in 6 days (July 25, 2026).</p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-xl bg-indigo-50/50 p-2.5 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30">
                    <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">AI Suggestion</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Share 'Rental lease' with roommates.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800 text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <span>View all notifications</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar + Dropdown Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="User profile menu"
            className="flex min-h-[44px] items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-left active:scale-95 transition-transform"
          >
            <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-xs font-bold text-indigo-700 dark:text-indigo-400 ring-2 ring-indigo-600/10">
              {user?.displayName ? getInitials(user.displayName) : "U"}
            </span>
            <span className="hidden text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 md:block">
              {user?.displayName || "User"}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 dark:text-slate-500 md:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.displayName || "User"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ""}</p>
                </div>
                <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />
                
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex min-h-[40px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  My Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex min-h-[40px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </Link>

                {/* Inline Theme Toggle Switch */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex min-h-[40px] w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <Sun className="h-4 w-4 text-amber-500" />
                    )}
                    <span>Theme ({theme === "dark" ? "Dark" : "Light"})</span>
                  </span>
                  <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"}`}>
                    <span className="h-4 w-4 rounded-full bg-white shadow-xs" />
                  </span>
                </button>

                <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleSignOut();
                  }}
                  className="flex min-h-[40px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

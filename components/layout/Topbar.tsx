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

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export function Topbar() {
  const user = { id: "123", displayName: "Priya Nair", email: "priya@example.com" };
  const signOut = async () => {};
  const router = useRouter();

  // Dropdown & Popover States
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allDocs, setAllDocs] = useState<any[]>([]);
  const supabase = createClient();

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

  // Fetch real user notifications
  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      const { data: docs } = await supabase
        .from("documents")
        .select("id, file_name, category, created_at, expiry_date, ocr_status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!docs) return;
      
      setAllDocs(docs);

      const items: any[] = [];
      const now = new Date();

      docs.forEach((doc: any) => {
        // Upload notifications
        items.push({
          id: `upload-${doc.id}`,
          type: "upload",
          title: doc.ocr_status === "completed" ? "Document processed" : doc.ocr_status === "failed" ? "Processing failed" : "Document uploaded",
          description: `"${doc.file_name}"`,
          unread: (now.getTime() - new Date(doc.created_at).getTime()) < 24 * 60 * 60 * 1000,
        });

        // Expiry notifications
        if (doc.expiry_date) {
          const expDate = new Date(doc.expiry_date);
          const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 60 && daysLeft >= 0) {
            items.push({
              id: `expiry-${doc.id}`,
              type: "expiry",
              title: `Expires soon`,
              description: `"${doc.file_name}" expires in ${daysLeft} days.`,
              unread: daysLeft <= 30,
            });
          }
        }
      });

      items.sort((a, b) => (a.unread === b.unread ? 0 : a.unread ? -1 : 1));
      setNotifications(items.slice(0, 3));
      setUnreadCount(items.filter((i) => i.unread).length);
    }
    fetchNotifications();
  }, [user, supabase]);

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

  const filteredDocs = allDocs
    .filter((d) =>
      d.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5); // show top 5 matches

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      {/* LEFT: Menu Hamburger + Logo */}
      <div className="flex items-center gap-3 shrink-0">

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
                        href={`/documents`} // In a real app this might go to doc details
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between rounded-xl px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shrink-0">
                            <FileText className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {doc.file_name}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                          {doc.category || "Other"}
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
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-slate-900" />
            )}
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
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  {notifications.length === 0 ? (
                    <div className="text-center py-4 text-slate-500">No new notifications</div>
                  ) : notifications.map((n) => (
                    <div key={n.id} className={`flex gap-3 rounded-xl p-2.5 border ${n.unread ? 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                      {n.type === 'expiry' ? (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 font-bold">!</span>
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"><Check className="h-4 w-4" /></span>
                      )}
                      <div>
                        <p className={`font-semibold ${n.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{n.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{n.description}</p>
                      </div>
                    </div>
                  ))}
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

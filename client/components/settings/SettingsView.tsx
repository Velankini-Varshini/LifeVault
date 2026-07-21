"use client";

import React, { useState, useEffect } from "react";
import { Eye, Globe, Bell, ShieldAlert, Trash2, ShieldCheck, Loader2 } from "lucide-react";

export function SettingsView() {
  const [appearance, setAppearance] = useState("light");
  const [language, setLanguage] = useState("english");
  const [expiryNotifications, setExpiryNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("lifevault_theme") || "light";
      setAppearance(savedTheme);
    }
  }, []);

  const handleThemeChange = (theme: string) => {
    setAppearance(theme);
    localStorage.setItem("lifevault_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Settings updated successfully.");
    }, 800);
  };

  const handleResetVault = () => {
    if (confirm("Are you absolutely sure you want to reset your vault? This will permanently delete all uploaded documents and metadata. This action cannot be undone.")) {
      alert("Vault data has been reset.");
      window.location.reload();
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account preferences, themes, and notification triggers.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Eye className="h-4.5 w-4.5 text-slate-400" />
            Appearance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`rounded-xl border p-4 text-left transition-colors cursor-pointer active:scale-95 ${
                appearance === "light"
                  ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-100 dark:ring-indigo-950"
                  : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">Light Mode</span>
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Sleek white and slate dashboard look.</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`rounded-xl border p-4 text-left transition-colors cursor-pointer active:scale-95 ${
                appearance === "dark"
                  ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-100 dark:ring-indigo-950/50"
                  : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode</span>
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Premium dark theme for night browsing.</span>
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Bell className="h-4.5 w-4.5 text-slate-400" />
            Notifications
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">Expiry countdown warnings</label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receive alerts when documents have 30, 7, or 1 days left.</p>
              </div>
              <input
                type="checkbox"
                checked={expiryNotifications}
                onChange={(e) => setExpiryNotifications(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 dark:border-slate-700 dark:text-indigo-400 focus:ring-indigo-500 shrink-0 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div>
                <label className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">AI suggestion alerts</label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Get suggestions about files that can be shared or audited.</p>
              </div>
              <input
                type="checkbox"
                checked={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 dark:border-slate-700 dark:text-indigo-400 focus:ring-indigo-500 shrink-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Globe className="h-4.5 w-4.5 text-slate-400" />
            Language
          </h3>
          <div className="w-full sm:max-w-xs">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              <option value="english">English (US)</option>
              <option value="hindi">Hindi (India)</option>
              <option value="spanish">Spanish (Spain)</option>
              <option value="french">French (France)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-b border-slate-200 pb-6 dark:border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-h-[44px] rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save preferences
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/20 p-4 sm:p-6 shadow-sm space-y-4 dark:border-red-950/40 dark:bg-red-950/5">
        <h3 className="font-display text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
          Danger Zone
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Resetting or deleting is irreversible. All uploaded files, OCR logs, and family sharing keys will be removed instantly from LifeVault AI servers.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleResetVault}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50 dark:bg-slate-900 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20 active:scale-95 cursor-pointer transition-transform"
          >
            <Trash2 className="h-4 w-4" />
            Reset all vault documents
          </button>
        </div>
      </div>
    </div>
  );
}

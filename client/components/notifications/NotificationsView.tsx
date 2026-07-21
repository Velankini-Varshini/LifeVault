"use client";

import React, { useState } from "react";
import { Bell, Calendar, Sparkles, Clock, Check, Settings, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: "expiry" | "ai" | "update";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  docId?: string;
}

export function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      type: "expiry",
      title: "Urgent document renewal warning",
      description: "Your Visa renewal notice expires in 6 days. Renewal status will lapse.",
      time: "2 hours ago",
      unread: true,
      docId: "doc-3",
    },
    {
      id: "n-2",
      type: "ai",
      title: "New AI document suggestion",
      description: "Gemini suggests sharing 'Rental lease 2026' with your roommate/partner to coordinate billing updates.",
      time: "1 day ago",
      unread: true,
      docId: "doc-4",
    },
    {
      id: "n-3",
      type: "expiry",
      title: "Policy renewal window opening",
      description: "State Farm Car insurance policy expires in 41 days. Check rates or auto-renew details.",
      time: "2 days ago",
      unread: true,
      docId: "doc-2",
    },
    {
      id: "n-4",
      type: "update",
      title: "Document uploaded successfully",
      description: "Vet records — Milo (PDF) was uploaded, text extracted, and classified under Medical.",
      time: "3 days ago",
      unread: false,
      docId: "doc-5",
    },
    {
      id: "n-5",
      type: "update",
      title: "Profile password updated",
      description: "Your vault login credentials change request was processed successfully.",
      time: "1 week ago",
      unread: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "unread">("unread");

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return n.unread;
    return true;
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Keep track of expiration dates, metadata additions, and smart recommendations.
          </p>
        </div>
        <Link 
          href="/settings"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 active:scale-95 transition-transform"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Toggle & Mark All buttons */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setActiveTab("unread")}
              className={`rounded-lg px-3.5 py-2 font-semibold transition-colors cursor-pointer active:scale-95 ${
                activeTab === "unread"
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              Unread ({notifications.filter((n) => n.unread).length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3.5 py-2 font-semibold transition-colors cursor-pointer active:scale-95 ${
                activeTab === "all"
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              All Notifications
            </button>
          </div>

          {notifications.some((n) => n.unread) && (
            <button
              onClick={handleMarkAllRead}
              className="flex min-h-[38px] items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Mark read
            </button>
          )}
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-10 w-10 text-slate-200 dark:text-slate-700" />
            <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">All caught up</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No new alerts or suggestions found.</p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => {
              const Icon = item.type === "expiry" ? Calendar : item.type === "ai" ? Sparkles : Clock;
              const iconColor = item.type === "expiry" 
                ? "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-400" 
                : item.type === "ai" 
                ? "text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-400" 
                : "text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400";

              return (
                <div 
                  key={item.id} 
                  className={`flex gap-3 sm:gap-4 py-4.5 items-start ${
                    item.unread ? "bg-indigo-50/20 dark:bg-indigo-950/20 px-2.5 rounded-xl -mx-2.5 border border-transparent" : ""
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      {item.description}
                    </p>
                    
                    {item.docId && (
                      <div className="pt-1">
                        <Link 
                          href={`/document/${item.docId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                          <span>Inspect Document</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 items-end">
                    {item.unread && (
                      <button
                        onClick={() => handleToggleRead(item.id)}
                        className="h-2.5 w-2.5 rounded-full bg-indigo-600"
                        title="Mark as read"
                      />
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-600 dark:text-slate-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors cursor-pointer active:scale-95"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

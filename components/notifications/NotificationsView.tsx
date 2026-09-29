"use client";

import React, { useState, useEffect } from "react";
import { Bell, Calendar, Clock, Check, Settings, Trash2, ArrowRight, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface NotificationItem {
  id: string;
  type: "expiry" | "upload" | "system";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  docId?: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

export function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("unread");
  const supabase = createClient();

  useEffect(() => {
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: docs } = await supabase
        .from("documents")
        .select("id, file_name, category, created_at, expiry_date, ocr_status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!docs) { setLoading(false); return; }

      const items: NotificationItem[] = [];
      const now = new Date();

      docs.forEach((doc: any) => {
        // Upload notifications
        items.push({
          id: `upload-${doc.id}`,
          type: "upload",
          title: doc.ocr_status === "completed"
            ? "Document uploaded & processed"
            : doc.ocr_status === "failed"
            ? "Document upload — processing failed"
            : "Document uploaded",
          description: `"${doc.file_name}" was ${doc.ocr_status === "completed" ? "uploaded, scanned, and classified under " + (doc.category || "Other") : doc.ocr_status === "failed" ? "uploaded but AI processing failed. Content may be missing." : "uploaded and is pending processing."}.`,
          time: timeAgo(doc.created_at),
          unread: (now.getTime() - new Date(doc.created_at).getTime()) < 24 * 60 * 60 * 1000,
          docId: doc.id,
        });

        // Expiry notifications
        if (doc.expiry_date) {
          const expDate = new Date(doc.expiry_date);
          const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          if (daysLeft <= 60 && daysLeft >= 0) {
            const urgency = daysLeft <= 14 ? "Urgent" : "Upcoming";
            items.push({
              id: `expiry-${doc.id}`,
              type: "expiry",
              title: `${urgency}: "${doc.file_name}" expires soon`,
              description: daysLeft === 0
                ? `This document expires today. Take action immediately.`
                : `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} on ${expDate.toLocaleDateString()}. Review or renew as needed.`,
              time: `${daysLeft}d left`,
              unread: daysLeft <= 30,
              docId: doc.id,
            });
          } else if (daysLeft < 0) {
            items.push({
              id: `expired-${doc.id}`,
              type: "expiry",
              title: `"${doc.file_name}" has expired`,
              description: `This document expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago. Update it to keep your vault current.`,
              time: `${Math.abs(daysLeft)}d overdue`,
              unread: false,
              docId: doc.id,
            });
          }
        }
      });

      // Sort: expiry first, then by unread, then upload date
      items.sort((a, b) => {
        if (a.type === "expiry" && b.type !== "expiry") return -1;
        if (b.type === "expiry" && a.type !== "expiry") return 1;
        if (a.unread && !b.unread) return -1;
        if (!a.unread && b.unread) return 1;
        return 0;
      });

      setNotifications(items);
      setLoading(false);
    }

    fetchNotifications();
  }, [supabase]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filtered = activeTab === "unread" ? notifications.filter((n) => n.unread) : notifications;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Expiry alerts and document activity from your vault.
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
        {/* Tabs */}
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
              All ({notifications.length})
            </button>
          </div>

          {notifications.some((n) => n.unread) && (
            <button
              onClick={handleMarkAllRead}
              className="flex min-h-[38px] items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading notifications...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-10 w-10 text-slate-200 dark:text-slate-700" />
            <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
              {activeTab === "unread" ? "All caught up!" : "No notifications yet"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {activeTab === "unread"
                ? "No unread alerts. Switch to 'All' to see history."
                : "Upload documents to start seeing alerts and activity here."}
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => {
              const Icon = item.type === "expiry" ? Calendar : item.type === "upload" ? Upload : Clock;
              const iconColor =
                item.type === "expiry"
                  ? "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-400"
                  : item.type === "upload"
                  ? "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400"
                  : "text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400";

              return (
                <div
                  key={item.id}
                  className={`flex gap-3 sm:gap-4 py-4 items-start ${
                    item.unread ? "bg-indigo-50/30 dark:bg-indigo-950/20 px-2.5 rounded-xl -mx-2.5" : ""
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
                          href={`/documents`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                          <span>View in Vault</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 items-end">
                    {item.unread && (
                      <button
                        onClick={() => handleToggleRead(item.id)}
                        className="h-2.5 w-2.5 rounded-full bg-indigo-600 shrink-0"
                        title="Mark as read"
                      />
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-600 dark:text-slate-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors cursor-pointer active:scale-95"
                      title="Dismiss"
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

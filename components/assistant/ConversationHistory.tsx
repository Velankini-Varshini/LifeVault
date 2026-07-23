"use client";

import { MessageSquare } from "lucide-react";
import { conversationHistory } from "@/components/assistant/assistant-data";

export function ConversationHistory({
  activeId,
  onSelect,
  onNewChat,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer active:scale-95 transition-all"
        >
          <span className="text-lg leading-none">+</span>
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          Recent conversations
        </p>
        {conversationHistory.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-slate-200 dark:text-slate-700" />
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">No conversations yet.<br />Start by asking a question.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversationHistory.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  activeId === c.id
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                    : "hover:bg-slate-50 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/40 dark:hover:text-white"
                }`}
              >
                <MessageSquare
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                    activeId === c.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${
                    activeId === c.id ? "text-indigo-700 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
                  }`}>
                    {c.title}
                  </p>
                  <p className="truncate text-xs text-slate-400 dark:text-slate-500">{c.preview}</p>
                </div>
                <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">{c.updatedAt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

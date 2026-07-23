"use client";

import { useState, type FormEvent } from "react";
import { Send, Paperclip } from "lucide-react";

export function ChatInput({ onSend }: { onSend: (value: string) => void }) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 sm:p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <button
        type="button"
        aria-label="Attach a document"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer active:scale-95 transition-transform"
      >
        <Paperclip className="h-5 w-5" />
      </button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Ask about anything in your vault…"
        className="flex-1 bg-transparent py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        aria-label="Send message"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 cursor-pointer active:scale-95"
      >
        <Send className="h-4.5 w-4.5" />
      </button>
    </form>
  );
}

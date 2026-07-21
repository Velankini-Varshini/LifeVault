import { Sparkles, FileText } from "lucide-react";
import type { ChatMessage } from "@/lib/assistant-data";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-2.5 text-sm text-white shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
        <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
      </span>
      <div className="max-w-[80%] space-y-2.5">
        <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-250 shadow-sm border border-transparent dark:border-slate-800/40">
          {message.content}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.sources.map((source) => (
              <span
                key={source.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-655 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              >
                <FileText className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                {source.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import type { ChatMessage } from "@/components/assistant/assistant-data";

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
        <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-200 shadow-sm border border-transparent dark:border-slate-800/40">
          {message.content}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.sources.map((source) => (
              <Link
                key={source.id || source.name}
                href={source.id ? `/documents?docId=${source.id}` : "/documents"}
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/60 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 hover:underline dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-400 cursor-pointer transition-colors"
              >
                <FileText className="h-3 w-3 text-indigo-500" />
                {source.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

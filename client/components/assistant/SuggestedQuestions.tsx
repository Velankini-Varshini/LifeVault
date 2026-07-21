import { Sparkles } from "lucide-react";
import { suggestedQuestions } from "@/lib/assistant-data";

export function SuggestedQuestions({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="mx-auto max-w-lg text-center px-4">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
        <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </span>
      <h2 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
        Ask anything about your vault
      </h2>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Answers are grounded in the personal documents you&apos;ve uploaded.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs sm:text-sm text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 cursor-pointer active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

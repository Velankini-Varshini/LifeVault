import { Sparkles, Send } from "lucide-react";
import { aiExamplePrompts } from "@/components/landing/landing-data";

export function AIFeatures() {
  return (
    <section id="ai-assistant" className="border-t border-slate-200 bg-slate-900 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            AI assistant
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ask your vault a question. Get a real answer.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            No more opening five PDFs to find one policy number. The assistant has
            read everything you&apos;ve uploaded and answers in specifics — dates,
            figures, and document names — sourced from your own vault.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              Answers cite the exact document and field they came from
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              Understands categories, not just keywords — &quot;insurance&quot; finds all policies
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              Suggests actions: renew, restock, or review before it&apos;s urgent
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="text-sm font-medium text-white">LifeVault Assistant</span>
          </div>

          <div className="mt-4 space-y-4">
            {aiExamplePrompts.map((item) => (
              <div key={item.prompt} className="space-y-2">
                <div className="ml-auto w-fit max-w-[85%] rounded-xl rounded-tr-sm bg-indigo-600 px-3.5 py-2 text-sm text-white">
                  {item.prompt}
                </div>
                <div className="w-fit max-w-[85%] rounded-xl rounded-tl-sm bg-slate-700 px-3.5 py-2 text-sm text-slate-100">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5">
            <span className="flex-1 text-sm text-slate-500">Ask about anything in your vault…</span>
            <Send className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>
    </section>
  );
}

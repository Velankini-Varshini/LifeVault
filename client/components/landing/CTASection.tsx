import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="border-t border-slate-200 bg-indigo-600 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Put your household&apos;s paperwork somewhere it can&apos;t lapse quietly.
        </h2>
        <p className="max-w-xl text-indigo-100">
          Free for up to 50 documents. Upgrade only when your household needs more.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
        >
          Get started free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

import { howItWorksSteps } from "@/components/landing/landing-data";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-slate-200 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-indigo-600">How it works</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            From upload to answer, in the order it actually happens
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-4">
          {howItWorksSteps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium text-indigo-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

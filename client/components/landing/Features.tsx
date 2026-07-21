"use client"

import { Shield, Search, Bell, FileText, Users, Sparkles, type LucideIcon } from "lucide-react";
import { coreFeatures, type Feature } from "@/components/landing/landing-data";

const iconMap: Record<Feature["icon"], LucideIcon> = {
  shield: Shield,
  search: Search,
  bell: Bell,
  fileText: FileText,
  users: Users,
  sparkles: Sparkles,
};

export function Features() {
  return (
    <section id="features" className="border-t border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-indigo-600">What it does</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            The household&apos;s paper trail, finally organized
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Not another folder of scans. LifeVault understands what&apos;s inside each
            document and acts on it.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <Icon className="h-5 w-5 text-indigo-600" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

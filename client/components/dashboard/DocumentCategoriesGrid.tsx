"use client";

import React from "react";
import { Shield, FileCheck, Stethoscope, Home, Award, DollarSign } from "lucide-react";
import Link from "next/link";

export function DocumentCategoriesGrid() {
  const categories = [
    { name: "Identity", count: 10, icon: Shield, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400" },
    { name: "Insurance", count: 8, icon: FileCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400" },
    { name: "Medical", count: 5, icon: Stethoscope, color: "text-rose-600 bg-rose-50 dark:bg-rose-950 dark:text-rose-400" },
    { name: "Housing", count: 6, icon: Home, color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400" },
    { name: "Education", count: 3, icon: Award, color: "text-sky-600 bg-sky-50 dark:bg-sky-950 dark:text-sky-400" },
    { name: "Financial", count: 4, icon: DollarSign, color: "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
          Document Categories
        </h3>
        <Link href="/documents" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          View All Vault →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Link
              key={idx}
              href={`/documents?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 cursor-pointer active:scale-95"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.color} group-hover:scale-105 transition-transform`}>
                <Icon className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-display text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {cat.name}
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                {cat.count} documents
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

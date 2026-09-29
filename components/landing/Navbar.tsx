"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Vault } from "lucide-react";


const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "AI assistant", href: "#ai-assistant" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const user = { id: 1 };
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
            <Vault className="h-4 w-4 text-white" strokeWidth={2.25} />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-slate-900">
            LifeVault <span className="text-indigo-600">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                Get started free
              </Link>
            </>
          )}
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-center text-sm font-medium text-slate-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

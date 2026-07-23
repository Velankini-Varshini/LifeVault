"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Vault, Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to request password reset.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                <Vault className="h-4.5 w-4.5 text-white" />
              </span>
              <span className="font-display font-semibold text-slate-900">LifeVault AI</span>
            </Link>

            {!success ? (
              <>
                <h1 className="font-display text-xl font-bold tracking-tight text-slate-900">
                  Reset your password
                </h1>
                <p className="mt-2 text-sm text-slate-500 max-w-xs">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                {error && (
                  <div className="mt-6 flex w-full items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700 text-left">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                <form className="mt-6 w-full space-y-4" onSubmit={handleSubmit}>
                  <div className="text-left">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email Address
                    </label>
                    <div className="relative mt-1">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
                  </button>
                </form>
              </>
            ) : (
              <div className="w-full">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" strokeWidth={1.5} />
                <h1 className="mt-4 font-display text-xl font-bold tracking-tight text-slate-900">
                  Check your inbox
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  We&apos;ve sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>. Please check your junk folder if you don&apos;t see it.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-slate-100 pt-6 w-full">
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

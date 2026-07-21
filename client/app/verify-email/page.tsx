"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Vault, Mail, AlertCircle, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const { user, isMock, sendVerificationEmail, simulateEmailVerification, signOut } = useAuth();
  const router = useRouter();

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Redirect if user is not authenticated at all
    if (!user) {
      router.replace("/sign-in");
      return;
    }
    
    // Redirect if user is already verified
    if (user.emailVerified) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setResending(true);
    setResendStatus(null);
    try {
      await sendVerificationEmail();
      setResendStatus("Verification email resent. Please check your inbox.");
      setCountdown(60); // disable button for 60 seconds
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResendStatus(err.message);
      } else {
        setResendStatus("Failed to resend verification email.");
      }
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    setCheckError(null);
    try {
      if (isMock) {
        // Mock simulation
        simulateEmailVerification();
        router.push("/dashboard");
      } else {
        // Real Firebase reload check
        window.location.reload();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCheckError(err.message);
      } else {
        setCheckError("Failed to check verification status.");
      }
    } finally {
      setChecking(false);
    }
  };

  if (!user) return null;

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

            <div className="rounded-full bg-indigo-50 p-3 text-indigo-600 mb-4">
              <Mail className="h-6 w-6" strokeWidth={1.5} />
            </div>

            <h1 className="font-display text-xl font-bold tracking-tight text-slate-900">
              Verify your email address
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              We&apos;ve sent a verification link to <span className="font-semibold text-slate-700">{user.email}</span>. Click the link in that email to confirm your account.
            </p>

            {isMock && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-left text-xs text-amber-800">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  Mock Authentication Mode
                </p>
                <p className="mt-1">
                  You are testing in developer mock mode. Click the button below to simulate email confirmation instantly.
                </p>
              </div>
            )}

            {resendStatus && (
              <div className="mt-4 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl p-3 w-full">
                {resendStatus}
              </div>
            )}

            {checkError && (
              <div className="mt-4 text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded-xl p-3 w-full">
                {checkError}
              </div>
            )}

            <div className="mt-6 w-full space-y-3">
              <button
                onClick={handleCheckVerification}
                disabled={checking}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                {checking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isMock ? (
                  "Simulate Verification & Proceed"
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Check Verification Status</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400"
              >
                {resending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : countdown > 0 ? (
                  `Resend email in ${countdown}s`
                ) : (
                  "Resend verification email"
                )}
              </button>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 w-full flex justify-between text-xs">
              <button
                onClick={() => signOut().then(() => router.replace("/sign-in"))}
                className="flex items-center gap-1 text-slate-500 font-medium hover:text-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Sign out
              </button>
              <Link href="/" className="text-slate-500 font-medium hover:text-slate-800">
                Back to landing page
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

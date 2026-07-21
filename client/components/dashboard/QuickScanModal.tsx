"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Zap,
  RefreshCw,
  Upload,
  CheckCircle2,
  ScanLine,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type ScanStep = "ready" | "capturing" | "scanning" | "success";

export function QuickScanModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<ScanStep>("ready");
  const [flash, setFlash] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [scannedResult, setScannedResult] = useState<{
    title: string;
    category: string;
    extractedCode: string;
    expiryDate: string;
    summary: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCapture = () => {
    setStep("capturing");
    setTimeout(() => {
      setStep("scanning");
      setTimeout(() => {
        setScannedResult({
          title: "Aadhaar / National ID Card",
          category: "Identity",
          extractedCode: "XXXX-XXXX-9281",
          expiryDate: "No Expiry",
          summary: "Verified National ID card. Extracted name: Priya Nair, Address: Bangalore, India. OCR Confidence: 99.4%.",
        });
        setStep("success");
      }, 2000);
    }, 400);
  };

  const handleReset = () => {
    setStep("ready");
    setScannedResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl text-white z-10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
              <Camera className="h-4 w-4 text-white" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-white">
                Live Document & QR Scanner
              </h3>
              <p className="text-[10px] text-slate-400">Position document inside the frame</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Viewfinder & Body */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {(step === "ready" || step === "capturing" || step === "scanning") && (
              <motion.div key="camera" className="space-y-4">
                {/* Camera Viewfinder Viewport */}
                <div
                  className={`relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border-2 transition-all ${
                    flash ? "border-amber-400 bg-amber-950/20" : "border-slate-800 bg-slate-950"
                  }`}
                >
                  {/* Simulated Camera Feed Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                  {/* Corner Target Alignment Guides */}
                  <div className="absolute inset-6 pointer-events-none border-2 border-indigo-500/60 rounded-xl">
                    <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-indigo-400" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-indigo-400" />
                    <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-indigo-400" />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-indigo-400" />
                  </div>

                  {/* Laser Scanning Animation when processing */}
                  {step === "scanning" && (
                    <motion.div
                      initial={{ top: "10%" }}
                      animate={{ top: "85%" }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                      className="absolute left-6 right-6 h-0.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.9)] z-20"
                    />
                  )}

                  {/* Center Scanning Content Simulation */}
                  <div className="relative z-10 text-center space-y-2">
                    {step === "ready" && (
                      <>
                        <ScanLine className="mx-auto h-10 w-10 text-indigo-400 animate-pulse" />
                        <p className="text-xs text-slate-300 font-medium">Ready to Auto-Capture</p>
                      </>
                    )}
                    {step === "capturing" && (
                      <div className="h-full w-full bg-white/20 animate-ping rounded-2xl" />
                    )}
                    {step === "scanning" && (
                      <div className="space-y-1">
                        <Sparkles className="mx-auto h-8 w-8 text-indigo-400 animate-spin" />
                        <p className="text-xs font-mono text-indigo-300">Extracting OCR Metadata...</p>
                      </div>
                    )}
                  </div>

                  {/* Flash Overlay */}
                  {flash && <div className="absolute inset-0 bg-white/10 pointer-events-none" />}
                </div>

                {/* Camera Control Toolbar */}
                <div className="flex items-center justify-between gap-3 px-2">
                  <button
                    onClick={() => setFlash(!flash)}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
                      flash
                        ? "border-amber-400 bg-amber-400/20 text-amber-300"
                        : "border-slate-800 bg-slate-800/80 text-slate-400 hover:text-white"
                    }`}
                    title="Toggle Flashlight"
                  >
                    <Zap className="h-4.5 w-4.5" />
                  </button>

                  <button
                    onClick={handleCapture}
                    disabled={step !== "ready"}
                    className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
                  >
                    <Camera className="h-4.5 w-4.5" />
                    <span>Auto Scan & Capture</span>
                  </button>

                  <button
                    onClick={() =>
                      setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/80 text-slate-400 hover:text-white transition-all"
                    title="Flip Camera"
                  >
                    <RefreshCw className="h-4.5 w-4.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "success" && scannedResult && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center text-center py-2">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <CheckCircle2 className="h-6 w-6" />
                  </span>
                  <h4 className="mt-3 text-base font-semibold text-white">Scan Successful!</h4>
                  <p className="text-xs text-slate-400">Document recognized and extracted using OCR.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-semibold text-white">{scannedResult.title}</span>
                    <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-900">
                      {scannedResult.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Code / ID</span>
                      <span className="font-mono font-medium text-indigo-300">{scannedResult.extractedCode}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Validity</span>
                      <span className="font-medium text-emerald-400">{scannedResult.expiryDate}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">OCR Analysis</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      {scannedResult.summary}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 min-h-[44px] rounded-xl border border-slate-800 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={() => {
                      alert("Document saved to your personal vault successfully!");
                      onClose();
                    }}
                    className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Save to Vault</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

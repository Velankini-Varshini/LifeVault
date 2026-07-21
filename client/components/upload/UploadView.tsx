"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, File, CheckCircle2, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type UploadStep = "idle" | "uploading" | "ocr" | "ai" | "success";

export function UploadView() {
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState<UploadStep>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    // Convert to readable size
    const sizeInMB = file.size / (1024 * 1024);
    setFileSize(sizeInMB > 0.1 ? `${sizeInMB.toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`);
    
    // Start animation timeline
    startUploadSimulation();
  };

  const startUploadSimulation = () => {
    setStep("uploading");
    setProgress(0);

    // 1. Simulate Upload Progress (1.5 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Go to OCR stage
          setTimeout(() => {
            setStep("ocr");
            simulateOCR();
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 70);
  };

  const simulateOCR = () => {
    // 2. OCR text extraction scanning (2 seconds)
    setTimeout(() => {
      setStep("ai");
      simulateAI();
    }, 2000);
  };

  const simulateAI = () => {
    // 3. AI document classification & tagging (2.5 seconds)
    setTimeout(() => {
      setStep("success");
    }, 2500);
  };

  const resetUpload = () => {
    setStep("idle");
    setProgress(0);
    setFileName("");
    setFileSize("");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Upload document
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Scans PDF or images, runs OCR and tags metadata using Google Gemini.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <AnimatePresence mode="wait">
          {step === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 sm:py-16 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40"
                  : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:border-indigo-500 dark:hover:bg-slate-800/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.heic"
                onChange={handleFileChange}
              />
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <UploadCloud className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white px-2">
                Drag & drop file here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
              </p>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 px-2">
                Supports PDF, PNG, JPG, or HEIC up to 10MB
              </p>

              <button
                type="button"
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all sm:hidden"
              >
                Select File
              </button>
            </motion.div>
          )}

          {step === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 sm:py-16 text-center"
            >
              <File className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{fileName}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{fileSize}</p>
              
              <div className="mt-6 w-full max-w-xs h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="mt-2 text-xs font-mono text-slate-400 dark:text-slate-500">{progress}%</span>
            </motion.div>
          )}

          {step === "ocr" && (
            <motion.div
              key="ocr"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                <div className="absolute inset-0 rounded-full border border-indigo-200/50 dark:border-indigo-800/50 animate-ping" />
              </div>
              <p className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">Extracting text...</p>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Tesseract OCR engine is reading character-sequences, policy numbers, and dates.
              </p>

              <div className="mt-6 relative w-full max-w-xs h-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="absolute left-0 right-0 h-0.5 bg-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-bounce" />
                <div className="p-3 text-[10px] text-left font-mono text-slate-400 dark:text-slate-500 space-y-1">
                  <div>[SCANNING] POLICY_NO_829371</div>
                  <div>[OCR] EXPIRY: 2027-03-14</div>
                  <div>[OCR] ISSUED: NEW DELHI</div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                <Sparkles className="h-7 w-7 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              </div>
              <p className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">Gemini AI Analysis...</p>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Classifying document type, extracting expiry metadata, and writing a comprehensive smart summary.
              </p>

              <div className="mt-5 w-full max-w-xs text-left border border-slate-100 dark:border-slate-800 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 p-4 space-y-2.5">
                <div className="h-2 w-3/4 bg-indigo-200/50 dark:bg-indigo-900/50 rounded animate-pulse" />
                <div className="h-2 w-full bg-indigo-200/50 dark:bg-indigo-900/50 rounded animate-pulse" />
                <div className="h-2 w-5/6 bg-indigo-200/50 dark:bg-indigo-900/50 rounded animate-pulse" />
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">Processing Complete!</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Document analyzed and filed successfully.</p>
              </div>

              {/* Extracted Card Metadata Dashboard */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-800/40">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Extracted Information</h4>
                
                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs text-slate-400 dark:text-slate-500">Document Name</dt>
                    <dd className="mt-1 font-medium text-slate-800 dark:text-slate-200 truncate">{fileName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400 dark:text-slate-500">Category Assigned</dt>
                    <dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                      <span className="rounded bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400">
                        Identity
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400 dark:text-slate-500">Expiry Date</dt>
                    <dd className="mt-1 font-mono font-medium text-emerald-600 dark:text-emerald-400">Mar 14, 2027 (214 days left)</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400 dark:text-slate-500">File Type & Size</dt>
                    <dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">PDF · {fileSize}</dd>
                  </div>
                </dl>

                <div className="mt-4 border-t border-slate-200/60 dark:border-slate-800 pt-4">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">AI Summary</span>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 bg-white p-3 rounded-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                    Indian passport, issued New Delhi. Machine-readable, 10-year validity. Contains passport number, name, DOB, and citizenship details.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetUpload}
                  className="flex-1 min-h-[44px] inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95 cursor-pointer transition-transform"
                >
                  Upload Another File
                </button>
                <button 
                  onClick={() => window.location.href = "/documents"}
                  className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 cursor-pointer transition-transform"
                >
                  <span>Go to Vault</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

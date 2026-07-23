"use client";

import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  X,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  User,
  FileText,
  Compass,
} from "lucide-react";
import { useGlobalAI } from "@/context/GlobalAIContext";
import { getContextualPrompts } from "@/components/assistant/assistant-data";
import { TypingIndicator } from "@/components/assistant/TypingIndicator";
import { ChatInput } from "@/components/assistant/ChatInput";
import { motion, AnimatePresence } from "framer-motion";

function getRouteLabel(pathname: string): string {
  if (pathname.includes("/dashboard")) return "Dashboard Overview";
  if (pathname.includes("/documents")) return "Document Vault";
  if (pathname.includes("/upload")) return "Document Upload";
  if (pathname.includes("/family")) return "Family Sharing";
  if (pathname.includes("/notifications")) return "Notifications";
  if (pathname.includes("/profile")) return "Profile Settings";
  if (pathname.includes("/settings")) return "Account Preferences";
  return "Personal Vault";
}

export function GlobalAIChatDrawer() {
  const {
    isOpen,
    closeChat,
    messages,
    isTyping,
    isStreaming,
    sendMessage,
    regenerateLast,
    clearChat,
    copiedId,
    copyMessage,
  } = useGlobalAI();

  const pathname = usePathname();
  const contextualPrompts = getContextualPrompts(pathname);
  const routeLabel = getRouteLabel(pathname);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, isStreaming]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          />

          {/* Chat Panel Drawer */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col border-t border-slate-200 bg-white shadow-2xl md:bottom-24 md:right-6 md:left-auto md:h-[640px] md:w-[420px] md:rounded-2xl md:border dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] md:max-h-[640px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shrink-0">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white truncate">
                    LifeVault AI
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                      <Compass className="h-3 w-3" />
                      {routeLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={closeChat}
                  title="Minimize AI chat"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Sparkles className="h-5.5 w-5.5" />
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Ask LifeVault AI anything
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Grounded in your personal passports, insurance, certificates, and uploaded files.
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isAssistant = m.role === "assistant";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${isAssistant ? "items-start" : "items-end justify-end"}`}
                    >
                      {isAssistant && (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm mt-0.5">
                          <Sparkles className="h-4 w-4" />
                        </span>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 shadow-xs ${
                          isAssistant
                            ? "bg-slate-50 text-slate-800 border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-200"
                            : "bg-indigo-600 text-white font-medium"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.content}</div>

                        {/* RAG Source References */}
                        {isAssistant && m.sources && m.sources.length > 0 && (
                          <div className="mt-2 border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                              Sources
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {m.sources.map((src, idx) => (
                                <Link
                                  key={idx}
                                  href={src.id ? `/documents?docId=${src.id}` : "/documents"}
                                  onClick={() => closeChat()}
                                  className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 hover:bg-indigo-100 hover:underline dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400 cursor-pointer transition-colors"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span>{src.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions Bar for Assistant Messages */}
                        {isAssistant && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px] text-slate-400">
                            <span>{m.timestamp}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => copyMessage(m.id, m.content)}
                                className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                title="Copy response"
                              >
                                {copiedId === m.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={regenerateLast}
                                className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                title="Regenerate"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {!isAssistant && (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-sm mb-0.5">
                          <User className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  );
                })
              )}

              {isTyping && <TypingIndicator />}
            </div>

            {/* Contextual Suggested Prompt Chips */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-800/40 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar max-w-full">
                {contextualPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(q)}
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 cursor-pointer active:scale-95 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box Footer */}
            <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shrink-0">
              <ChatInput onSend={sendMessage} />
              <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
                Grounded in user vault • Press <kbd className="font-mono text-indigo-500">⌘J</kbd> to toggle
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, History, X, Trash2 } from "lucide-react";
import { useGlobalAI } from "@/context/GlobalAIContext";
import { ConversationHistory } from "@/components/assistant/ConversationHistory";
import { ChatBubble } from "@/components/assistant/ChatBubble";
import { TypingIndicator } from "@/components/assistant/TypingIndicator";
import { SuggestedQuestions } from "@/components/assistant/SuggestedQuestions";
import { ChatInput } from "@/components/assistant/ChatInput";
import { motion, AnimatePresence } from "framer-motion";

export function AssistantView() {
  const { messages, isTyping, sendMessage, clearChat } = useGlobalAI();
  const [activeConversation, setActiveConversation] = useState<string | null>("c1");
  const [historyMobileOpen, setHistoryMobileOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function handleNewChat() {
    clearChat();
    setActiveConversation(null);
    setHistoryMobileOpen(false);
  }

  function handleSelectConversation(id: string) {
    setActiveConversation(id);
    setHistoryMobileOpen(false);
  }

  return (
    <div className="relative flex h-[calc(100vh-5.5rem)] border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      {/* Desktop Conversation History */}
      <ConversationHistory
        activeId={activeConversation}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      {/* Mobile History Drawer Overlay */}
      <AnimatePresence>
        {historyMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden dark:bg-slate-900 flex flex-col"
            >
              <div className="absolute right-3 top-3.5 z-10">
                <button
                  onClick={() => setHistoryMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ConversationHistory
                activeId={activeConversation}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Interface */}
      <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950 min-w-0">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHistoryMobileOpen(true)}
              aria-label="View history"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 active:scale-95 transition-transform cursor-pointer"
            >
              <History className="h-5 w-5" />
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shrink-0">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-sm font-semibold text-slate-900 dark:text-white truncate">
                LifeVault Workspace Assistant
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Grounded in your personal documents & RAG metadata
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <SuggestedQuestions onPick={sendMessage} />
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-5">
              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white px-4 sm:px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-2xl">
            <ChatInput onSend={sendMessage} />
            <p className="mt-2 text-center text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
              LifeVault answers using your stored document vault. Press <kbd className="font-mono text-indigo-500">⌘J</kbd> to toggle global drawer anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

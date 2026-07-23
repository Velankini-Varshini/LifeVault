"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  cannedResponses,
  defaultReply,
  type ChatMessage,
} from "@/components/assistant/assistant-data";

interface GlobalAIContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  isStreaming: boolean;
  sendMessage: (text: string) => void;
  regenerateLast: () => void;
  clearChat: () => void;
  copiedId: string | null;
  copyMessage: (id: string, text: string) => void;
}

const GlobalAIContext = createContext<GlobalAIContextType | undefined>(undefined);

function findReply(question: string): ChatMessage {
  const lower = question.toLowerCase();
  const found = cannedResponses.find((r) => lower.includes(r.match));
  if (found) {
    return {
      ...found.reply,
      id: `r-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }
  return {
    ...defaultReply,
    id: `r-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export function GlobalAIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  // Keyboard shortcut listener (Cmd+J or Ctrl+J)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        toggleChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleChat]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/v1/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();

      setIsTyping(false);
      setIsStreaming(true);

      const replyText = data.reply || (data.error ? `Error: ${data.error}` : "Sorry, I couldn't process that request.");

      const reply: ChatMessage = {
        id: `r-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setIsStreaming(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `r-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setTimeout(() => setIsStreaming(false), 500);
    }
  }, []);

  const regenerateLast = useCallback(async () => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    setIsTyping(true);
    try {
      const res = await fetch("/api/v1/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: lastUserMsg.content }),
      });
      const data = await res.json();

      setIsTyping(false);
      setIsStreaming(true);

      const replyText = data.reply || (data.error ? `Error: ${data.error}` : "Sorry, I couldn't process that request.");

      const reply: ChatMessage = {
        id: `r-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setIsStreaming(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `r-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setTimeout(() => setIsStreaming(false), 500);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const copyMessage = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <GlobalAIContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        messages,
        isTyping,
        isStreaming,
        sendMessage,
        regenerateLast,
        clearChat,
        copiedId,
        copyMessage,
      }}
    >
      {children}
    </GlobalAIContext.Provider>
  );
}

export function useGlobalAI() {
  const context = useContext(GlobalAIContext);
  if (!context) {
    throw new Error("useGlobalAI must be used within a GlobalAIProvider");
  }
  return context;
}

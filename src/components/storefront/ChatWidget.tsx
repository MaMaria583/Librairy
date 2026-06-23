"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, Bot, Loader2, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Avez-vous des romans ?",
  "Comment passer une commande ?",
  "Quels sont vos modes de paiement ?",
  "Livrez-vous à Bamako ?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! 👋 Je suis l'assistant de **DAR ELHIKMA**. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Désolé, une erreur s'est produite." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Impossible de joindre l'assistant. Contactez-nous sur WhatsApp." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function renderContent(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1e3a5f] text-white shadow-lg hover:bg-[#162d4a] transition-all flex items-center justify-center"
        aria-label="Assistant IA"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && messages.length > 1 && (
          <span className="absolute -top-1 -right-1 bg-[#c0392b] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {messages.filter((m) => m.role === "assistant").length}
          </span>
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
        style={{ height: "500px" }}
      >
        {/* Header */}
        <div className="bg-[#1e3a5f] px-4 py-3 flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/20 shrink-0">
            <Image src="/images/books/logo.jpg" alt="DAR ELHIKMA" fill className="object-contain" style={{ mixBlendMode: "screen" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">Assistant DAR ELHIKMA</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/70 text-xs">En ligne</span>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-[#1e3a5f] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1e3a5f] text-white rounded-br-sm"
                    : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-sm"
                }`}
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
              />
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1e3a5f] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-100 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-sm">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions (first message only) */}
        {messages.length === 1 && (
          <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-100 bg-white">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-slate-100 hover:bg-[#1e3a5f] hover:text-white text-slate-600 px-2.5 py-1 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 py-3 border-t border-slate-100 bg-white flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Posez votre question..."
            className="flex-1 text-sm bg-slate-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center hover:bg-[#162d4a] transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

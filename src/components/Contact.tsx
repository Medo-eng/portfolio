"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  MessageSquareText,
  PenLine,
  Send,
  Shield,
  UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  addContact,
  ensureCustomerThread,
  getActiveSessionId,
  getThread,
  resetCustomerSession,
  sendCustomerMessage,
  subscribeStorage,
  type ChatMessage,
  type ChatThread,
} from "@/lib/chat-store";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

export function Contact() {
  const [mode, setMode] = useState<"form" | "chat">("form");
  const [chatMode, setChatMode] = useState<"anon" | "email">("anon");
  const [email, setEmail] = useState("");
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [chatReady, setChatReady] = useState(false);
  const threadIdRef = useRef<string | null>(null);

  function bindThread(t: ChatThread | null) {
    threadIdRef.current = t?.id ?? null;
    setThread(t);
    setMessages(t ? [...t.messages] : []);
  }

  useEffect(() => {
    const sync = () => {
      const id = getActiveSessionId();
      // Only refresh the chat you are currently in — never snap back to an older thread
      if (!id || !threadIdRef.current || id !== threadIdRef.current) return;
      const t = getThread(id);
      if (t) {
        setThread(t);
        setMessages([...t.messages]);
      }
    };
    return subscribeStorage(sync);
  }, []);

  function startChat(e: FormEvent) {
    e.preventDefault();
    const t =
      chatMode === "email" && email.trim()
        ? ensureCustomerThread({ email: email.trim().toLowerCase() })
        : ensureCustomerThread({ anonymous: true, forceNew: true });
    bindThread(t);
    setChatReady(true);
  }

  /** Opens a brand-new guest thread immediately (separate from previous chats). */
  function startNewAnonymousChat() {
    resetCustomerSession();
    const t = ensureCustomerThread({ anonymous: true, forceNew: true });
    bindThread(t);
    setDraft("");
    setChatMode("anon");
    setChatReady(true);
  }

  function sendMessage(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    const id = getActiveSessionId() || threadIdRef.current || thread?.id;
    if (!id || !text) return;
    sendCustomerMessage(id, text);
    setDraft("");
    const updated = getThread(id);
    if (updated) bindThread(updated);
  }

  function submitContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const mail = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !mail || !message) return;
    addContact({ name, email: mail, message });
    setFormStatus("Message saved. Mohamed will get back to you soon.");
    e.currentTarget.reset();
  }

  return (
    <section id="contact" className="section-pad mx-auto max-w-6xl pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        className="mb-10 max-w-2xl"
      >
        <p className="eyebrow mb-5">Contact & Live Chat</p>
        <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Let&apos;s build something that converts
        </h2>
      </motion.div>

      <div className="mb-6 flex gap-2">
        {(
          [
            ["form", "Contact Form", PenLine],
            ["chat", "Live Chat", MessageCircle],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === key
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            <Icon className="size-3.5" strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {mode === "form" ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="grid gap-8 rounded-2xl border border-[var(--border)] bg-transparent p-6 sm:p-8 lg:grid-cols-2"
        >
          <div>
            <h3 className="font-display inline-flex items-center gap-2 text-xl font-medium">
              <Mail className="size-4" strokeWidth={1.5} />
              Send a direct message
            </h3>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Prefer email? Reach out at{" "}
              <a
                href="mailto:medodakhly11@gmail.com"
                className="font-medium text-[var(--fg)] underline-offset-2 hover:underline"
              >
                medodakhly11@gmail.com
              </a>
            </p>
            <form onSubmit={submitContact} className="mt-6 space-y-4">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Name</span>
                <input
                  name="name"
                  required
                  className="focus-ring w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="focus-ring w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Message</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="focus-ring w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none"
                />
              </label>
              <button
                type="submit"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3 text-sm font-semibold text-[var(--bg)]"
              >
                <Send className="size-4" /> Send Message
              </button>
              {formStatus ? (
                <p className="text-sm text-[var(--fg)]">{formStatus}</p>
              ) : null}
            </form>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-[var(--border)] bg-transparent p-6">
            <CheckCircle2
              className="size-7 text-[var(--fg)]"
              strokeWidth={1.5}
            />
            <h4 className="mt-4 font-display text-lg font-medium">
              What happens next
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
              Submissions are stored locally for this demo portfolio and surface
              in the private admin inbox. In production, wire this to Resend,
              Formspree, or Supabase.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="overflow-hidden rounded-2xl border border-[var(--border)] bg-transparent"
        >
          {!chatReady ? (
            <form onSubmit={startChat} className="space-y-5 p-6 sm:p-8">
              <h3 className="font-display inline-flex items-center gap-2 text-xl font-medium">
                <MessageSquareText className="size-4" strokeWidth={1.5} />
                Start chatting
              </h3>
              <p className="text-sm text-[var(--fg-muted)]">
                Quick sign-up with email, or stay completely anonymous with a
                temporary session ID. Each anonymous Open Chat creates a new
                thread in the admin board.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setChatMode("anon")}
                  className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    chatMode === "anon"
                      ? "bg-[var(--fg)] text-[var(--bg)]"
                      : "border border-[var(--border)]"
                  }`}
                >
                  <Shield className="size-4" /> Anonymous
                </button>
                <button
                  type="button"
                  onClick={() => setChatMode("email")}
                  className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    chatMode === "email"
                      ? "bg-[var(--fg)] text-[var(--bg)]"
                      : "border border-[var(--border)]"
                  }`}
                >
                  <UserRound className="size-4" /> Email sign-up
                </button>
              </div>
              {chatMode === "email" ? (
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus-ring w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none"
                  />
                </label>
              ) : null}
              <button
                type="submit"
                className="focus-ring rounded-full bg-[var(--fg)] px-5 py-3 text-sm font-semibold text-[var(--bg)]"
              >
                Open Chat
              </button>
            </form>
          ) : (
            <div className="flex h-[420px] flex-col">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <div>
                  <p className="font-display font-medium">Live Chat</p>
                  <p className="text-xs text-[var(--fg-muted)]">
                    {thread?.label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startNewAnonymousChat}
                  className="focus-ring text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]"
                >
                  New chat
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {messages.length === 0 ? (
                  <p className="text-sm text-[var(--fg-muted)]">
                    Say hello — Mohamed can reply from the admin panel in
                    real-time. Watch the guest ID change when you press New
                    chat.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[85%] rounded-2xl border px-3.5 py-2.5 text-sm ${
                        m.role === "customer"
                          ? "ml-auto border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                          : "border-[var(--border)] bg-transparent text-[var(--fg)]"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))
                )}
              </div>
              <form
                onSubmit={sendMessage}
                className="flex gap-2 border-t border-[var(--border)] p-4"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="focus-ring flex-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="focus-ring inline-flex size-11 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)]"
                  aria-label="Send"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  getContacts,
  getVisibleThreads,
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
  markThreadRead,
  sendAdminMessage,
  subscribeStorage,
  type ChatThread,
  type ContactSubmission,
} from "@/lib/chat-store";
import { LogOut, MessageSquare, Inbox, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminMessagesPage() {
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState<"chats" | "contacts">("chats");

  function refreshInbox() {
    setThreads(getVisibleThreads());
    setContacts(getContacts());
  }

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
    refreshInbox();
    return subscribeStorage(refreshInbox);
  }, []);

  function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");
    if (loginAdmin(email, password)) {
      setAuthed(true);
      setError(null);
      refreshInbox();
    } else {
      setError("Invalid credentials.");
    }
  }

  const active = threads.find((t) => t.id === activeId) ?? null;

  function reply(e: FormEvent) {
    e.preventDefault();
    if (!active || !draft.trim()) return;
    sendAdminMessage(active.id, draft.trim());
    markThreadRead(active.id);
    setDraft("");
    refreshInbox();
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={onLogin}
          className="rounded-2xl border border-[var(--border)] bg-white/70 backdrop-blur-md dark:bg-black/40 w-full max-w-md space-y-4 rounded-3xl p-8"
        >
          <h1 className="font-display text-2xl font-medium">
            Admin Access
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Protected inbox for chat threads and contact submissions.
          </p>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="focus-ring w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="focus-ring w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="focus-ring w-full rounded-full bg-[var(--fg)] py-3 text-sm font-semibold text-[var(--bg)]"
          >
            Sign In
          </button>
          <Link
            href="/"
            className="block text-center text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
          >
            Back to site
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-medium">
              Message Center
            </h1>
            <p className="text-sm text-[var(--fg-muted)]">
              Hidden admin route · localStorage demo sync
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="focus-ring rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={refreshInbox}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
            >
              <RefreshCw className="size-4" /> Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                setAuthed(false);
              }}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-4 py-2 text-sm font-semibold text-[var(--bg)]"
            >
              <LogOut className="size-4" /> Logout
            </button>
          </div>
        </header>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("chats")}
            className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "chats"
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "border border-[var(--border)]"
            }`}
          >
            <MessageSquare className="size-4" /> Chats ({threads.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("contacts")}
            className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "contacts"
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "border border-[var(--border)]"
            }`}
          >
            <Inbox className="size-4" /> Contacts ({contacts.length})
          </button>
        </div>

        {tab === "chats" ? (
          <div className="rounded-2xl border border-[var(--border)] bg-white/70 backdrop-blur-md dark:bg-black/40 grid min-h-[560px] overflow-hidden rounded-3xl lg:grid-cols-[280px_1fr]">
            <aside className="border-b border-[var(--border)] lg:border-b-0 lg:border-r">
              <ul className="max-h-[240px] overflow-y-auto lg:max-h-none lg:h-full">
                {threads.length === 0 ? (
                  <li className="p-4 text-sm text-[var(--fg-muted)]">
                    No chat threads yet.
                  </li>
                ) : (
                  threads.map((t) => {
                    const preview = t.messages[t.messages.length - 1]?.text ?? "";
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveId(t.id);
                            markThreadRead(t.id);
                            refreshInbox();
                          }}
                          className={`flex w-full flex-col gap-0.5 border-b border-[var(--border)] px-4 py-3 text-left transition hover:bg-[var(--bg-muted)] ${
                            activeId === t.id ? "bg-[var(--bg-muted)]" : ""
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                            {t.label}
                            {t.unreadForAdmin ? (
                              <span className="size-2 shrink-0 rounded-full bg-[var(--fg)]" />
                            ) : null}
                          </span>
                          <span className="text-xs capitalize text-[var(--fg-muted)]">
                            {t.type === "email" ? "Email" : "Anonymous Guest"} ·{" "}
                            {t.messages.length} msg
                            {t.messages.length === 1 ? "" : "s"}
                          </span>
                          {preview ? (
                            <span className="truncate text-xs text-[var(--fg-muted)]">
                              {preview}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </aside>

            <div className="flex flex-col">
              {active ? (
                <>
                  <div className="border-b border-[var(--border)] px-5 py-4">
                    <p className="font-semibold">{active.label}</p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      Thread ID: {active.id}
                    </p>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto p-5">
                    {active.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                          m.role === "admin"
                            ? "ml-auto bg-[var(--fg)] text-[var(--bg)]"
                            : "bg-[var(--bg-muted)]"
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={reply}
                    className="flex gap-2 border-t border-[var(--border)] p-4"
                  >
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Reply as Mohamed..."
                      className="focus-ring flex-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none"
                    />
                    <button
                      type="submit"
                      className="focus-ring rounded-full bg-[var(--fg)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)]"
                    >
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--fg-muted)]">
                  Select a thread to reply in real-time.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-white/70 backdrop-blur-md dark:bg-black/40 space-y-3 rounded-3xl p-4 sm:p-6">
            {contacts.length === 0 ? (
              <p className="text-sm text-[var(--fg-muted)]">
                No contact form submissions yet.
              </p>
            ) : (
              contacts.map((c) => (
                <article
                  key={c.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">{c.name}</h3>
                    <time className="text-xs text-[var(--fg-muted)]">
                      {new Date(c.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <a
                    href={`mailto:${c.email}`}
                    className="mt-1 text-sm text-[var(--fg)]"
                  >
                    {c.email}
                  </a>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
                    {c.message}
                  </p>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

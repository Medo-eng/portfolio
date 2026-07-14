export type ChatMessage = {
  id: string;
  role: "customer" | "admin";
  text: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  type: "email" | "anonymous";
  label: string;
  email?: string;
  messages: ChatMessage[];
  updatedAt: number;
  unreadForAdmin: boolean;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
};

const THREADS_KEY = "mn-chat-threads-v2";
const CONTACTS_KEY = "mn-contact-submissions";
const SESSION_KEY = "mn-chat-session-id-v2";
const ADMIN_KEY = "mn-admin-auth";
const LEGACY_THREADS_KEY = "mn-chat-threads";

export const ADMIN_EMAIL = "medodakhly11@gmail.com";
export const ADMIN_PASSWORD = "Nemedo123$";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("mn-storage", { detail: { key } }));
}

function migrateLegacyThreads() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(THREADS_KEY)) return;
  const legacy = localStorage.getItem(LEGACY_THREADS_KEY);
  if (legacy) {
    localStorage.setItem(THREADS_KEY, legacy);
  }
}

export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setActiveSessionId(id: string) {
  localStorage.setItem(SESSION_KEY, id);
}

export function resetCustomerSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(
    new CustomEvent("mn-storage", { detail: { key: SESSION_KEY } }),
  );
}

export function getThreads(): ChatThread[] {
  migrateLegacyThreads();
  const threads = readJSON<ChatThread[]>(THREADS_KEY, []);
  return [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getVisibleThreads(): ChatThread[] {
  return getThreads().filter((t) => (t.messages?.length ?? 0) > 0);
}

export function getThread(id: string): ChatThread | undefined {
  return getThreads().find((t) => t.id === id);
}

/** Immutable upsert — never mutate objects pulled from localStorage. */
export function upsertThread(thread: ChatThread) {
  const next: ChatThread = {
    ...thread,
    messages: thread.messages.map((m) => ({ ...m })),
  };
  const threads = getThreads()
    .filter((t) => t.id !== next.id)
    .map((t) => ({ ...t, messages: t.messages.map((m) => ({ ...m })) }));
  threads.unshift(next);
  writeJSON(THREADS_KEY, threads);
}

function createAnonymousThread(): ChatThread {
  const id = uid("guest");
  // Set active session BEFORE writing so any sync listeners latch onto the new id
  setActiveSessionId(id);
  const thread: ChatThread = {
    id,
    type: "anonymous",
    label: `Guest ${id.slice(-6).toUpperCase()}`,
    messages: [],
    updatedAt: Date.now(),
    unreadForAdmin: false,
  };
  upsertThread(thread);
  return thread;
}

export function ensureCustomerThread(opts: {
  email?: string;
  anonymous?: boolean;
  forceNew?: boolean;
}): ChatThread {
  if (opts.email) {
    const email = opts.email.trim().toLowerCase();
    const existing = getThreads().find(
      (t) => t.type === "email" && t.email === email,
    );
    if (existing) {
      setActiveSessionId(existing.id);
      return {
        ...existing,
        messages: existing.messages.map((m) => ({ ...m })),
      };
    }
    const id = uid("email");
    setActiveSessionId(id);
    const thread: ChatThread = {
      id,
      type: "email",
      label: email,
      email,
      messages: [],
      updatedAt: Date.now(),
      unreadForAdmin: false,
    };
    upsertThread(thread);
    return thread;
  }

  if (opts.forceNew) {
    return createAnonymousThread();
  }

  const sessionId = getActiveSessionId();
  if (sessionId) {
    const existing = getThread(sessionId);
    if (existing?.type === "anonymous") {
      return {
        ...existing,
        messages: existing.messages.map((m) => ({ ...m })),
      };
    }
  }

  return createAnonymousThread();
}

export function sendCustomerMessage(threadId: string, text: string) {
  const existing = getThread(threadId);
  if (!existing) return;
  upsertThread({
    ...existing,
    messages: [
      ...existing.messages,
      {
        id: uid("msg"),
        role: "customer",
        text,
        createdAt: Date.now(),
      },
    ],
    updatedAt: Date.now(),
    unreadForAdmin: true,
  });
}

export function sendAdminMessage(threadId: string, text: string) {
  const existing = getThread(threadId);
  if (!existing) return;
  upsertThread({
    ...existing,
    messages: [
      ...existing.messages,
      {
        id: uid("msg"),
        role: "admin",
        text,
        createdAt: Date.now(),
      },
    ],
    updatedAt: Date.now(),
    unreadForAdmin: false,
  });
}

export function markThreadRead(threadId: string) {
  const existing = getThread(threadId);
  if (!existing) return;
  upsertThread({
    ...existing,
    unreadForAdmin: false,
  });
}

export function getContacts(): ContactSubmission[] {
  return readJSON<ContactSubmission[]>(CONTACTS_KEY, []).sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

export function addContact(data: {
  name: string;
  email: string;
  message: string;
}) {
  const contacts = getContacts();
  contacts.unshift({
    id: uid("contact"),
    ...data,
    createdAt: Date.now(),
  });
  writeJSON(CONTACTS_KEY, contacts);
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}

export function loginAdmin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}

export function subscribeStorage(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener("mn-storage", handler as EventListener);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("mn-storage", handler as EventListener);
  };
}

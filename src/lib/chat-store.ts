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

const THREADS_KEY = "mn-chat-threads";
const CONTACTS_KEY = "mn-contact-submissions";
const SESSION_KEY = "mn-chat-session-id";
const ADMIN_KEY = "mn-admin-auth";

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

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uid("guest");
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getThreads(): ChatThread[] {
  return readJSON<ChatThread[]>(THREADS_KEY, []).sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );
}

export function getThread(id: string): ChatThread | undefined {
  return getThreads().find((t) => t.id === id);
}

export function upsertThread(thread: ChatThread) {
  const threads = getThreads().filter((t) => t.id !== thread.id);
  threads.unshift(thread);
  writeJSON(THREADS_KEY, threads);
}

export function ensureCustomerThread(opts: {
  email?: string;
  anonymous?: boolean;
}): ChatThread {
  const threads = getThreads();
  if (opts.email) {
    const existing = threads.find(
      (t) => t.type === "email" && t.email === opts.email,
    );
    if (existing) return existing;
    const thread: ChatThread = {
      id: uid("email"),
      type: "email",
      label: opts.email,
      email: opts.email,
      messages: [],
      updatedAt: Date.now(),
      unreadForAdmin: false,
    };
    upsertThread(thread);
    localStorage.setItem(SESSION_KEY, thread.id);
    return thread;
  }

  const sessionId = getOrCreateSessionId();
  const existing = threads.find((t) => t.id === sessionId);
  if (existing) return existing;

  const thread: ChatThread = {
    id: sessionId,
    type: "anonymous",
    label: `Guest ${sessionId.slice(-6).toUpperCase()}`,
    messages: [],
    updatedAt: Date.now(),
    unreadForAdmin: false,
  };
  upsertThread(thread);
  return thread;
}

export function sendCustomerMessage(threadId: string, text: string) {
  const thread = getThread(threadId);
  if (!thread) return;
  thread.messages.push({
    id: uid("msg"),
    role: "customer",
    text,
    createdAt: Date.now(),
  });
  thread.updatedAt = Date.now();
  thread.unreadForAdmin = true;
  upsertThread(thread);
}

export function sendAdminMessage(threadId: string, text: string) {
  const thread = getThread(threadId);
  if (!thread) return;
  thread.messages.push({
    id: uid("msg"),
    role: "admin",
    text,
    createdAt: Date.now(),
  });
  thread.updatedAt = Date.now();
  thread.unreadForAdmin = false;
  upsertThread(thread);
}

export function markThreadRead(threadId: string) {
  const thread = getThread(threadId);
  if (!thread) return;
  thread.unreadForAdmin = false;
  upsertThread(thread);
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

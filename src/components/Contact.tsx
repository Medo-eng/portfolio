"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  Send,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { easeOut } from "@/lib/motion";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

const SOCIAL = {
  instagram: "https://www.instagram.com/mohamednaserdakhly/",
  facebook: "https://www.facebook.com/profile.php?id=61591897081085",
} as const;

const SUCCESS_COPY =
  "Email sent successfully. Please wait about 1 to 2 hours for a reply. If it takes longer please check your spam/junk folder.";

const CONTACT_INBOX = "medodakhly11@gmail.com";

type ApiResponse = {
  ok?: boolean;
  error?: string;
  id?: string;
};

type SendResult = { ok: true } | { ok: false; error: string };

async function sendViaResend(payload: {
  name: string;
  email: string;
  message: string;
  website: string;
}): Promise<SendResult | "unconfigured"> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  let data: ApiResponse = {};
  try {
    data = (await res.json()) as ApiResponse;
  } catch {
    data = {};
  }

  if (res.status === 503) return "unconfigured";

  if (!res.ok || !data.ok) {
    return {
      ok: false,
      error:
        data.error ||
        "Could not send your message. Please try again in a moment.",
    };
  }

  return { ok: true };
}

async function sendViaFormSubmit(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<SendResult> {
  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_INBOX)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        message: payload.message,
        _subject: `Portfolio inquiry from ${payload.name}`,
        _replyto: payload.email,
        _template: "table",
        _captcha: false,
      }),
    },
  );

  let data: { success?: boolean | string; message?: string } = {};
  try {
    data = (await res.json()) as {
      success?: boolean | string;
      message?: string;
    };
  } catch {
    data = {};
  }

  const success = data.success === true || data.success === "true";
  if (!res.ok || !success) {
    const needsActivation =
      typeof data.message === "string" &&
      data.message.toLowerCase().includes("activat");

    return {
      ok: false,
      error: needsActivation
        ? "Almost ready — check medodakhly11@gmail.com and click the FormSubmit activation link, then try again."
        : data.message ||
          "Could not send your message. Please try again in a moment.",
    };
  }

  return { ok: true };
}

async function sendContactMessage(payload: {
  name: string;
  email: string;
  message: string;
  website: string;
}): Promise<SendResult> {
  // Prefer Resend when configured; otherwise use FormSubmit (no API key needed).
  try {
    const primary = await sendViaResend(payload);
    if (primary !== "unconfigured") return primary;
  } catch {
    // Fall through to FormSubmit.
  }

  return sendViaFormSubmit(payload);
}

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSocial, setActiveSocial] = useState<"instagram" | "facebook">(
    "instagram",
  );
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!showSuccess) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShowSuccess(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showSuccess]);

  async function submitContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setFormError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const website = String(data.get("website") || "").trim();

    if (!name || !email || !message) {
      setFormError("Please fill out every field.");
      return;
    }

    setSubmitting(true);

    try {
      const sent = await sendContactMessage({ name, email, message, website });
      if (!sent.ok) {
        setFormError(sent.error);
        return;
      }

      form.reset();
      setShowSuccess(true);
    } catch {
      setFormError(
        "Network error. Check your connection and try sending again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const socialHref =
    activeSocial === "instagram" ? SOCIAL.instagram : SOCIAL.facebook;

  return (
    <section id="contact" className="section-pad mx-auto max-w-6xl pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        className="mb-10 max-w-2xl"
      >
        <p className="eyebrow mb-5 inline-flex items-center gap-2">
          <Mail className="size-3.5" strokeWidth={1.5} />
          Contact
        </p>
        <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Let&apos;s build something that converts
        </h2>
        <motion.div
          className="mt-5 h-px w-16 origin-left bg-[var(--fg)]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.12 }}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring}
          className="rounded-2xl border border-[var(--border)] bg-transparent p-6 sm:p-8"
        >
          <h3 className="font-display inline-flex items-center gap-2 text-xl font-medium">
            <Mail className="size-4" strokeWidth={1.5} />
            Send a message
          </h3>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            Or email directly at{" "}
            <a
              href="mailto:medodakhly11@gmail.com"
              className="font-medium text-[var(--fg)] underline-offset-2 hover:underline"
            >
              medodakhly11@gmail.com
            </a>
          </p>
          <form
            onSubmit={submitContact}
            className="mt-6 space-y-4"
            noValidate
          >
            {/* Honeypot — leave empty */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Name</span>
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                disabled={submitting}
                autoComplete="name"
                className="focus-ring w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Email</span>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                disabled={submitting}
                autoComplete="email"
                className="focus-ring w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none disabled:opacity-60"
              />
              <span className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-[var(--fg-muted)]">
                <ArrowUp
                  className="mt-0.5 size-3.5 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />
                Make sure this is correct — this email will be the one I reply
                to!
              </span>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Message</span>
              <textarea
                name="message"
                required
                minLength={5}
                maxLength={5000}
                rows={4}
                disabled={submitting}
                className="focus-ring w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3 text-sm font-semibold text-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      strokeWidth={1.5}
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-4" strokeWidth={1.5} /> Send Message
                  </>
                )}
              </button>
              <p className="mt-2 flex max-w-sm items-start gap-1.5 text-xs leading-relaxed text-[var(--fg-muted)]">
                <ArrowUp
                  className="mt-0.5 size-3.5 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />
                This won&apos;t redirect you — it will send your message to me
                automatically.
              </p>
            </div>
            {formError ? (
              <p role="alert" className="text-sm text-red-500">
                {formError}
              </p>
            ) : null}
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.08 }}
          className="flex flex-col rounded-2xl border border-[var(--border)] bg-transparent p-6 sm:p-8"
        >
          <h3 className="font-display text-xl font-medium">Social</h3>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            Connect on Instagram or Facebook.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSocial("instagram")}
              className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                activeSocial === "instagram"
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              <Instagram className="size-4" strokeWidth={1.5} />
              Instagram
            </button>
            <button
              type="button"
              onClick={() => setActiveSocial("facebook")}
              className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                activeSocial === "facebook"
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              <Facebook className="size-4" strokeWidth={1.5} />
              Facebook
            </button>
          </div>

          <div className="mt-8 flex flex-1 flex-col justify-center rounded-2xl border border-[var(--border)] p-6">
            {activeSocial === "instagram" ? (
              <>
                <Instagram className="size-8" strokeWidth={1.5} />
                <h4 className="font-display mt-4 text-2xl font-medium">
                  @mohamednaserdakhly
                </h4>
                <p className="mt-2 text-sm font-light text-[var(--fg-muted)]">
                  Follow for design work, builds, and updates.
                </p>
              </>
            ) : (
              <>
                <Facebook className="size-8" strokeWidth={1.5} />
                <h4 className="font-display mt-4 text-2xl font-medium">
                  Mohamed Dakhly
                </h4>
                <p className="mt-2 text-sm font-light text-[var(--fg-muted)]">
                  Visit the Facebook page to connect and message.
                </p>
              </>
            )}

            <motion.a
              href={socialHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3.5 text-xs font-medium tracking-[0.12em] uppercase text-[var(--bg)]"
            >
              Open {activeSocial === "instagram" ? "Instagram" : "Facebook"}
              <ExternalLink className="size-3.5" strokeWidth={1.5} />
            </motion.a>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-xs text-[var(--fg-muted)]">
            <CheckCircle2 className="size-3.5" strokeWidth={1.5} />
            Opens in a new tab
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSuccess ? (
          <motion.div
            key="contact-success"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: easeOut }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 shadow-[var(--shadow)]"
            >
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Close"
                onClick={() => setShowSuccess(false)}
                className="focus-ring absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>

              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: easeOut, delay: 0.05 }}
                  className="relative mb-5 flex size-16 items-center justify-center"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-emerald-400/25 blur-xl"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-1 rounded-full bg-emerald-400/15 blur-md"
                  />
                  <CheckCircle2
                    className="relative size-14 text-emerald-400"
                    strokeWidth={1.5}
                    style={{
                      filter:
                        "drop-shadow(0 0 10px rgba(52, 211, 153, 0.85)) drop-shadow(0 0 22px rgba(16, 185, 129, 0.55))",
                    }}
                  />
                </motion.div>

                <h3
                  id={titleId}
                  className="font-display text-2xl font-medium tracking-tight"
                >
                  Message sent
                </h3>
                <p
                  id={descId}
                  className="mt-3 text-sm leading-relaxed font-light text-[var(--fg-muted)]"
                >
                  {SUCCESS_COPY}
                </p>

                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="focus-ring mt-7 inline-flex items-center justify-center rounded-full bg-[var(--fg)] px-6 py-2.5 text-xs font-medium tracking-[0.12em] uppercase text-[var(--bg)]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

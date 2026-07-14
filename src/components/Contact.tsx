"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  Send,
} from "lucide-react";
import { FormEvent, useState } from "react";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

const SOCIAL = {
  instagram: "https://www.instagram.com/mohamednaserdakhly/",
  facebook: "https://www.facebook.com/profile.php?id=61591897081085",
} as const;

export function Contact() {
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [activeSocial, setActiveSocial] = useState<"instagram" | "facebook">(
    "instagram",
  );

  function submitContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const mail = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !mail || !message) return;

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${mail}\n\n${message}`,
    );
    window.location.href = `mailto:medodakhly11@gmail.com?subject=${subject}&body=${body}`;
    setFormStatus("Opening your email app…");
    e.currentTarget.reset();
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
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
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
              <Send className="size-4" strokeWidth={1.5} /> Send Message
            </button>
            {formStatus ? (
              <p className="text-sm text-[var(--fg-muted)]">{formStatus}</p>
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
    </section>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Home,
  LayoutTemplate,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

const APEX = {
  id: "apex",
  title: "Apex Roofing",
  category: "Local Service · Landing Page",
  description:
    "A high-converting roofing landing page built for local lead capture, trust, and mobile-first speed — live on Vercel.",
  url: "https://apex-roofing-git-v0-medo-eng-133956ad-medo-engs-projects.vercel.app/",
};

export function Portfolio() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section id="portfolio" className="section-pad mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        className="mb-12 max-w-2xl"
      >
        <motion.p
          className="eyebrow mb-5 inline-flex items-center gap-2"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.05 }}
        >
          <LayoutTemplate className="size-3.5" strokeWidth={1.5} />
          Featured Work
        </motion.p>
        <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          One live deployment, ready to explore
        </h2>
      </motion.div>

      <motion.button
        type="button"
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={spring}
        whileHover={{ y: -8, scale: 1.01 }}
        whileTap={{ scale: 0.985 }}
        onClick={() => setOpen(true)}
        className="focus-ring group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-transparent p-8 text-left sm:p-10"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 40%, rgba(10,10,10,0.04), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <motion.span
                className="flex size-11 items-center justify-center rounded-full border border-[var(--border)]"
                whileHover={{ rotate: -8, scale: 1.08 }}
                transition={spring}
              >
                <Home className="size-4" strokeWidth={1.5} />
              </motion.span>
              <span className="eyebrow text-[10px]">{APEX.category}</span>
            </div>
            <h3 className="font-display mt-6 text-4xl font-medium sm:text-5xl">
              {APEX.title}
            </h3>
            <p className="mt-4 text-base font-light leading-relaxed text-[var(--fg-muted)] sm:text-lg">
              {APEX.description}
            </p>
            <motion.span
              className="mt-7 inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase text-[var(--fg)]"
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Open live demo
              <ExternalLink className="size-3.5" strokeWidth={1.5} />
            </motion.span>
          </div>

          <motion.div
            className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[var(--border)] self-end sm:self-start"
            whileHover={{ rotate: 45, scale: 1.1 }}
            transition={spring}
          >
            <ArrowUpRight className="size-5" strokeWidth={1.5} />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
          >
            <motion.button
              type="button"
              aria-label="Close dialog"
              className="absolute inset-0 bg-white/80 backdrop-blur-sm dark:bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={spring}
              className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-7 sm:p-8"
            >
              <motion.button
                type="button"
                onClick={() => setOpen(false)}
                whileHover={{ rotate: 90, scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                transition={spring}
                className="focus-ring absolute right-4 top-4 rounded-full border border-[var(--border)] p-2 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                aria-label="Close"
              >
                <X className="size-4" strokeWidth={1.5} />
              </motion.button>
              <motion.div
                className="mb-4 flex size-10 items-center justify-center rounded-full border border-[var(--border)]"
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={spring}
              >
                <Sparkles className="size-4" strokeWidth={1.5} />
              </motion.div>
              <h3 id={titleId} className="font-display pr-8 text-3xl font-medium">
                {APEX.title}
              </h3>
              <p
                id={descId}
                className="mt-5 text-sm font-light leading-relaxed text-[var(--fg-muted)]"
              >
                You are now visiting a live, interactive production deployment
                of this project hosted on Vercel. Feel free to click around and
                test its speed!
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href={APEX.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3.5 text-xs font-medium tracking-[0.12em] uppercase text-[var(--bg)]"
                  onClick={() => setOpen(false)}
                >
                  Proceed to Live Demo
                  <ExternalLink className="size-3" strokeWidth={1.5} />
                </motion.a>
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3.5 text-xs font-medium tracking-[0.12em] uppercase"
                >
                  Stay Here
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

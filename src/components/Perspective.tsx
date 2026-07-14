"use client";

import { motion } from "framer-motion";
import { Flame, Scale, Target } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

const points = [
  { icon: Flame, text: "Obsession over age" },
  { icon: Target, text: "Five years deep" },
  { icon: Scale, text: "Standards over shortcuts" },
];

export function Perspective() {
  return (
    <section className="section-pad mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        className="border-y border-[var(--border)] py-14 sm:py-16"
      >
        <motion.p
          className="eyebrow mb-5 inline-flex items-center gap-2"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={spring}
        >
          <Scale className="size-3.5" strokeWidth={1.5} />
          The Perspective Shift
        </motion.p>
        <motion.h2
          className="font-display text-4xl font-medium tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.08 }}
        >
          Why an 18-year-old?
        </motion.h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.text}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[var(--border)] px-4 py-5 text-center"
              >
                <motion.span
                  className="mx-auto flex size-9 items-center justify-center rounded-full border border-[var(--border)]"
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={spring}
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                </motion.span>
                <p className="mt-3 text-xs tracking-wide text-[var(--fg-muted)]">
                  {p.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="mt-8 text-lg font-light leading-[1.85] text-[var(--fg-muted)] sm:text-xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.2 }}
        >
          Why hire an 18-year-old? History has always been shaped by those who
          didn&apos;t wait for permission. At 18, Alexander the Great commanded
          the Companion Cavalry at the Battle of Chaeronea, proving that
          strategic genius is forged by obsession, not age. Web development is
          no different. I bring five years of deep, dedicated engineering
          experience to the table—enough to make any seasoned professional
          proud, but most importantly, to honor the standard of hard work set by
          my father. Let me take your raw vision, shape it with premium design,
          and bring it to life.
        </motion.p>
      </motion.div>
    </section>
  );
}

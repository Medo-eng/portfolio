"use client";

import { motion } from "framer-motion";
import { Flame, Scale, Target } from "lucide-react";
import { easeOut } from "@/lib/motion";

const points = [
  { icon: Flame, text: "Obsession over age" },
  { icon: Target, text: "Five years deep" },
  { icon: Scale, text: "Standards over shortcuts" },
];

export function Perspective() {
  return (
    <section id="perspective" className="section-pad mx-auto max-w-3xl">
      <div className="border-y border-[var(--border)] py-14 sm:py-16">
        <p className="eyebrow mb-5 inline-flex items-center gap-2">
          <Scale className="size-3.5" strokeWidth={1.5} />
          The Perspective Shift
        </p>
        <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Why an 18-year-old?
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.text}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.35, ease: easeOut, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-[var(--border)] px-4 py-5 text-center"
              >
                <span className="mx-auto flex size-9 items-center justify-center rounded-full border border-[var(--border)]">
                  <Icon className="size-4" strokeWidth={1.5} />
                </span>
                <p className="mt-3 text-xs tracking-wide text-[var(--fg-muted)]">
                  {p.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-lg font-light leading-[1.85] text-[var(--fg-muted)] sm:text-xl">
          Why hire an 18-year-old? History has always been shaped by those who
          didn&apos;t wait for permission. At 18, Alexander the Great commanded
          the Companion Cavalry at the Battle of Chaeronea, proving that
          strategic genius is forged by obsession, not age. Web development is
          no different. I bring five years of deep, dedicated engineering
          experience to the table—enough to make any seasoned professional
          proud, but most importantly, to honor the standard of hard work set by
          my father. Let me take your raw vision, shape it with premium design,
          and bring it to life.
        </p>
      </div>
    </section>
  );
}

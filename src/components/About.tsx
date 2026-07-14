"use client";

import { motion } from "framer-motion";
import { Brush, Code2, Lightbulb, User } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

const traits = [
  { icon: Brush, label: "Design-first" },
  { icon: Code2, label: "Self-taught engineer" },
  { icon: Lightbulb, label: "Business-minded" },
];

export function About() {
  return (
    <section id="about" className="section-pad mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
      >
        <motion.p
          className="eyebrow mb-5 inline-flex items-center gap-2"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={spring}
        >
          <User className="size-3.5" strokeWidth={1.5} />
          Who Am I
        </motion.p>
        <motion.h2
          className="font-display text-4xl font-medium tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.08 }}
        >
          The story behind the build
        </motion.h2>
        <motion.div
          className="mt-6 h-px w-16 origin-left bg-[var(--fg)]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {traits.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.span
                key={t.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -3, scale: 1.04 }}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 text-xs tracking-wide text-[var(--fg-muted)]"
              >
                <Icon className="size-3.5" strokeWidth={1.5} />
                {t.label}
              </motion.span>
            );
          })}
        </div>

        <motion.p
          className="mt-8 text-lg font-light leading-[1.85] text-[var(--fg-muted)] sm:text-xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.18 }}
        >
          Hi, I&apos;m Mohamed Naser—your next web developer. My journey
          hasn&apos;t been a straight line, but the obstacles I&apos;ve faced
          have only refined my drive. Born and raised in America, I fell in
          love with creative expression early on, whether through graphic
          design, fine drawing, or visual art. That passion shifted into
          digital engineering when I discovered web design and development at
          just 13 years old. Five years of relentless self-taught
          problem-solving later, I don&apos;t just build websites; I understand
          the mechanics of running a business, driving traffic, and building
          digital trust.
        </motion.p>
      </motion.div>
    </section>
  );
}

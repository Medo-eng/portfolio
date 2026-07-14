"use client";

import { motion } from "framer-motion";
import { Brush, Code2, Lightbulb, User } from "lucide-react";
import { easeOut } from "@/lib/motion";

const traits = [
  { icon: Brush, label: "Design-first" },
  { icon: Code2, label: "Self-taught engineer" },
  { icon: Lightbulb, label: "Business-minded" },
];

export function About() {
  return (
    <section id="about" className="section-pad mx-auto max-w-3xl">
      <p className="eyebrow mb-5 inline-flex items-center gap-2">
        <User className="size-3.5" strokeWidth={1.5} />
        Who Am I
      </p>
      <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
        The story behind the build
      </h2>
      <motion.div
        className="mt-6 h-px w-16 origin-left bg-[var(--fg)]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.5, ease: easeOut, delay: 0.08 }}
      />

      <div className="mt-8 flex flex-wrap gap-3">
        {traits.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.span
              key={t.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.35, ease: easeOut, delay: 0.05 + i * 0.05 }}
              whileHover={{ y: -2 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 text-xs tracking-wide text-[var(--fg-muted)]"
            >
              <Icon className="size-3.5" strokeWidth={1.5} />
              {t.label}
            </motion.span>
          );
        })}
      </div>

      <p className="mt-8 text-lg font-light leading-[1.85] text-[var(--fg-muted)] sm:text-xl">
        Hi, I&apos;m Mohamed Naser—your next web developer. My journey hasn&apos;t
        been a straight line, but the obstacles I&apos;ve faced have only refined
        my drive. Born and raised in America, I fell in love with creative
        expression early on, whether through graphic design, fine drawing, or
        visual art. That passion shifted into digital engineering when I
        discovered web design and development at just 13 years old. Five years of
        relentless self-taught problem-solving later, I don&apos;t just build
        websites; I understand the mechanics of running a business, driving
        traffic, and building digital trust.
      </p>
    </section>
  );
}

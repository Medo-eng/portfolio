"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

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
        <motion.p
          className="mt-8 text-lg font-light leading-[1.85] text-[var(--fg-muted)] sm:text-xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.16 }}
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

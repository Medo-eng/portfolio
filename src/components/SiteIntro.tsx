"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { easeOut } from "@/lib/motion";

type SiteIntroProps = {
  onComplete: () => void;
};

export function SiteIntro({ onComplete }: SiteIntroProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const leaveAt = window.setTimeout(() => setLeaving(true), 1400);
    const doneAt = window.setTimeout(() => {
      document.body.style.overflow = prev;
      onComplete();
    }, 1950);

    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(leaveAt);
      window.clearTimeout(doneAt);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[var(--bg)]"
      initial={{ opacity: 1 }}
      animate={
        leaving
          ? { opacity: 0, y: -24, transition: { duration: 0.5, ease: easeOut } }
          : { opacity: 1, y: 0 }
      }
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: leaving ? 0 : 1 }}
        transition={{ duration: 0.55, ease: easeOut }}
        style={{
          originY: 0,
          background:
            "linear-gradient(180deg, var(--fg) 0%, var(--fg) 100%)",
          opacity: 0.04,
        }}
      />

      <div className="relative z-10 px-6 text-center">
        <motion.p
          className="text-[10px] tracking-[0.35em] uppercase text-[var(--fg-muted)]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: easeOut, delay: 0.08 }}
        >
          Welcome
        </motion.p>

        <motion.div
          className="font-display mt-5 overflow-hidden text-5xl font-medium tracking-tight text-[var(--fg)] sm:text-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, ease: easeOut, delay: 0.2 }}
          >
            Mohamed <span className="italic font-normal">Naser</span>
          </motion.span>
        </motion.div>

        <motion.div
          className="mx-auto mt-6 h-px bg-[var(--fg)]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.55 }}
          style={{ width: "3.5rem", originX: 0.5 }}
        />

        <motion.p
          className="mt-5 text-[11px] tracking-[0.28em] uppercase text-[var(--fg-muted)]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: leaving ? 0 : 1, y: leaving ? -6 : 0 }}
          transition={{ duration: 0.35, ease: easeOut, delay: 0.7 }}
        >
          Crafting digital systems
        </motion.p>
      </div>

      {/* Bottom curtain wipe */}
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-[var(--fg)]"
        initial={{ height: "0%" }}
        animate={
          leaving
            ? { height: "100%", transition: { duration: 0.5, ease: easeOut } }
            : { height: "0%" }
        }
      />
    </motion.div>
  );
}

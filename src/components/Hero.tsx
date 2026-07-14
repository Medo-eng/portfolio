"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef, type MouseEvent } from "react";

const springCfg = { stiffness: 160, damping: 24, mass: 0.55 };
const bounce = { type: "spring" as const, stiffness: 380, damping: 30 };

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);

  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const solidX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const solidY = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const outlineX = useTransform(sx, [-0.5, 0.5], [-32, 32]);
  const outlineY = useTransform(sy, [-0.5, 0.5], [-22, 22]);

  function onMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-[var(--border)]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        aria-hidden
      />

      <div className="section-pad relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...bounce, delay: 0.1 }}
          className="eyebrow mb-10"
        >
          Web Developer
        </motion.p>

        <motion.div
          className="relative w-full"
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1200,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            className="outline-name absolute inset-0 flex flex-col items-center justify-center text-[clamp(3.5rem,14vw,9.5rem)]"
            style={{ x: outlineX, y: outlineY }}
            aria-hidden
          >
            <span className="block">Mohamed</span>
            <span className="block">Naser</span>
          </motion.div>

          <motion.h1
            className="font-display relative z-10 text-[clamp(3.5rem,14vw,9.5rem)] font-medium leading-[0.9] tracking-[-0.02em] text-[var(--fg)]"
            style={{ x: solidX, y: solidY }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ ...bounce, delay: 0.18 }}
            >
              Mohamed
            </motion.span>
            <motion.span
              className="block italic font-normal"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ ...bounce, delay: 0.3 }}
            >
              Naser
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...bounce, delay: 0.42 }}
          className="mt-10 max-w-md text-base font-light leading-relaxed text-[var(--fg-muted)] sm:text-lg"
        >
          Crafting High-Converting Digital Systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...bounce, delay: 0.52 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={bounce}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-8 py-3.5 text-xs font-medium tracking-[0.14em] uppercase text-[var(--bg)]"
          >
            Start a Project
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </motion.span>
          </motion.a>
          <motion.a
            href="#portfolio"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={bounce}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-8 py-3.5 text-xs font-medium tracking-[0.14em] uppercase text-[var(--fg)] hover:border-[var(--fg)]"
          >
            <Sparkles className="size-3.5" strokeWidth={1.5} />
            View Work
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

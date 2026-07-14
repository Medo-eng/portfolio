"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Code2,
  PenTool,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRef, type MouseEvent } from "react";

const springCfg = { stiffness: 160, damping: 24, mass: 0.55 };
const bounce = { type: "spring" as const, stiffness: 380, damping: 30 };

const floatIcons = [
  { Icon: Code2, className: "left-[8%] top-[28%]", delay: 0 },
  { Icon: PenTool, className: "right-[10%] top-[32%]", delay: 0.2 },
  { Icon: Zap, className: "left-[14%] bottom-[22%]", delay: 0.35 },
  { Icon: Sparkles, className: "right-[12%] bottom-[26%]", delay: 0.5 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);

  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const solidX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const solidY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const outlineX = useTransform(sx, [-0.5, 0.5], [-38, 38]);
  const outlineY = useTransform(sy, [-0.5, 0.5], [-26, 26]);

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
      {floatIcons.map(({ Icon, className, delay }) => (
        <motion.div
          key={className}
          className={`pointer-events-none absolute hidden text-[var(--fg)]/15 sm:block ${className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { delay: delay + 0.6, duration: 0.6 },
            y: {
              delay: delay + 0.8,
              duration: 4 + delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          aria-hidden
        >
          <Icon className="size-7" strokeWidth={1.25} />
        </motion.div>
      ))}

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
          className="eyebrow mb-10 inline-flex items-center gap-2"
        >
          <Sparkles className="size-3.5" strokeWidth={1.5} />
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

        <motion.a
          href="#about"
          className="mt-16 flex flex-col items-center gap-2 text-[var(--fg-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-4" strokeWidth={1.5} />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}

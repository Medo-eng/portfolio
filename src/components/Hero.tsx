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
import { easeOut } from "@/lib/motion";
import { triggerSectionIntro } from "./SectionShell";

const springCfg = { stiffness: 180, damping: 26, mass: 0.5 };

const floatIcons = [
  { Icon: Code2, className: "left-[8%] top-[28%]", delay: 0 },
  { Icon: PenTool, className: "right-[10%] top-[32%]", delay: 0.08 },
  { Icon: Zap, className: "left-[14%] bottom-[22%]", delay: 0.14 },
  { Icon: Sparkles, className: "right-[12%] bottom-[26%]", delay: 0.2 },
];

export function Hero({ ready = true }: { ready?: boolean }) {
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
          initial={{ opacity: 0 }}
          animate={
            ready
              ? { opacity: 1, y: [0, -8, 0] }
              : { opacity: 0 }
          }
          transition={{
            opacity: { delay: delay + 0.15, duration: 0.4, ease: easeOut },
            y: {
              delay: delay + 0.3,
              duration: 3.6,
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
        animate={ready ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
        aria-hidden
      />

      <div className="section-pad relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: easeOut, delay: 0.05 }}
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
              className="block overflow-hidden"
              initial={{ opacity: 0, y: 28 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.08 }}
            >
              Mohamed
            </motion.span>
            <motion.span
              className="block overflow-hidden italic font-normal"
              initial={{ opacity: 0, y: 28 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.16 }}
            >
              Naser
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.4, ease: easeOut, delay: 0.24 }}
          className="mt-10 max-w-md text-base font-light leading-relaxed text-[var(--fg-muted)] sm:text-lg"
        >
          Crafting High-Converting Digital Systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: easeOut, delay: 0.32 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              window.setTimeout(() => triggerSectionIntro("contact"), 280);
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: easeOut }}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-8 py-3.5 text-xs font-medium tracking-[0.14em] uppercase text-[var(--bg)]"
          >
            Start a Project
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </motion.span>
          </motion.a>
          <motion.a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("portfolio")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              window.setTimeout(() => triggerSectionIntro("portfolio"), 280);
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: easeOut }}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-8 py-3.5 text-xs font-medium tracking-[0.14em] uppercase text-[var(--fg)] hover:border-[var(--fg)]"
          >
            <Sparkles className="size-3.5" strokeWidth={1.5} />
            View Work
          </motion.a>
        </motion.div>

        <motion.a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("about")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            window.setTimeout(() => triggerSectionIntro("about"), 280);
          }}
          className="mt-16 flex flex-col items-center gap-2 text-[var(--fg-muted)]"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.35, ease: easeOut }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-4" strokeWidth={1.5} />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}

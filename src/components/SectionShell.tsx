"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { easeOut } from "@/lib/motion";

type SectionShellProps = {
  id: string;
  title: string;
  enabled?: boolean;
  quiet?: boolean;
  children: ReactNode;
};

type IntroPhase = "off" | "hold" | "exit";

/**
 * Same structure as the main site intro:
 * blank aesthetic screen → section title → wipe away → real section.
 */
export function SectionShell({
  id,
  title,
  enabled = true,
  quiet = false,
  children,
}: SectionShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.32, margin: "-12% 0px -12% 0px" });
  const wasInView = useRef(false);
  const suppressScroll = useRef(false);
  const runId = useRef(0);
  const timers = useRef<number[]>([]);

  const [phase, setPhase] = useState<IntroPhase>("off");
  const [contentKey, setContentKey] = useState(0);
  // Content stays hidden until this section's blank intro finishes (hero is quiet)
  const [showContent, setShowContent] = useState(quiet);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const playIntro = useCallback(
    (fromNav = false) => {
      if (quiet || !enabled) return;

      if (fromNav) {
        suppressScroll.current = true;
        timers.current.push(
          window.setTimeout(() => {
            suppressScroll.current = false;
          }, 1800),
        );
      }

      clearTimers();
      const myRun = ++runId.current;

      setShowContent(false);
      setPhase("hold");
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Hold on blank + title
      timers.current.push(
        window.setTimeout(() => {
          if (runId.current !== myRun) return;
          setPhase("exit");
        }, 1050),
      );

      // Finish wipe → reveal section
      timers.current.push(
        window.setTimeout(() => {
          if (runId.current !== myRun) return;
          setPhase("off");
          setContentKey((k) => k + 1);
          setShowContent(true);
          document.body.style.overflow = prevOverflow || "";
        }, 1550),
      );
    },
    [enabled, quiet],
  );

  useEffect(() => {
    return () => {
      clearTimers();
      document.body.style.overflow = "";
    };
  }, []);

  // Scroll into section
  useEffect(() => {
    if (!enabled || quiet) return;
    if (inView && !wasInView.current && !suppressScroll.current) {
      playIntro(false);
    }
    wasInView.current = inView;
  }, [inView, enabled, quiet, playIntro]);

  // Nav click
  useEffect(() => {
    function onNav(e: Event) {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail?.id !== id) return;
      playIntro(true);
    }
    window.addEventListener("mn-section-intro", onNav as EventListener);
    return () =>
      window.removeEventListener("mn-section-intro", onNav as EventListener);
  }, [id, playIntro]);

  const active = phase !== "off";

  return (
    <div ref={ref} data-section={id} className="relative">
      <AnimatePresence>
        {active ? (
          <motion.div
            key={`section-intro-${id}-${runId.current}`}
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[var(--bg)]"
            initial={{ opacity: 1 }}
            animate={
              phase === "exit"
                ? {
                    opacity: 0,
                    y: -20,
                    transition: { duration: 0.45, ease: easeOut },
                  }
                : { opacity: 1, y: 0 }
            }
            exit={{ opacity: 0, transition: { duration: 0.25, ease: easeOut } }}
            aria-hidden
          >
            {/* Soft aesthetic wash — same language as site intro */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: easeOut }}
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 40%, var(--accent-soft), transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(128,128,128,0.5) 0.6px, transparent 0.6px)",
                backgroundSize: "3px 3px",
              }}
            />

            <div className="relative z-10 px-6 text-center">
              <motion.p
                className="text-[10px] tracking-[0.35em] uppercase text-[var(--fg-muted)]"
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === "exit"
                    ? { opacity: 0, y: -6 }
                    : { opacity: 1, y: 0 }
                }
                transition={{ duration: 0.3, ease: easeOut, delay: 0.05 }}
              >
                Entering
              </motion.p>

              <div className="font-display mt-5 overflow-hidden text-5xl font-medium tracking-tight text-[var(--fg)] sm:text-7xl">
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={phase === "exit" ? { y: "-110%" } : { y: "0%" }}
                  transition={{ duration: 0.5, ease: easeOut, delay: 0.08 }}
                >
                  {title}
                </motion.span>
              </div>

              <motion.div
                className="mx-auto mt-6 h-px bg-[var(--fg)]"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  phase === "exit"
                    ? { scaleX: 0, opacity: 0 }
                    : { scaleX: 1, opacity: 1 }
                }
                transition={{ duration: 0.4, ease: easeOut, delay: 0.28 }}
                style={{ width: "3.5rem", originX: 0.5 }}
              />
            </div>

            {/* Curtain wipe — same as site intro */}
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-[var(--fg)]"
              initial={{ height: "0%" }}
              animate={
                phase === "exit"
                  ? {
                      height: "100%",
                      transition: { duration: 0.48, ease: easeOut },
                    }
                  : { height: "0%" }
              }
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        key={`section-body-${id}-${contentKey}`}
        initial={{ opacity: 0, y: 28 }}
        animate={
          showContent && phase === "off"
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{ duration: 0.45, ease: easeOut }}
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function triggerSectionIntro(sectionId: string) {
  window.dispatchEvent(
    new CustomEvent("mn-section-intro", { detail: { id: sectionId } }),
  );
}

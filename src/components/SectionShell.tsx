"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { sectionVariants, sectionViewport } from "@/lib/motion";

type SectionShellProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function SectionShell({ id, children, className }: SectionShellProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function onNav(e: Event) {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail?.id !== id) return;
      setTick((t) => t + 1);
    }
    window.addEventListener("mn-section-intro", onNav as EventListener);
    return () =>
      window.removeEventListener("mn-section-intro", onNav as EventListener);
  }, [id]);

  return (
    <motion.div
      key={`${id}-${tick}`}
      data-section={id}
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

export function triggerSectionIntro(sectionId: string) {
  window.dispatchEvent(
    new CustomEvent("mn-section-intro", { detail: { id: sectionId } }),
  );
}

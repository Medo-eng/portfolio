"use client";

import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { Perspective } from "@/components/Perspective";
import { Portfolio } from "@/components/Portfolio";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionShell } from "@/components/SectionShell";
import { Services } from "@/components/Services";
import { SiteIntro } from "@/components/SiteIntro";
import { easeOut } from "@/lib/motion";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  return (
    <>
      {!introDone ? <SiteIntro onComplete={finishIntro} /> : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <ScrollProgress />
        <Navigation ready={introDone} />
        <main>
          <SectionShell id="home">
            <Hero ready={introDone} />
          </SectionShell>
          <SectionShell id="about">
            <About />
          </SectionShell>
          <SectionShell id="perspective">
            <Perspective />
          </SectionShell>
          <SectionShell id="services">
            <Services />
          </SectionShell>
          <SectionShell id="portfolio">
            <Portfolio />
          </SectionShell>
          <SectionShell id="contact">
            <Contact />
          </SectionShell>
        </main>
        <motion.footer
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="border-t border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--fg-muted)]"
        >
          <p className="font-display text-2xl font-medium italic text-[var(--fg)]">
            Mohamed Naser
          </p>
          <p className="mt-2 font-light tracking-wide">
            © {new Date().getFullYear()} · Crafting High-Converting Digital
            Systems
          </p>
        </motion.footer>
      </motion.div>
    </>
  );
}

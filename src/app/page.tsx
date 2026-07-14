"use client";

import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { OrderHelper } from "@/components/OrderHelper";
import { OrderHelperProvider } from "@/components/OrderHelperProvider";
import { Perspective } from "@/components/Perspective";
import { Portfolio } from "@/components/Portfolio";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Services } from "@/components/Services";
import { SiteIntro } from "@/components/SiteIntro";
import { easeOut } from "@/lib/motion";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  return (
    <OrderHelperProvider>
      {!introDone ? <SiteIntro onComplete={finishIntro} /> : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <ScrollProgress />
        <Navigation ready={introDone} />
        <main>
          <Hero ready={introDone} />
          <About />
          <Perspective />
          <Services />
          <Portfolio />
          <Contact />
        </main>
        <footer className="border-t border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--fg-muted)]">
          <p className="font-display text-2xl font-medium italic text-[var(--fg)]">
            Mohamed Naser
          </p>
          <p className="mt-2 font-light tracking-wide">
            © {new Date().getFullYear()} · Crafting High-Converting Digital
            Systems
          </p>
        </footer>
        <OrderHelper ready={introDone} />
      </motion.div>
    </OrderHelperProvider>
  );
}

"use client";

import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { Perspective } from "@/components/Perspective";
import { Portfolio } from "@/components/Portfolio";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Services } from "@/components/Services";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Perspective />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--fg-muted)]"
      >
        <motion.p
          className="font-display text-2xl font-medium italic text-[var(--fg)]"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        >
          Mohamed Naser
        </motion.p>
        <p className="mt-2 font-light tracking-wide">
          © {new Date().getFullYear()} · Crafting High-Converting Digital
          Systems
        </p>
      </motion.footer>
    </>
  );
}

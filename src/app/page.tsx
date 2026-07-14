import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { Perspective } from "@/components/Perspective";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
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
    </>
  );
}

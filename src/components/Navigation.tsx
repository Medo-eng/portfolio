"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  FolderKanban,
  Home,
  Mail,
  Moon,
  Sun,
} from "lucide-react";
import { easeOut } from "@/lib/motion";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "#home", id: "home", label: "Home", icon: Home },
  { href: "#services", id: "services", label: "Services", icon: Briefcase },
  { href: "#portfolio", id: "portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "#contact", id: "contact", label: "Contact", icon: Mail },
];

function goToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function Navigation({ ready = true }: { ready?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -28, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : { y: -28, opacity: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className="fixed top-5 left-1/2 z-50 w-[min(94vw,660px)] -translate-x-1/2"
      aria-label="Primary"
    >
      <div className="flex items-center justify-between gap-2 rounded-full border border-[var(--border)] bg-[var(--nav-bg)] px-3 py-2 pl-5 shadow-[var(--shadow)] backdrop-blur-xl">
        <motion.a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goToSection("home");
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.25, ease: easeOut }}
          className="focus-ring font-display shrink-0 text-lg font-medium tracking-tight italic"
        >
          MN
        </motion.a>

        <ul className="flex flex-1 items-center justify-center gap-0.5 sm:gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    goToSection(link.id);
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.2, ease: easeOut }}
                  className="focus-ring flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[11px] font-medium tracking-[0.08em] uppercase text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] sm:px-3"
                >
                  <Icon className="hidden size-3 sm:block" strokeWidth={1.5} />
                  <span>{link.label}</span>
                </motion.a>
              </li>
            );
          })}
        </ul>

        <motion.button
          type="button"
          aria-label="Toggle theme"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.2, ease: easeOut }}
          onClick={toggleTheme}
          className="focus-ring flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)]"
        >
          {theme === "dark" ? (
            <Sun className="size-3.5" strokeWidth={1.5} />
          ) : (
            <Moon className="size-3.5" strokeWidth={1.5} />
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}

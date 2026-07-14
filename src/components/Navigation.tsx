"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  FolderKanban,
  Home,
  MessageCircle,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#services", label: "Services", icon: Briefcase },
  { href: "#portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "#contact", label: "Contact", icon: MessageCircle },
];

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

export function Navigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
      className="fixed top-5 left-1/2 z-50 w-[min(94vw,660px)] -translate-x-1/2"
      aria-label="Primary"
    >
      <div className="flex items-center justify-between gap-2 rounded-full border border-[var(--border)] bg-[var(--nav-bg)] px-3 py-2 pl-5 shadow-[var(--shadow)] backdrop-blur-xl">
        <a
          href="#home"
          className="focus-ring font-display shrink-0 text-lg font-medium tracking-tight italic"
        >
          MN
        </a>

        <ul className="flex flex-1 items-center justify-center gap-0.5 sm:gap-1">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.08 + i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
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
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={spring}
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

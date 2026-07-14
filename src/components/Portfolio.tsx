"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  ExternalLink,
  Home,
  LayoutTemplate,
  Search,
  Sparkles,
  SprayCan,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState, type ComponentType } from "react";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

type Project = {
  id: string;
  title: string;
  blurb: string;
  url: string;
  image: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

const introProjects: Project[] = [
  {
    id: "luxeshine",
    title: "LuxeShine Co.",
    blurb:
      "Premium home-care brand site with polished product storytelling and conversion-focused design.",
    url: "https://luxeshine-co.vercel.app/",
    image: "/luxeshine.png",
    icon: SprayCan,
  },
  {
    id: "apexseo",
    title: "ApexSEO Portal",
    blurb:
      "SEO operations portal built for clarity, speed, and high-signal dashboards.",
    url: "https://apexseo-portal-2xlazb95w-medo-engs-projects.vercel.app/",
    image: "/apexseo.png",
    icon: Search,
  },
  {
    id: "ascent",
    title: "Ascent",
    blurb:
      "Modular desk organizer product site with clean layout and refined product presentation.",
    url: "https://ascent-ten-phi.vercel.app/",
    image: "/ascent.png",
    icon: Boxes,
  },
];

const otherProjects: Project[] = [
  {
    id: "apex-roofing",
    title: "Apex Roofing",
    blurb:
      "High-converting roofing landing page for local lead capture, trust, and mobile-first speed.",
    url: "https://apex-roofing-git-v0-medo-eng-133956ad-medo-engs-projects.vercel.app/",
    image: "/apex roofing.png",
    icon: Home,
  },
];

export function Portfolio() {
  const [active, setActive] = useState<Project | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section id="portfolio" className="section-pad mx-auto max-w-7xl">
      <div className="mb-14 max-w-2xl">
        <p className="eyebrow mb-5 inline-flex items-center gap-2">
          <LayoutTemplate className="size-3.5" strokeWidth={1.5} />
          Portfolio Showcase
        </p>
        <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Live work, ready to explore
        </h2>
        <div
          className="mt-5 h-px origin-left bg-[var(--fg)]"
          style={{ width: "4.5rem" }}
        />
      </div>

      {/* Project: Intro */}
      <div className="mb-16">
        <CategoryHeader
          icon={Sparkles}
          label="Project: Intro"
          subtitle="Flagship demos from recent builds"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {introProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              featured
              onOpen={() => setActive(project)}
            />
          ))}
        </div>
      </div>

      {/* Other Projects */}
      <div>
        <CategoryHeader
          icon={Boxes}
          label="Other Projects"
          subtitle="Additional live deployments"
        />
        <div className="mt-8 grid max-w-2xl gap-5">
          {otherProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              featured
              onOpen={() => setActive(project)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
          >
            <motion.button
              type="button"
              aria-label="Close dialog"
              className="absolute inset-0 bg-white/80 backdrop-blur-sm dark:bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={spring}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]"
            >
              {active.image ? (
                <div className="relative h-40 overflow-hidden border-b border-[var(--border)]">
                  <Image
                    src={encodeURI(active.image)}
                    alt={active.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              ) : null}
              <div className="p-7 sm:p-8">
                <motion.button
                  type="button"
                  onClick={() => setActive(null)}
                  whileHover={{ rotate: 90, scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  transition={spring}
                  className="focus-ring absolute right-4 top-4 rounded-full border border-[var(--border)] bg-[var(--bg)]/80 p-2 text-[var(--fg-muted)] backdrop-blur hover:text-[var(--fg)]"
                  aria-label="Close"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </motion.button>
                <h3
                  id={titleId}
                  className="font-display pr-10 text-3xl font-medium"
                >
                  {active.title}
                </h3>
                <p
                  id={descId}
                  className="mt-5 text-sm font-light leading-relaxed text-[var(--fg-muted)]"
                >
                  You are now visiting a live, interactive production deployment
                  of this project hosted on Vercel. Feel free to click around
                  and test its speed!
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <motion.a
                    href={active.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3.5 text-xs font-medium tracking-[0.12em] uppercase text-[var(--bg)]"
                    onClick={() => setActive(null)}
                  >
                    Proceed to Live Demo
                    <ExternalLink className="size-3" strokeWidth={1.5} />
                  </motion.a>
                  <motion.button
                    type="button"
                    onClick={() => setActive(null)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3.5 text-xs font-medium tracking-[0.12em] uppercase"
                  >
                    Stay Here
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function CategoryHeader({
  icon: Icon,
  label,
  subtitle,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={spring}
      className="flex items-end justify-between gap-4 border-b border-[var(--border)] pb-4"
    >
      <div>
        <p className="eyebrow inline-flex items-center gap-2">
          <Icon className="size-3.5" strokeWidth={1.5} />
          {label}
        </p>
        <p className="mt-2 text-sm font-light text-[var(--fg-muted)]">
          {subtitle}
        </p>
      </div>
      <motion.span
        className="hidden size-2 rounded-full bg-[var(--fg)] sm:block"
        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  onOpen: () => void;
}) {
  const Icon = project.icon;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...spring, delay: index * 0.08 }}
      whileHover={{ y: -10, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={onOpen}
      className="focus-ring group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-transparent text-left"
    >
      {project.image ? (
        <div className="relative h-48 overflow-hidden border-b border-[var(--border)]">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <Image
              src={encodeURI(project.image)}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent opacity-80" />
          <motion.span
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur"
            whileHover={{ rotate: 45 }}
            transition={spring}
          >
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </motion.span>
        </div>
      ) : (
        <div className="flex h-36 items-end justify-between border-b border-[var(--border)] bg-[var(--bg-muted)]/40 p-6">
          <motion.span
            className="flex size-11 items-center justify-center rounded-full border border-[var(--border)]"
            whileHover={{ rotate: -10, scale: 1.08 }}
            transition={spring}
          >
            <Icon className="size-4" strokeWidth={1.5} />
          </motion.span>
          <ArrowUpRight
            className="size-4 text-[var(--fg-muted)] transition group-hover:text-[var(--fg)]"
            strokeWidth={1.5}
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-[var(--fg-muted)]" strokeWidth={1.5} />
          <span className="eyebrow text-[10px]">Live Demo</span>
        </div>
        <h3 className="font-display mt-3 text-2xl font-medium sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-[var(--fg-muted)]">
          {project.blurb}
        </p>
        <motion.span
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.12em] uppercase text-[var(--fg)]"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Open live demo
          <ExternalLink className="size-3" strokeWidth={1.5} />
        </motion.span>
      </div>
    </motion.button>
  );
}

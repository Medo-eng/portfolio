"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  Layers,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

const packages: {
  name: string;
  price: string;
  ideal: string;
  delivery: string;
  featured: boolean;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  benefits: string[];
}[] = [
  {
    name: "Starter Landing Page",
    price: "$150",
    ideal: "Local service providers, contractors, and startups.",
    delivery: "3-5 Days",
    featured: false,
    icon: Zap,
    benefits: [
      "1 Ultra-Fast Custom Landing Page",
      "Full Mobile/Responsive Optimization",
      "On-Page SEO Foundations",
      "Vercel Deployment & Domain Mapping",
    ],
  },
  {
    name: "Growth Engine Portfolio",
    price: "$250",
    ideal: "Independent creators, agencies, and high-ticket service businesses.",
    delivery: "7-10 Days",
    featured: true,
    icon: Rocket,
    benefits: [
      "Up to 3 Fully Designed Dynamic Pages",
      "Modern Framer Motion Animations & Hover States",
      "Integrated Interactive Contact Form / Lead Capture",
      "Automated Email Notification Setup",
    ],
  },
  {
    name: "Ultimate Digital Showcase",
    price: "$350",
    ideal:
      "Established brands looking to completely dominate their competitors online.",
    delivery: "14-21 Days",
    featured: false,
    icon: Layers,
    benefits: [
      "Complete Custom Multi-page Website (Up to 7 Pages)",
      "Custom UI/UX Design System Built in Cursor",
      "High-converting custom interactions & interactive tools",
      "30 Days of Priority Post-Launch Support & Iterations",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="section-pad mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <p className="eyebrow mb-5 inline-flex items-center justify-center gap-2">
          <Sparkles className="size-3.5" strokeWidth={1.5} />
          Services & Packages
        </p>
        <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Built for conversion, priced for momentum
        </h2>
        <motion.div
          className="mx-auto mt-5 h-px w-16 origin-center bg-[var(--fg)]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {packages.map((pkg, i) => {
          const Icon = pkg.icon;
          return (
            <motion.article
              key={pkg.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...spring, delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.015 }}
              className={`flex flex-col rounded-2xl border bg-transparent p-7 ${
                pkg.featured
                  ? "border-[var(--fg)]"
                  : "border-[var(--border)]"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">
                <motion.span
                  className="flex size-10 items-center justify-center rounded-full border border-[var(--border)]"
                  whileHover={{ rotate: -12, scale: 1.1 }}
                  transition={spring}
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                </motion.span>
                {pkg.featured ? (
                  <motion.span
                    className="eyebrow text-[var(--fg)]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  >
                    Most Popular
                  </motion.span>
                ) : null}
              </div>
              <h3 className="font-display text-2xl font-medium">{pkg.name}</h3>
              <motion.p
                className="font-display mt-4 text-5xl font-light tracking-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.15 + i * 0.08 }}
              >
                {pkg.price}
              </motion.p>
              <p className="mt-4 text-sm font-light leading-relaxed text-[var(--fg-muted)]">
                Ideal for: {pkg.ideal}
              </p>
              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {pkg.benefits.map((b, bi) => (
                  <motion.li
                    key={b}
                    className="flex gap-2.5 text-sm font-light leading-snug"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...spring, delay: 0.2 + bi * 0.05 }}
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-[var(--fg)]"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-2 text-xs tracking-wide text-[var(--fg-muted)]">
                <Clock className="size-3.5" strokeWidth={1.5} aria-hidden />
                <span>Delivery: {pkg.delivery}</span>
              </div>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className={`focus-ring mt-6 flex items-center justify-center gap-2 rounded-full py-3.5 text-center text-xs font-medium tracking-[0.14em] uppercase ${
                  pkg.featured
                    ? "bg-[var(--fg)] text-[var(--bg)]"
                    : "border border-[var(--border)] text-[var(--fg)]"
                }`}
              >
                Get Started
                <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </motion.a>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

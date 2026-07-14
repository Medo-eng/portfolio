"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Check,
  ChevronRight,
  FolderKanban,
  Mail,
  MessageCircle,
  MousePointerClick,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useId, useState, type ReactNode } from "react";
import { easeOut } from "@/lib/motion";
import { useOrderHelper } from "./OrderHelperProvider";

const PACKAGES = [
  {
    id: "starter",
    label: "The Starter Landing Page package!",
    value: "Starter Landing Page",
    price: "$150",
  },
  {
    id: "growth",
    label: "The Growth Engine Portfolio package!",
    value: "Growth Engine Portfolio",
    price: "$250",
  },
  {
    id: "ultimate",
    label: "The Ultimate Digital Showcase!",
    value: "Ultimate Digital Showcase",
    price: "$350",
  },
] as const;

type Step =
  | "closed"
  | "package"
  | "name"
  | "demos"
  | "demos-return"
  | "about"
  | "email"
  | "done";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function HelperFace({ size = "md" }: { size?: "md" | "lg" }) {
  const dim = size === "lg" ? "size-14" : "size-12";
  const eye = size === "lg" ? "size-3" : "size-2.5";
  const pupil = size === "lg" ? "size-1.5" : "size-1";

  return (
    <div
      className={`relative ${dim} overflow-hidden rounded-full border-2 border-[var(--fg)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute top-[34%] left-[22%] flex gap-[28%]">
        <span className={`relative block ${eye} rounded-full bg-[var(--fg)]`}>
          <span
            className={`helper-blink absolute inset-0 rounded-full bg-[var(--bg-elevated)]`}
          />
          <span
            className={`absolute top-[18%] left-[18%] ${pupil} rounded-full bg-[var(--bg)]`}
          />
        </span>
        <span className={`relative block ${eye} rounded-full bg-[var(--fg)]`}>
          <span
            className={`helper-blink absolute inset-0 rounded-full bg-[var(--bg-elevated)]`}
          />
          <span
            className={`absolute top-[18%] left-[18%] ${pupil} rounded-full bg-[var(--bg)]`}
          />
        </span>
      </div>
      <div className="absolute bottom-[22%] left-1/2 h-2 w-3.5 -translate-x-1/2 rounded-b-full border-2 border-t-0 border-[var(--fg)]" />
    </div>
  );
}

function CloudBubble({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.94 }}
      transition={{ duration: 0.4, ease: easeOut }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="focus-ring relative z-10 max-w-[12.5rem] rounded-[1.4rem] border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-left text-[11px] leading-snug font-medium text-[var(--fg)] shadow-[var(--shadow)]"
    >
      {/* Thought/speech trail toward the mouth */}
      <span className="pointer-events-none absolute -bottom-2 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]" />
      <span className="pointer-events-none absolute bottom-[-1.15rem] left-[52%] size-1.5 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]" />
      {children}
    </motion.button>
  );
}

export function OrderHelper({ ready = true }: { ready?: boolean }) {
  const {
    draft,
    setDraft,
    setShowSendTip,
    setHelperCompleted,
    helperCompleted,
  } = useOrderHelper();
  const [step, setStep] = useState<Step>("closed");
  const [resumeStep, setResumeStep] = useState<Step>("package");
  const [textValue, setTextValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const panelId = useId();

  function openHelper() {
    setError(null);
    if (helperCompleted) {
      setStep("done");
      return;
    }
    setStep(resumeStep === "closed" ? "package" : resumeStep);
  }

  function closePanel() {
    setStep((current) => {
      if (current !== "closed") {
        setResumeStep(current === "done" ? "done" : current);
      }
      return "closed";
    });
    setError(null);
  }

  function pickPackage(value: string) {
    setDraft({ packageName: value });
    setStep("name");
    setTextValue(draft.name);
  }

  function submitName(e: FormEvent) {
    e.preventDefault();
    const name = textValue.trim();
    if (name.length < 2) {
      setError("Please enter your name.");
      return;
    }
    setDraft({ name });
    setError(null);
    setTextValue("");
    setStep("demos");
  }

  function answerDemos(seen: boolean) {
    if (!seen) {
      setResumeStep("demos-return");
      setStep("closed");
      window.setTimeout(() => scrollToId("portfolio"), 120);
      return;
    }
    setTextValue("");
    setError(null);
    setStep("about");
  }

  function submitAbout(e: FormEvent) {
    e.preventDefault();
    const about = textValue.trim();
    if (about.length < 5) {
      setError("Tell me a little more — a few words is enough.");
      return;
    }
    const packageLine = draft.packageName
      ? `Package interest: ${draft.packageName}\n\n`
      : "";
    setDraft({ message: `${packageLine}${about}` });
    setError(null);
    setTextValue(draft.email);
    setStep("email");
  }

  function submitEmail(e: FormEvent) {
    e.preventDefault();
    const email = textValue.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please double-check that email address.");
      return;
    }
    setDraft({ email });
    setError(null);
    setTextValue("");
    setHelperCompleted(true);
    setShowSendTip(true);
    setStep("done");
    window.setTimeout(() => scrollToId("contact"), 280);
  }

  const open = step !== "closed";

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!ready) return null;

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="helper-overlay"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="fixed inset-0 z-[75] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={closePanel}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label="Order helper"
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.35, ease: easeOut }}
                onClick={(e) => e.stopPropagation()}
                className="w-[min(92vw,26rem)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    <HelperFace size="md" />
                    <div>
                      <p className="font-display text-base font-medium italic leading-tight sm:text-lg">
                        Order helper
                      </p>
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--fg-muted)]">
                        Highly recommended
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Close helper"
                    onClick={closePanel}
                    className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  >
                    <X className="size-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="max-h-[min(70vh,32rem)] space-y-4 overflow-y-auto p-4 sm:p-5">
                  {step === "package" ? (
                    <>
                      <Question
                        icon={
                          <Briefcase className="size-3.5" strokeWidth={1.5} />
                        }
                        text="What package do you wanna start with? If you're not sure, check out the Services tab (the nav bar is at the top)."
                      />
                      <div className="space-y-2">
                        {PACKAGES.map((pkg, i) => (
                          <motion.button
                            key={pkg.id}
                            type="button"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: easeOut,
                              delay: 0.05 * i,
                            }}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => pickPackage(pkg.value)}
                            className="focus-ring flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-3 py-3 text-left text-sm font-medium hover:border-[var(--fg)]/40 hover:bg-[var(--accent-soft)]"
                          >
                            <span>{pkg.label}</span>
                            <span className="shrink-0 text-xs text-[var(--fg-muted)]">
                              {pkg.price}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {step === "name" ? (
                    <>
                      <Question
                        icon={<User className="size-3.5" strokeWidth={1.5} />}
                        text="Let's get to know each other! What's your name?"
                      />
                      <TextStep
                        value={textValue}
                        onChange={setTextValue}
                        onSubmit={submitName}
                        placeholder="Your name"
                        error={error}
                        buttonLabel="Continue"
                      />
                    </>
                  ) : null}

                  {step === "demos" || step === "demos-return" ? (
                    <>
                      <Question
                        icon={
                          <FolderKanban
                            className="size-3.5"
                            strokeWidth={1.5}
                          />
                        }
                        text={
                          step === "demos-return"
                            ? "Welcome back! Have you checked out the demos, or want to keep going?"
                            : "Have you seen my demo websites? If not, press No — it will automatically take you to the Portfolio tab where you can press on any website, then Proceed to live demo. You can click around! (Remember, I made it!)"
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <ChoiceButton
                          onClick={() => answerDemos(true)}
                          label="Yes"
                          icon={
                            <Check className="size-3.5" strokeWidth={1.75} />
                          }
                        />
                        <ChoiceButton
                          onClick={() => answerDemos(false)}
                          label="No"
                          icon={
                            <FolderKanban
                              className="size-3.5"
                              strokeWidth={1.5}
                            />
                          }
                        />
                      </div>
                      {step === "demos-return" ? (
                        <button
                          type="button"
                          onClick={() => answerDemos(true)}
                          className="focus-ring w-full rounded-xl border border-[var(--fg)] bg-[var(--fg)] px-3 py-2.5 text-xs font-medium tracking-[0.1em] uppercase text-[var(--bg)]"
                        >
                          Continue to next question
                        </button>
                      ) : null}
                    </>
                  ) : null}

                  {step === "about" ? (
                    <>
                      <Question
                        icon={
                          <MessageCircle
                            className="size-3.5"
                            strokeWidth={1.5}
                          />
                        }
                        text="Can you give me a brief about your business and how you want your website to look? Don't stress — we can talk more about it later!"
                      />
                      <TextStep
                        value={textValue}
                        onChange={setTextValue}
                        onSubmit={submitAbout}
                        placeholder="A quick brief…"
                        error={error}
                        buttonLabel="Continue"
                        multiline
                      />
                    </>
                  ) : null}

                  {step === "email" ? (
                    <>
                      <Question
                        icon={<Mail className="size-3.5" strokeWidth={1.5} />}
                        text="Can I have an email address that I can contact you on? Please double-check the email address as this will be the one I use to reach you!"
                      />
                      <TextStep
                        value={textValue}
                        onChange={setTextValue}
                        onSubmit={submitEmail}
                        placeholder="you@email.com"
                        error={error}
                        buttonLabel="Finish & go to form"
                        type="email"
                      />
                    </>
                  ) : null}

                  {step === "done" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: easeOut }}
                      className="space-y-3"
                    >
                      <div className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-3">
                        <Sparkles
                          className="mt-0.5 size-4 shrink-0 text-[var(--fg)]"
                          strokeWidth={1.5}
                        />
                        <p className="text-sm leading-relaxed">
                          Nice! Your details are filled into the contact form.
                          Hit{" "}
                          <span className="font-semibold">Send Message</span>{" "}
                          when you&apos;re ready — no redirects.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          scrollToId("contact");
                          setShowSendTip(true);
                          closePanel();
                        }}
                        className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-4 py-2.5 text-xs font-medium tracking-[0.12em] uppercase text-[var(--bg)]"
                      >
                        Jump to contact form
                        <ChevronRight
                          className="size-3.5"
                          strokeWidth={1.75}
                        />
                      </button>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        <div className="pointer-events-auto flex items-end gap-3">
          <AnimatePresence>
            {!open ? (
              <motion.button
                type="button"
                onClick={openHelper}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.4, ease: easeOut, delay: 0.15 }}
                className="focus-ring mb-2 flex flex-col items-end gap-1"
                aria-label="Click the helper"
              >
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fg)]/30 bg-[var(--fg)] px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--bg)] shadow-[var(--shadow)]"
                >
                  <MousePointerClick className="size-3" strokeWidth={2} />
                  Click here
                  <span aria-hidden className="text-xs leading-none">
                    →
                  </span>
                </motion.span>
              </motion.button>
            ) : null}
          </AnimatePresence>

          <div className="flex flex-col items-center">
            <AnimatePresence>
              {!open ? (
                <div className="mb-3 flex flex-col items-center">
                  <CloudBubble onClick={openHelper}>
                    <span className="mb-1 block text-[9px] font-semibold tracking-[0.16em] uppercase text-[var(--fg-muted)]">
                      Highly recommended
                    </span>
                    Let me help you with your order!
                  </CloudBubble>
                </div>
              ) : null}
            </AnimatePresence>

            <motion.button
              type="button"
              aria-expanded={open}
              aria-controls={open ? panelId : undefined}
              aria-label="Open order helper"
              onClick={() => (open ? closePanel() : openHelper())}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: open ? 0 : [0, -5, 0],
              }}
              transition={
                open
                  ? { duration: 0.3, ease: easeOut }
                  : {
                      opacity: { duration: 0.45, ease: easeOut },
                      scale: { duration: 0.45, ease: easeOut },
                      y: {
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
              }
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="focus-ring relative"
            >
              {!open && !helperCompleted ? (
                <span className="absolute -top-1 -right-1 size-3 rounded-full bg-[var(--fg)] ring-2 ring-[var(--bg)]">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[var(--fg)] opacity-60" />
                </span>
              ) : null}
              <HelperFace size="lg" />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}

function Question({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="space-y-2"
    >
      <p className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.16em] uppercase text-[var(--fg-muted)]">
        {icon}
        Helper
      </p>
      <p className="font-display text-[15px] leading-snug font-medium text-[var(--fg)]">
        {text}
      </p>
    </motion.div>
  );
}

function ChoiceButton({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-3 text-sm font-medium hover:border-[var(--fg)]/40 hover:bg-[var(--accent-soft)]"
    >
      {icon}
      {label}
    </motion.button>
  );
}

function TextStep({
  value,
  onChange,
  onSubmit,
  placeholder,
  error,
  buttonLabel,
  multiline = false,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  placeholder: string;
  error: string | null;
  buttonLabel: string;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-2.5">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="focus-ring w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="focus-ring w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm outline-none"
        />
      )}
      {error ? (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="focus-ring inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--fg)] px-4 py-2.5 text-xs font-medium tracking-[0.12em] uppercase text-[var(--bg)]"
      >
        {buttonLabel}
        <ChevronRight className="size-3.5" strokeWidth={1.75} />
      </button>
    </form>
  );
}

/** Smooth, quick motion — avoid heavy springs that feel choppy. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const quick = {
  duration: 0.5,
  ease: easeOut,
};

export const sectionViewport = {
  once: false,
  amount: 0.22,
  margin: "0px 0px -8% 0px",
} as const;

export const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 36,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOut,
      when: "beforeChildren" as const,
      staggerChildren: 0.06,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

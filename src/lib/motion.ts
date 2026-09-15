/**
 * Shared Framer Motion spring configurations following Apple HIG principles.
 */
export const springs = {
  // Apple's equivalent to .smooth (general transitions, no bounce)
  default: {
    type: 'spring' as const,
    bounce: 0,
    duration: 0.3, // Reduced from Apple's 0.5s for snappier web feel
  },

  // Slide-in drawers and large panels
  drawer: {
    type: 'spring' as const,
    bounce: 0.08,
    duration: 0.35,
  },

  // Apple's equivalent to .snappy (quick interactive feedback)
  card: {
    type: 'spring' as const,
    bounce: 0.2,
    duration: 0.35,
  },

  // Quick button presses
  press: {
    type: 'spring' as const,
    bounce: 0.15,
    duration: 0.2, // Fast feedback
  },

  // Page transitions
  page: {
    type: 'spring' as const,
    bounce: 0,
    duration: 0.2,
  },

  // Apple's equivalent to .bouncy (toasts/alerts drawing attention)
  toast: {
    type: 'spring' as const,
    bounce: 0.3,
    duration: 0.5,
  },
};

/**
 * Standard page transition animation variants
 */
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

/**
 * Standard card animation variants for staggered lists
 */
export const cardVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

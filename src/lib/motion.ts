// Shared motion tokens for Ekko
// Subtle, fast, useful, restrained — institution-grade.

export const motionDurations = {
  hover: 0.12,           // 120ms — hover/focus transitions
  chip: 0.16,            // 160ms — chip and selected state changes
  tab: 0.18,             // 180ms — tab/content section transitions
  modal: 0.2,            // 200ms — modal/drawer entrance
  panel: 0.2,            // 200ms — panel expand/collapse
  tour: 0.16,            // 160ms — spotlight tooltip transitions
  toast: 0.2,            // 200ms — toast in/out
} as const;

export const motionEasings = {
  out: [0.16, 1, 0.3, 1] as const,           // gentle ease-out
  inOut: [0.4, 0, 0.2, 1] as const,          // ease-in-out — Material standard
  spring: [0.34, 1.56, 0.64, 1] as const,    // restrained "spring" — small overshoot
} as const;

// Common variants for Framer Motion components
export const fadeSlideUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: motionDurations.modal, ease: motionEasings.out },
};

export const fadeOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: motionDurations.tab, ease: motionEasings.out },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: motionDurations.modal, ease: motionEasings.out },
};

export const slideRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: motionDurations.modal, ease: motionEasings.out },
};

export const collapseHeight = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: motionDurations.panel, ease: motionEasings.inOut },
};

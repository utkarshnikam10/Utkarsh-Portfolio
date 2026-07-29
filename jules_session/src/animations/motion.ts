export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const panelTransition = {
  duration: 0.72,
  ease: EASE_OUT_EXPO,
};

export const panelVariants = {
  initial: { opacity: 0, y: 28, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 18, scale: 0.99 },
};

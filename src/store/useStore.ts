import { create } from "zustand";

/**
 * PROJECT NEXUS v2 // SIMPLIFIED STORE
 * Only tracks UI state: theme, nav, active section
 */

interface StoreState {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;

  navOpen: boolean;
  setNavOpen: (open: boolean) => void;

  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

  navOpen: false,
  setNavOpen: (open) => set({ navOpen: open }),

  activeSection: "hero",
  setActiveSection: (section) => set({ activeSection: section }),
}));

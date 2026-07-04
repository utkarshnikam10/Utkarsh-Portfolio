"use client";

import React, { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * PROJECT NEXUS // GLOBAL PROVIDERS
 * Responsibility: Mounts client-side runtime providers (e.g. Framer Motion configuration, themes, etc.).
 * Ensures smooth DOM animations and coordinate systems are established.
 */

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MotionConfig transition={{ type: "spring", stiffness: 100, damping: 15 }}>
      {children}
    </MotionConfig>
  );
}
export default Providers;

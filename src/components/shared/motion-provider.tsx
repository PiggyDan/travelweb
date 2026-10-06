"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Honour the user's OS-level reduced-motion preference for every animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

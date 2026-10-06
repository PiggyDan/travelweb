"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating (for gentle staggering). */
  delay?: number;
  as?: "div" | "li" | "article" | "section";
}

const elements: Record<NonNullable<RevealProps["as"]>, ElementType> = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  section: motion.section,
};

/**
 * Fades content up once as it scrolls into view. Under
 * prefers-reduced-motion the global MotionConfig drops the movement.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = elements[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

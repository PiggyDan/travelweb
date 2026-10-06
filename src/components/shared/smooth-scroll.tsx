"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Inertial smooth scrolling on desktop pointers, which makes the scroll-driven
 * hero and parallax feel like film rather than steps. Touch devices keep their
 * native scrolling, and reduced-motion users are left alone entirely.
 */
export function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!desktop || reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      anchors: { offset: -96 },
      // Let modals and inner scroll areas scroll natively.
      prevent: (node) => Boolean(node.closest("dialog, [data-lenis-prevent]")),
    });

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}

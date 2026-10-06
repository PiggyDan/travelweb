"use client";

import { useEffect, useRef } from "react";

interface PollOptions {
  /** Pause polling entirely (default true). */
  enabled?: boolean;
  /** Also run once as soon as polling starts (default false). */
  immediate?: boolean;
}

/**
 * Calls `callback` every `intervalMs` while enabled and the tab is visible,
 * and once immediately whenever the tab becomes visible again. The latest
 * callback is always used, so it can close over fresh state.
 */
export function usePoll(
  callback: () => void | Promise<void>,
  intervalMs: number,
  { enabled = true, immediate = false }: PollOptions = {},
) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  });

  useEffect(() => {
    if (!enabled) return;
    let timer: number | undefined;
    const tick = () => void saved.current();
    const start = () => {
      window.clearInterval(timer);
      if (document.visibilityState === "visible") timer = window.setInterval(tick, intervalMs);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") tick();
      start();
    };
    if (immediate) tick();
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, enabled, immediate]);
}

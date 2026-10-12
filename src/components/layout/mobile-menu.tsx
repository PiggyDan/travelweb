"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { LocaleLink } from "@/components/shared/locale-link";
import { buttonClasses } from "@/components/ui/button";
import type { NavItem } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import { LanguageSelector } from "./language-selector";
import { Logo } from "./logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  primary: readonly NavItem[];
  secondary: readonly NavItem[];
  isActive: (href: string) => boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Full-screen navigation sheet for small screens, with focus trapping. */
export function MobileMenu({ open, onClose, primary, secondary, isActive }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusFirst = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 50);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusFirst);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-sky-950 text-felt-50 xl:hidden"
        >
          <div className="flex h-20 shrink-0 items-center justify-between px-5 sm:px-8">
            <Logo onClick={onClose} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10"
            >
              <X aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col px-5 pt-6 pb-10 sm:px-8">
            <ul className="space-y-1">
              {primary.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LocaleLink
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex min-h-14 items-center justify-between border-b border-white/10 font-display text-3xl font-light aria-[current=page]:text-copper-300"
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden className="size-5 opacity-50" strokeWidth={1.25} />
                  </LocaleLink>
                </motion.li>
              ))}
            </ul>

            <ul className="mt-8 grid grid-cols-2 gap-x-4">
              {secondary.map((item) => (
                <li key={item.href}>
                  <LocaleLink
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-11 items-center text-sm text-sky-100 hover:text-white"
                  >
                    {item.label}
                  </LocaleLink>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-6 pt-10">
              <LocaleLink href={routes.tripPlanner} onClick={onClose} className={buttonClasses("light", "lg", "w-full")}>
                Plan your trip
              </LocaleLink>
              <div className="flex items-center justify-between text-sm text-sky-200">
                <a href={`mailto:${siteConfig.contact.email}`} className="underline-offset-4 hover:underline">
                  {siteConfig.contact.email}
                </a>
                <LanguageSelector placement="top" />
              </div>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

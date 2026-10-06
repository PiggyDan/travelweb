"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "@/components/shared/locale-link";
import { LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  /** Visual tone of the trigger. */
  tone?: "light" | "dark";
  /** Where the menu opens relative to the trigger. */
  placement?: "bottom" | "top";
  className?: string;
}

/**
 * Disclosure-style language menu. Only enabled locales are selectable;
 * others are listed as "coming soon" so visitors know they are planned.
 */
export function LanguageSelector({ tone = "light", placement = "bottom", className }: LanguageSelectorProps) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Language: ${LANGUAGES.find((l) => l.code === locale)?.label ?? "English"}. Change language`}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tracking-[0.16em] uppercase transition-colors",
          tone === "light" ? "text-current hover:bg-white/10" : "text-sky-950 hover:bg-sky-950/5",
        )}
      >
        <Globe aria-hidden className="size-4" strokeWidth={1.5} />
        {locale}
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={menuId}
          className={cn(
            "absolute right-0 z-50 w-56 overflow-hidden rounded-2xl border border-sand-200 bg-felt-50 p-1.5 text-charcoal-900 shadow-xl shadow-sky-950/15",
            placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          )}
        >
          <ul>
            {LANGUAGES.map((language) => {
              const active = language.code === locale;
              return (
                <li key={language.code}>
                  {language.enabled ? (
                    <a
                      href={`/${language.code}`}
                      lang={language.code}
                      aria-current={active ? "true" : undefined}
                      className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm hover:bg-sand-100"
                    >
                      <span>
                        {language.nativeLabel}
                        <span className="sr-only"> ({language.label})</span>
                      </span>
                      {active && <Check aria-hidden className="size-4 text-copper-600" />}
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      lang={language.code}
                      className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm text-charcoal-500"
                    >
                      <span>
                        {language.nativeLabel}
                        <span className="sr-only"> ({language.label})</span>
                      </span>
                      <span className="text-[0.625rem] font-semibold tracking-[0.12em] uppercase">Soon</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

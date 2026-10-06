"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LocaleLink, useLocale } from "@/components/shared/locale-link";
import { localizePath } from "@/lib/i18n";
import { routes } from "@/lib/routes";

const SUGGESTIONS = [
  { label: "Gobi Desert", href: routes.destination("gobi-desert") },
  { label: "Eagle hunters", href: routes.tour("altai-eagle-hunters-journey") },
  { label: "Naadam festival", href: routes.festivals },
  { label: "Private tours", href: routes.toursByType("private") },
];

/**
 * Site search, built on the native <dialog> element for focus trapping and
 * Escape handling. Searches tours via the /tours?q= filter.
 */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    const path = trimmed ? `${routes.tours}?q=${encodeURIComponent(trimmed)}` : routes.tours;
    onClose();
    router.push(localizePath(locale, path));
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="search-title"
      className="m-0 h-auto max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-sky-950/70 backdrop:backdrop-blur-sm"
    >
      <div className="bg-felt-100 px-5 pt-6 pb-10 shadow-2xl sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 id="search-title" className="eyebrow text-copper-600">
              Search journeys
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="inline-flex size-11 items-center justify-center rounded-full text-sky-950 hover:bg-sky-950/5"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} role="search" className="mt-4 flex items-center gap-3 border-b border-sky-950/30 pb-3">
            <Search aria-hidden className="size-6 shrink-0 text-charcoal-500" strokeWidth={1.5} />
            <label htmlFor="site-search" className="sr-only">
              Search tours and destinations
            </label>
            <input
              id="site-search"
              type="search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Gobi, horses, eagle hunters…"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl text-sky-950 placeholder:text-charcoal-400 focus:outline-none sm:text-3xl"
            />
            <button
              type="submit"
              aria-label="Search"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-sky-950 text-white hover:bg-sky-800 dark:bg-felt-100 dark:text-sky-950 dark:hover:bg-white"
            >
              <ArrowRight aria-hidden className="size-5" />
            </button>
          </form>
          <p className="eyebrow mt-8 text-charcoal-500">Popular</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion.href}>
                <LocaleLink
                  href={suggestion.href}
                  onClick={onClose}
                  className="inline-flex min-h-11 items-center rounded-full border border-sand-300 px-4 text-sm text-charcoal-700 hover:border-sky-950 hover:text-sky-950"
                >
                  {suggestion.label}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}

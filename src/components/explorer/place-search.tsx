"use client";

import { Building2, Flag, Landmark, LoaderCircle, MapPin, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { countryName } from "@/lib/explorer/format";
import type { ExplorerMessages } from "@/lib/explorer/messages";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";
import type { CountryInfo, GeoSearchResponse, Place, PlaceKind } from "@/types/explorer";

/**
 * Search box (ARIA combobox). Countries match instantly from the local list;
 * cities and places come from `/api/geo/search` after a short pause in typing.
 */

const DEBOUNCE_MS = 300;
const MAX_COUNTRIES = 4;
const KIND_ICONS: Record<PlaceKind, typeof MapPin> = { country: Flag, region: Landmark, city: Building2, place: MapPin };

export type SearchSelection = { type: "country"; iso2: string } | { type: "place"; place: Place };

interface PlaceSearchProps {
  inputRef?: RefObject<HTMLInputElement | null>;
  countries: CountryInfo[] | null;
  locale: Locale;
  messages: ExplorerMessages;
  /** Set while the traveller is replacing a stop: changes the placeholder. */
  replacing: string | null;
  onSelect(selection: SearchSelection): void;
  onCancelReplace(): void;
  onFocusInput?(): void;
}

interface Option {
  key: string;
  selection: SearchSelection;
  title: string;
  subtitle: string | null;
  kind: PlaceKind;
  flag?: string;
}

type RemoteState =
  | { status: "idle" }
  | { status: "loading"; query: string }
  | { status: "done"; query: string; results: Place[]; attribution: string }
  | { status: "error"; query: string };

const remoteCache = new Map<string, GeoSearchResponse>();

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export function PlaceSearch({
  inputRef,
  countries,
  locale,
  messages,
  replacing,
  onSelect,
  onCancelReplace,
  onFocusInput,
}: PlaceSearchProps) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [remote, setRemote] = useState<RemoteState>({ status: "idle" });
  const blurTimer = useRef<number | undefined>(undefined);

  const trimmed = query.trim();

  // Countries: match English name, localized name, ISO codes and alternative spellings.
  const countryOptions = useMemo<Option[]>(() => {
    const q = normalize(trimmed);
    if (!countries || q.length < 2) return [];
    const scored: { country: CountryInfo; label: string; score: number }[] = [];
    for (const country of countries) {
      const label = countryName(country.iso2, country.name, locale);
      const names = [label, country.name, country.official].map(normalize);
      let score = -1;
      if (names.some((n) => n === q) || q === country.iso2.toLowerCase() || q === country.iso3.toLowerCase()) score = 3;
      else if (names.some((n) => n.startsWith(q))) score = 2;
      else if (country.altNames.some((n) => normalize(n).startsWith(q))) score = 1;
      else if (q.length >= 4 && names.some((n) => n.includes(q))) score = 0;
      if (score >= 0) scored.push({ country, label, score });
    }
    return scored
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, locale))
      .slice(0, MAX_COUNTRIES)
      .map(({ country, label }) => ({
        key: `country:${country.iso2}`,
        selection: { type: "country", iso2: country.iso2 },
        title: label,
        subtitle: country.subregion ?? country.region,
        kind: "country",
        flag: country.flag,
      }));
  }, [countries, trimmed, locale]);

  // Places: debounced remote search, cached per query for this page view.
  useEffect(() => {
    if (trimmed.length < 2) return;
    const cacheKey = `${locale}:${normalize(trimmed)}`;
    const cached = remoteCache.get(cacheKey);
    const controller = new AbortController();
    const timer = window.setTimeout(
      async () => {
        if (cached) {
          setRemote({ status: "done", query: trimmed, ...cached });
          return;
        }
        setRemote({ status: "loading", query: trimmed });
        try {
          const params = new URLSearchParams({ q: trimmed, lang: locale });
          const response = await fetch(`/api/geo/search?${params}`, { signal: controller.signal });
          if (!response.ok) throw new Error(String(response.status));
          const data = (await response.json()) as GeoSearchResponse;
          remoteCache.set(cacheKey, data);
          setRemote({ status: "done", query: trimmed, ...data });
        } catch (error) {
          if ((error as Error).name !== "AbortError") setRemote({ status: "error", query: trimmed });
        }
      },
      cached ? 0 : DEBOUNCE_MS,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, locale]);

  const placeOptions = useMemo<Option[]>(() => {
    if (remote.status !== "done" || remote.query !== trimmed) return [];
    const countryCodes = new Set(countryOptions.map((o) => (o.selection.type === "country" ? o.selection.iso2 : "")));
    return remote.results.flatMap((place): Option[] => {
      // A country result from the geocoder is shown once, as our richer country entry.
      if (place.kind === "country" && place.countryCode) {
        if (countryCodes.has(place.countryCode)) return [];
        return [
          {
            key: `country:${place.countryCode}`,
            selection: { type: "country", iso2: place.countryCode },
            title: place.name,
            subtitle: null,
            kind: "country",
          },
        ];
      }
      return [{ key: place.id, selection: { type: "place", place }, title: place.name, subtitle: place.context, kind: place.kind }];
    });
  }, [remote, trimmed, countryOptions]);

  const options = useMemo(() => [...countryOptions, ...placeOptions], [countryOptions, placeOptions]);
  const showList = open && trimmed.length >= 2;
  const loading = trimmed.length >= 2 && (remote.status !== "done" || remote.query !== trimmed) && remote.status !== "error";
  const failed = remote.status === "error" && remote.query === trimmed;
  const activeIndex = Math.min(active, Math.max(0, options.length - 1));

  function choose(option: Option) {
    onSelect(option.selection);
    setQuery("");
    setOpen(false);
    setActive(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (options.length === 0) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + delta + options.length) % options.length);
    } else if (event.key === "Enter") {
      const option = options[activeIndex];
      if (showList && option) {
        event.preventDefault();
        choose(option);
      }
    } else if (event.key === "Escape") {
      if (showList) setOpen(false);
      else if (query) setQuery("");
      else if (replacing) onCancelReplace();
    }
  }

  const optionId = (index: number) => `${listId}-option-${index}`;
  const attribution = remote.status === "done" ? remote.attribution : null;

  return (
    <div className="relative">
      <label htmlFor={`${listId}-input`} className="sr-only">
        {messages.search.label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl bg-felt-50 px-4 shadow-sm ring-1 transition-shadow focus-within:ring-2",
          replacing ? "ring-copper-500 focus-within:ring-copper-500" : "ring-sand-200 focus-within:ring-sky-500",
        )}
      >
        <Search aria-hidden className="size-5 shrink-0 text-charcoal-500" strokeWidth={1.75} />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${listId}-list`}
          aria-autocomplete="list"
          aria-activedescendant={showList && options.length > 0 ? optionId(activeIndex) : undefined}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          value={query}
          placeholder={replacing ? messages.search.placeholderReplace(replacing) : messages.search.placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => {
            window.clearTimeout(blurTimer.current);
            setOpen(true);
            onFocusInput?.();
          }}
          onBlur={() => {
            // Let a click on an option land before the list closes.
            blurTimer.current = window.setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={handleKeyDown}
          className="min-h-13 w-full min-w-0 bg-transparent text-[0.9375rem] text-sky-950 placeholder:text-charcoal-500 focus:outline-none"
        />
        {loading && <LoaderCircle aria-hidden className="size-4 shrink-0 animate-spin text-charcoal-500" />}
        {(query || replacing) && (
          <button
            type="button"
            onClick={() => {
              if (query) setQuery("");
              else onCancelReplace();
            }}
            aria-label={query ? messages.search.clear : messages.search.cancelReplace}
            className="-mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-charcoal-600 hover:bg-sky-950/5"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-felt-50 shadow-xl ring-1 shadow-sky-950/15 ring-sand-200",
          !showList && "hidden",
        )}
      >
        <ul id={`${listId}-list`} role="listbox" aria-label={messages.search.label} className="max-h-80 overflow-y-auto py-1.5" data-lenis-prevent>
          {options.map((option, index) => {
            const Icon = KIND_ICONS[option.kind];
            const firstPlace = index === countryOptions.length && countryOptions.length > 0;
            return (
              <li
                key={option.key}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
                onMouseMove={() => index !== activeIndex && setActive(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-4 py-2.5",
                  index === activeIndex && "bg-sky-950/5",
                  firstPlace && "mt-1.5 border-t border-sand-200 pt-3",
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-felt-200 text-base">
                  {option.flag ?? <Icon aria-hidden className="size-4 text-charcoal-600" strokeWidth={1.75} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-sky-950">{option.title}</span>
                  <span className="block truncate text-xs text-charcoal-500">
                    {messages.search.kinds[option.kind]}
                    {option.subtitle ? ` · ${option.subtitle}` : ""}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-sand-200 px-4 py-2 text-xs text-charcoal-500" aria-live="polite">
          {failed
            ? messages.search.error
            : loading
              ? messages.search.searching
              : options.length === 0
                ? messages.search.noResults
                : attribution && <span>{attribution}</span>}
        </div>
      </div>
    </div>
  );
}

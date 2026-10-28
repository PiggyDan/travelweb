"use client";

import { ArrowRight, LoaderCircle, MapPin, Plus, Star, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LocaleLink } from "@/components/shared/locale-link";
import { countryName, formatArea } from "@/lib/explorer/format";
import type { ExplorerMessages } from "@/lib/explorer/messages";
import { routes } from "@/lib/routes";
import type { Locale } from "@/types/common";
import type { CountryInfo, FeaturedDestination } from "@/types/explorer";

const linkClasses =
  "inline-flex min-h-10 items-center gap-2 rounded-full bg-sky-950/5 px-4 text-xs font-semibold text-sky-950 transition-colors hover:bg-sky-950/10";

function CloseButton({ label, onClick }: { label: string; onClick(): void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="-mt-1 -mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-charcoal-600 hover:bg-sky-950/5"
    >
      <X aria-hidden className="size-4" />
    </button>
  );
}

interface CountryPanelProps {
  country: CountryInfo;
  locale: Locale;
  messages: ExplorerMessages;
  canAddStop: boolean;
  /** Geocodes the capital and adds it as a stop. Resolves false when it can't be found. */
  onAddCapital(capital: string): Promise<boolean>;
  onClose(): void;
}

export function CountryPanel({ country, locale, messages, canAddStop, onAddCapital, onClose }: CountryPanelProps) {
  const [pending, setPending] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const m = messages.country;
  const name = countryName(country.iso2, country.name, locale);
  const isMongolia = country.iso2 === "MN";

  const facts: [string, string][] = [
    [m.capital, country.capitals.join(", ") || "—"],
    [m.region, [country.subregion, country.region].filter(Boolean).join(", ")],
    [
      m.currency,
      country.currencies.map((c) => `${c.name} (${c.code}${c.symbol ? ` ${c.symbol}` : ""})`).join(", ") || "—",
    ],
    [m.languages, country.languages.join(", ") || "—"],
    [m.callingCode, country.callingCodes.join(", ") || "—"],
    [m.area, country.areaKm2 ? formatArea(country.areaKm2, locale) : "—"],
    [m.landlocked, country.landlocked ? m.yes : m.no],
  ];

  async function addCapital(capital: string) {
    setPending(capital);
    setNotFound(false);
    const found = await onAddCapital(capital);
    setPending(null);
    setNotFound(!found);
  }

  return (
    <section aria-labelledby="country-panel-heading" className="rounded-2xl bg-felt-50 p-5 ring-1 ring-sand-200">
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none" aria-hidden>
          {country.flag}
        </span>
        <div className="min-w-0 flex-1">
          {isMongolia && (
            <p className="eyebrow mb-1 flex items-center gap-1 text-copper-600">
              <Star aria-hidden className="size-3 fill-current" />
              {m.mongoliaFeatured}
            </p>
          )}
          <h2 id="country-panel-heading" className="font-display text-2xl leading-tight text-sky-950">
            {name}
          </h2>
          {country.official !== country.name && <p className="mt-0.5 text-xs text-charcoal-500">{country.official}</p>}
        </div>
        <CloseButton label={m.close} onClick={onClose} />
      </div>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {facts.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-charcoal-500">{label}</dt>
            <dd className="text-sky-950">{value}</dd>
          </div>
        ))}
      </dl>

      {canAddStop && country.capitals.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {country.capitals.slice(0, 2).map((capital) => (
            <button key={capital} type="button" onClick={() => addCapital(capital)} disabled={pending !== null} className={linkClasses}>
              {pending === capital ? (
                <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
              ) : (
                <Plus aria-hidden className="size-3.5" />
              )}
              {m.addCapital(capital)}
            </button>
          ))}
        </div>
      )}
      {notFound && (
        <p role="status" className="mt-2 text-xs text-copper-700">
          {m.capitalNotFound}
        </p>
      )}

      {isMongolia && (
        <div className="mt-4 flex flex-wrap gap-2">
          <LocaleLink href={routes.tours} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-copper-600 px-4 text-xs font-semibold text-white hover:bg-copper-700">
            {m.mongoliaCta}
            <ArrowRight aria-hidden className="size-3.5" />
          </LocaleLink>
          <LocaleLink href={routes.destinations} className={linkClasses}>
            {m.mongoliaDestinations}
          </LocaleLink>
        </div>
      )}

      <p className="mt-4 text-[0.6875rem] leading-relaxed text-charcoal-500">{m.source}</p>
    </section>
  );
}

interface FeaturedPanelProps {
  destination: FeaturedDestination;
  messages: ExplorerMessages;
  canAddStop: boolean;
  onAdd(): void;
  onClose(): void;
}

export function FeaturedPanel({ destination, messages, canAddStop, onAdd, onClose }: FeaturedPanelProps) {
  return (
    <section aria-labelledby="featured-panel-heading" className="overflow-hidden rounded-2xl bg-felt-50 ring-1 ring-sand-200">
      <div className="relative aspect-[16/9]">
        <Image src={destination.image.src} alt={destination.image.alt} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-copper-600">{destination.region}</p>
            <h2 id="featured-panel-heading" className="mt-1 font-display text-2xl leading-tight text-sky-950">
              {destination.name}
            </h2>
          </div>
          <CloseButton label={messages.country.close} onClick={onClose} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{destination.tagline}</p>
        {destination.approximate && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal-500">
            <MapPin aria-hidden className="size-3.5" />
            {messages.featured.approximate}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <LocaleLink
            href={routes.destination(destination.slug)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-copper-600 px-4 text-xs font-semibold text-white hover:bg-copper-700"
          >
            {messages.featured.view}
            <ArrowRight aria-hidden className="size-3.5" />
          </LocaleLink>
          {canAddStop && (
            <button type="button" onClick={onAdd} className={linkClasses}>
              <Plus aria-hidden className="size-3.5" />
              {messages.featured.addToRoute}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

interface FeaturedListProps {
  featured: FeaturedDestination[];
  messages: ExplorerMessages;
  onSelect(slug: string): void;
}

/** Mongolia highlights, shown while the planner is empty. */
export function FeaturedList({ featured, messages, onSelect }: FeaturedListProps) {
  if (featured.length === 0) return null;
  return (
    <section aria-labelledby="featured-list-heading">
      <h2 id="featured-list-heading" className="eyebrow text-copper-600">
        {messages.featured.heading}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-charcoal-500">{messages.featured.body}</p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {featured.map((destination) => (
          <li key={destination.slug}>
            <button
              type="button"
              onClick={() => onSelect(destination.slug)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl text-left"
            >
              <Image
                src={destination.image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 190px, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-sky-950/20 to-transparent" />
              <span className="absolute inset-x-2.5 bottom-2 text-sm leading-tight font-semibold text-white">{destination.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

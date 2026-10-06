/**
 * Shared domain primitives.
 *
 * These mirror the shapes the future FastAPI backend is expected to return,
 * so services can swap the mock source for REST calls without touching UI.
 */

/** Every locale the URL architecture supports. Only some are enabled — see `lib/i18n.ts`. */
export type Locale = "en" | "mn" | "ko" | "ja" | "zh" | "ru";

export interface Language {
  code: Locale;
  /** English name, e.g. "Korean". */
  label: string;
  /** Name in the language itself, e.g. "한국어". */
  nativeLabel: string;
  /** Whether the site content is published in this language yet. */
  enabled: boolean;
}

export type CurrencyCode = "USD";

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface ImageCredit {
  author: string;
  license: string;
  sourceUrl: string;
}

export interface ImageAsset {
  /** Path under /public or a remote URL allowed in next.config. */
  src: string;
  /** Descriptive alternative text. Required for every meaningful image. */
  alt: string;
  width: number;
  height: number;
  credit?: ImageCredit;
}

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

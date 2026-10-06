import type { Language, Locale } from "@/types/common";

/**
 * Locale configuration.
 *
 * URLs are always locale-prefixed (`/en/tours`). The architecture supports all
 * `LOCALES`; a locale goes live by flipping `enabled` in `LANGUAGES` once its
 * translations exist. Unknown or not-yet-enabled locales are redirected to the
 * default locale by `src/proxy.ts`.
 */

export const LANGUAGES: readonly Language[] = [
  { code: "en", label: "English", nativeLabel: "English", enabled: true },
  { code: "mn", label: "Mongolian", nativeLabel: "Монгол", enabled: false },
  { code: "ko", label: "Korean", nativeLabel: "한국어", enabled: false },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", enabled: false },
  { code: "zh", label: "Chinese", nativeLabel: "中文", enabled: false },
  { code: "ru", label: "Russian", nativeLabel: "Русский", enabled: false },
];

export const LOCALES: readonly Locale[] = LANGUAGES.map((language) => language.code);

export const ENABLED_LOCALES: readonly Locale[] = LANGUAGES.filter((l) => l.enabled).map(
  (l) => l.code,
);

export const DEFAULT_LOCALE: Locale = "en";

/** Open Graph locale codes. */
export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  mn: "mn_MN",
  ko: "ko_KR",
  ja: "ja_JP",
  zh: "zh_CN",
  ru: "ru_RU",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isEnabledLocale(value: string): value is Locale {
  return (ENABLED_LOCALES as readonly string[]).includes(value);
}

/** Prefix an unlocalized path ("/tours") with a locale ("/en/tours"). */
export function localizePath(locale: Locale, path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

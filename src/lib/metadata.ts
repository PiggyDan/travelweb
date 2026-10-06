import type { Metadata } from "next";
import type { ImageAsset, Locale } from "@/types/common";
import { ENABLED_LOCALES, OG_LOCALES, localizePath, DEFAULT_LOCALE } from "./i18n";
import { siteConfig } from "./site-config";

interface PageMetadataInput {
  locale: Locale;
  /** Unlocalized path, e.g. "/tours". */
  path: string;
  title: string;
  description: string;
  image?: Pick<ImageAsset, "src" | "width" | "height" | "alt">;
  type?: "website" | "article";
}

/** Canonical URL plus hreflang alternates for every enabled locale. */
export function buildAlternates(path: string, locale: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const enabled of ENABLED_LOCALES) {
    languages[enabled] = localizePath(enabled, path);
  }
  languages["x-default"] = localizePath(DEFAULT_LOCALE, path);
  return { canonical: localizePath(locale, path), languages };
}

/**
 * Build consistent page metadata: title (via the root template), description,
 * canonical + hreflang, Open Graph and Twitter card.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image = siteConfig.ogImage,
  type = "website",
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const ogImages = [{ url: image.src, width: image.width, height: image.height, alt: image.alt }];

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: localizePath(locale, path),
      siteName: siteConfig.name,
      locale: OG_LOCALES[locale],
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages.map((og) => og.url),
    },
  };
}

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

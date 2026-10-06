import type { FaqItem, Locale } from "@/types/common";
import type { Tour } from "@/types/tour";
import { localizePath } from "./i18n";
import { absoluteUrl } from "./metadata";
import { routes } from "./routes";
import { siteConfig } from "./site-config";

/**
 * schema.org JSON-LD builders. Render the result with `<JsonLd data={...} />`.
 * Review/AggregateRating markup is deliberately omitted until real, verified
 * guest reviews exist.
 */

type JsonLdObject = Record<string, unknown>;

export function organizationJsonLd(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl(localizePath(locale, routes.home)),
    image: absoluteUrl(siteConfig.ogImage.src),
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ulaanbaatar",
      addressCountry: "MN",
    },
    areaServed: { "@type": "Country", name: "Mongolia" },
    sameAs: Object.values(siteConfig.social),
  };
}

export function tourJsonLd(tour: Tour, locale: Locale): JsonLdObject {
  const url = absoluteUrl(localizePath(locale, routes.tour(tour.slug)));
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.summary,
    url,
    image: absoluteUrl(tour.heroImage.src),
    touristType: tour.type,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.itinerary.length,
      itemListElement: tour.itinerary.map((day) => ({
        "@type": "ListItem",
        position: day.day,
        name: day.title,
        description: day.description,
      })),
    },
    offers: {
      "@type": "Offer",
      price: tour.priceFrom.amount,
      priceCurrency: tour.priceFrom.currency,
      url,
      availability: "https://schema.org/InStock",
    },
    provider: { "@type": "TravelAgency", name: siteConfig.name, url: siteConfig.url },
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: readonly { name: string; path: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizePath(locale, item.path)),
    })),
  };
}

export function faqJsonLd(faqs: readonly FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

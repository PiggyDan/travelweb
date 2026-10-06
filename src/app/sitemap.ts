import type { MetadataRoute } from "next";
import { ENABLED_LOCALES, localizePath } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/metadata";
import { routes, staticSitemapPaths } from "@/lib/routes";
import { getJournalPosts } from "@/services/content-service";
import { getDestinationSlugs } from "@/services/destination-service";
import { getTourSlugs } from "@/services/tour-service";

/** One entry per path per enabled locale, with hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tourSlugs, destinationSlugs, posts] = await Promise.all([
    getTourSlugs(),
    getDestinationSlugs(),
    getJournalPosts(),
  ]);

  const paths = [
    ...staticSitemapPaths,
    ...tourSlugs.map(routes.tour),
    ...destinationSlugs.map(routes.destination),
    ...posts.map((post) => routes.journalPost(post.slug)),
  ];

  return paths.flatMap((path) =>
    ENABLED_LOCALES.map((locale) => ({
      url: absoluteUrl(localizePath(locale, path)),
      changeFrequency: path === routes.home ? ("weekly" as const) : ("monthly" as const),
      priority: path === routes.home ? 1 : path.startsWith(routes.tours) ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          ENABLED_LOCALES.map((alternate) => [alternate, absoluteUrl(localizePath(alternate, path))]),
        ),
      },
    })),
  );
}

import type { Metadata } from "next";
import { ExplorerLoader } from "@/components/explorer/explorer-loader";
import { getExplorerMessages } from "@/lib/explorer/messages";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { getMapHighlights } from "@/services/explorer-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/explore">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const messages = getExplorerMessages(locale);
  return buildPageMetadata({
    locale,
    path: routes.explore,
    title: messages.meta.title,
    description: messages.meta.description,
  });
}

export default async function ExplorePage({ params }: PageProps<"/[locale]/explore">) {
  const locale = await resolveLocale(params);
  const messages = getExplorerMessages(locale);
  const featured = await getMapHighlights();

  return (
    // The dark band sits behind the fixed, transparent site header.
    <div className="bg-sky-950 pt-20">
      <h1 className="sr-only">{messages.meta.title}</h1>
      <p className="sr-only">{messages.meta.description}</p>
      <ExplorerLoader featured={featured} />
    </div>
  );
}

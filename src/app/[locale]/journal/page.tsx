import type { Metadata } from "next";
import { JournalCard } from "@/components/shared/journal-card";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { getJournalPosts, getPageImages } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/journal">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.journal,
    title: "Travel Journal",
    description: "Planning advice, packing lists and cultural stories about Mongolia from the Dolgion’s Tour team.",
  });
}

export default async function JournalPage({ params }: PageProps<"/[locale]/journal">) {
  await resolveLocale(params);
  const [posts, images] = await Promise.all([getJournalPosts(), getPageImages()]);

  return (
    <>
      <PageHero
        eyebrow="Travel journal"
        title="Field notes from the steppe"
        description="Practical advice and quiet stories, written by our guides between journeys."
        image={images.journalHero}
      />
      <section aria-label="Articles" className="py-20 sm:py-28">
        <Container>
          {posts.length > 0 ? (
            <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal as="li" key={post.id} delay={(index % 3) * 0.08}>
                  <JournalCard post={post} headingLevel="h2" />
                </Reveal>
              ))}
            </ul>
          ) : (
            <EmptyState title="New stories are on their way" description="Our guides are out on the road. Check back soon." />
          )}
        </Container>
      </section>
    </>
  );
}

import { JournalCard } from "@/components/shared/journal-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/lib/routes";
import type { BlogPost } from "@/types/content";

export function JournalSection({ posts }: { posts: readonly BlogPost[] }) {
  const [feature, ...rest] = posts;
  if (!feature) return null;

  return (
    <section aria-labelledby="journal-title" className="py-24 sm:py-32">
      <Container>
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="journal-title"
            eyebrow="Travel journal"
            title="Field notes from the steppe."
            description="Practical advice and quiet stories from our guides, written between journeys."
          />
          <ButtonLink href={routes.journal} variant="outline-dark" className="shrink-0 self-start lg:self-auto">
            All articles
          </ButtonLink>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <JournalCard post={feature} variant="feature" />
          </Reveal>
          <ul className="flex flex-col divide-y divide-sand-300/70 lg:col-span-5 lg:col-start-8">
            {rest.slice(0, 3).map((post, index) => (
              <Reveal as="li" key={post.id} delay={index * 0.08} className="py-8 first:pt-0 last:pb-0">
                <JournalCard post={post} variant="row" />
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

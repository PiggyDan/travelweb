import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SEASON_LABELS } from "@/lib/labels";
import type { SeasonGuide as SeasonGuideData } from "@/types/content";

export function SeasonGuide({ seasons }: { seasons: readonly SeasonGuideData[] }) {
  return (
    <section aria-labelledby="seasons-title" className="bg-sand-100 py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="seasons-title"
          eyebrow="When to go"
          title="Four seasons, four Mongolias."
          description="There is no wrong time to visit — only different journeys. Here is what each season brings."
          className="mb-14"
        />
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {seasons.map((season, index) => (
            <Reveal as="li" key={season.season} delay={index * 0.08}>
              <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-felt-50">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={season.image.src}
                    alt={season.image.alt}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-copper-600">{season.months}</p>
                  <h3 className="mt-2 font-display text-3xl font-light text-sky-950">{SEASON_LABELS[season.season]}</h3>
                  <p className="mt-1 text-xs text-charcoal-500">{season.temperature}</p>
                  <p className="mt-4 text-sm leading-relaxed text-charcoal-600">{season.summary}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                    {season.bestFor.map((item) => (
                      <li key={item} className="rounded-full bg-steppe-100 px-3 py-1 text-xs text-steppe-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

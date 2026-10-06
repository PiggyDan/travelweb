import type { Metadata } from "next";
import Image from "next/image";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { getExperiences, getPageImages } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/experiences">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.experiences,
    title: "Experiences in Mongolia",
    description:
      "Horseback riding, nomadic family stays, eagle hunters, ger camps, Gobi adventures, photography, hiking and festivals.",
  });
}

export default async function ExperiencesPage({ params }: PageProps<"/[locale]/experiences">) {
  await resolveLocale(params);
  const [experiences, images] = await Promise.all([getExperiences(), getPageImages()]);

  return (
    <>
      <PageHero
        eyebrow="Experiences"
        title="Ways to feel the land"
        description="Mix any of these into a journey. Our planners will match them to the right season, region and pace."
        image={images.experiencesHero}
      />

      <section aria-label="All experiences" className="py-20 sm:py-28">
        <Container>
          <ul className="space-y-20 sm:space-y-28">
            {experiences.map((experience, index) => (
              <li key={experience.id} id={experience.slug}>
                <Reveal as="article" className="grid items-center gap-10 lg:grid-cols-12">
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:col-span-7",
                      index % 2 === 1 && "lg:order-2 lg:col-start-6",
                    )}
                  >
                    <Image
                      src={experience.image.src}
                      alt={experience.image.alt}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className={cn("lg:col-span-4", index % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-9")}>
                    <p className="eyebrow text-copper-600">{String(index + 1).padStart(2, "0")}</p>
                    <h2 className="mt-4 font-display text-4xl font-light text-sky-950 sm:text-5xl">{experience.title}</h2>
                    <p className="mt-4 font-display text-xl text-charcoal-600 italic">{experience.summary}</p>
                    <p className="mt-6 leading-relaxed text-charcoal-700">{experience.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner
        title={
          <>
            Combine them <span className="italic">your way.</span>
          </>
        }
        description="Tell us which experiences call to you and we'll weave them into one journey."
        image={images.finalCta}
        primary={{ label: "Plan my journey", href: routes.tripPlanner }}
        secondary={{ label: "Browse tours", href: routes.tours }}
      />
    </>
  );
}

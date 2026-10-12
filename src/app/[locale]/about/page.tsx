import type { Metadata } from "next";
import Image from "next/image";
import { WhySection } from "@/components/home/why-section";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { getBrandPillars, getPageImages } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.about,
    title: "About Us",
    description:
      "A Mongolian travel company based in Ulaanbaatar, designing small-group and private journeys with local guides and nomadic families.",
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  await resolveLocale(params);
  const [images, pillars] = await Promise.all([getPageImages(), getBrandPillars()]);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Born under the same sky"
        description="Dolgion’s Tour is a Mongolian company, run from Ulaanbaatar by people who grew up between the city and the steppe."
        image={images.aboutHero}
      />

      <section aria-labelledby="story-title" className="py-20 sm:py-28 lg:py-36">
        <Container className="grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow text-copper-600">Our story</p>
            <h2 id="story-title" className="mt-6 font-display text-4xl leading-[1.08] font-light text-sky-950 sm:text-5xl">
              We started by showing friends our country. <span className="italic">We never really stopped.</span>
            </h2>
            <div className="prose-editorial mt-8 text-lg leading-relaxed text-charcoal-700">
              <p>
                Many of us have family in the countryside — herders in Arkhangai, eagle hunters in the Altai,
                relatives who still move camp with the seasons. Showing visitors that world, honestly and on its own
                terms, is why Dolgion’s Tour exists.
              </p>
              <p>
                We keep groups small, work with the same families year after year, and pay them fairly. We plan
                slowly, so that you can travel slowly. And we stay close to every journey, from the first message to
                the last night in our guest house.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:col-span-5 lg:col-start-8">
            <Image
              src={images.aboutStory.src}
              alt={images.aboutStory.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </Container>
      </section>

      <WhySection pillars={pillars} image={images.why} eyebrow="What we believe" title="Five promises we make on every journey." />

      <CtaBanner
        title={
          <>
            Travel with <span className="italic">people who know.</span>
          </>
        }
        image={images.finalCta}
        primary={{ label: "Plan my journey", href: routes.tripPlanner }}
        secondary={{ label: "Contact us", href: routes.contact }}
      />
    </>
  );
}

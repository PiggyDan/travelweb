import { CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { getFestivals, getPageImages } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/festivals">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.festivals,
    title: "Mongolian Festivals",
    description: "Naadam, the Golden Eagle Festival, Tsagaan Sar and the Khuvsgul Ice Festival — when they happen and how to be there.",
  });
}

export default async function FestivalsPage({ params }: PageProps<"/[locale]/festivals">) {
  await resolveLocale(params);
  const [festivals, images] = await Promise.all([getFestivals(), getPageImages()]);

  return (
    <>
      <PageHero
        eyebrow="Festivals"
        title="Celebrations of the steppe"
        description="Mongolia's festivals are joyous, deeply rooted and rarely staged for visitors. We'll help you be there as a guest."
        image={images.festivalsHero}
      />

      <section aria-label="Festival calendar" className="py-20 sm:py-28">
        <Container>
          <ul className="space-y-16 sm:space-y-24">
            {festivals.map((festival, index) => (
              <li key={festival.id}>
                <Reveal as="article" className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                  <div
                    className={cn(
                      "relative aspect-[16/10] overflow-hidden rounded-[2rem] lg:col-span-6",
                      index % 2 === 1 && "lg:order-2 lg:col-start-7",
                    )}
                  >
                    <Image
                      src={festival.image.src}
                      alt={festival.image.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className={cn("lg:col-span-5", index % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
                    <h2 className="font-display text-4xl font-light text-sky-950 sm:text-5xl">{festival.name}</h2>
                    <dl className="mt-5 space-y-2 text-sm text-charcoal-600">
                      <div className="flex items-center gap-2">
                        <dt>
                          <CalendarDays aria-hidden className="size-4 text-copper-600" />
                          <span className="sr-only">When</span>
                        </dt>
                        <dd>{festival.timing}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <dt>
                          <MapPin aria-hidden className="size-4 text-copper-600" />
                          <span className="sr-only">Where</span>
                        </dt>
                        <dd>{festival.location}</dd>
                      </div>
                    </dl>
                    <p className="mt-6 text-lg leading-relaxed text-charcoal-700">{festival.summary}</p>
                    {festival.relatedTourSlug && (
                      <ButtonLink href={routes.tour(festival.relatedTourSlug)} variant="outline-dark" className="mt-8">
                        See the journey
                      </ButtonLink>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-20 text-sm text-charcoal-500">
            Festival dates move with the lunar calendar or are set by local organisers each year. We confirm exact dates
            when you enquire.
          </p>
        </Container>
      </section>

      <CtaBanner
        title={
          <>
            Time your journey <span className="italic">to a celebration.</span>
          </>
        }
        image={images.finalCta}
        primary={{ label: "Plan my journey", href: routes.tripPlanner }}
        secondary={{ label: "Contact us", href: routes.contact }}
      />
    </>
  );
}

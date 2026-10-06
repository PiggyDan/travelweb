import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import { SeasonGuide } from "@/components/destinations/season-guide";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { getPageImages, getSeasonGuides, getTravelInfoSections } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/travel-information">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.travelInformation,
    title: "Mongolia Travel Information",
    description: "Visas, getting there, money, health, connectivity and etiquette — practical information for travelling in Mongolia.",
  });
}

export default async function TravelInformationPage({ params }: PageProps<"/[locale]/travel-information">) {
  await resolveLocale(params);
  const [sections, seasons, images] = await Promise.all([getTravelInfoSections(), getSeasonGuides(), getPageImages()]);

  return (
    <>
      <PageHero
        eyebrow="Travel information"
        title="Before you go"
        description="Practical notes from our team to help you arrive prepared — and relaxed."
        image={images.travelInfoHero}
      />

      <section aria-label="Travel essentials" className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <nav aria-label="On this page" className="lg:col-span-3">
            <p className="eyebrow mb-4 text-copper-600">On this page</p>
            <ul className="space-y-1 lg:sticky lg:top-28">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-charcoal-600 hover:text-sky-950">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="divide-y divide-sand-300/70 lg:col-span-8 lg:col-start-5">
            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="py-10 first:pt-0">
                <h2 id={`${section.id}-title`} className="font-display text-3xl font-light text-sky-950">
                  {section.title}
                </h2>
                <div className="prose-editorial mt-5 text-lg leading-relaxed text-charcoal-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
                {section.tips && (
                  <ul className="mt-6 space-y-2 rounded-2xl bg-sand-100 p-5">
                    {section.tips.map((tip) => (
                      <li key={tip} className="flex gap-3 text-sm text-charcoal-700">
                        <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-copper-600" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <p className="pt-10 text-sm text-charcoal-500">
              This page is general guidance. Entry, health and currency rules change — always confirm with official
              sources before you travel.
            </p>
          </div>
        </Container>
      </section>

      <SeasonGuide seasons={seasons} />

      <CtaBanner
        title={
          <>
            Questions before <span className="italic">you book?</span>
          </>
        }
        image={images.finalCta}
        primary={{ label: "Ask a planner", href: routes.contact }}
        secondary={{ label: "Read the FAQ", href: routes.faq }}
      />
    </>
  );
}

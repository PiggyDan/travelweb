import type { Metadata } from "next";
import { FaqList } from "@/components/shared/faq-list";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { faqJsonLd } from "@/lib/structured-data";
import { getFaqGroups, getPageImages } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.faq,
    title: "Frequently Asked Questions",
    description: "Answers about planning, travelling and booking a journey in Mongolia with Eternal Sky Tour.",
  });
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  await resolveLocale(params);
  const [groups, images] = await Promise.all([getFaqGroups(), getPageImages()]);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything travellers usually ask before their first journey to Mongolia. Can't find yours? Ask us."
        image={images.faqHero}
      />

      <section aria-label="Frequently asked questions" className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <nav aria-label="FAQ topics" className="lg:col-span-3">
            <ul className="space-y-1 lg:sticky lg:top-28">
              {groups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-charcoal-600 hover:text-sky-950"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-16 lg:col-span-8 lg:col-start-5">
            {groups.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`}>
                <h2 id={`${group.id}-title`} className="mb-6 font-display text-3xl font-light text-sky-950">
                  {group.title}
                </h2>
                <FaqList items={group.items} />
              </section>
            ))}
            <div className="rounded-[1.5rem] bg-sand-100 p-8">
              <h2 className="font-display text-2xl text-sky-950">Still wondering about something?</h2>
              <p className="mt-3 text-charcoal-600">Our planners are happy to answer anything, however small.</p>
              <ButtonLink href={routes.contact} variant="dark" className="mt-6">
                Ask a planner
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <JsonLd data={faqJsonLd(groups.flatMap((g) => g.items))} />
    </>
  );
}

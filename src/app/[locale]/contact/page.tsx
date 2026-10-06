import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import { firstParam, formatDateRange } from "@/lib/utils";
import { getPageImages } from "@/services/content-service";
import { getTourBySlug, getTours } from "@/services/tour-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.contact,
    title: "Contact Us",
    description: "Speak with a Mongolia-based travel planner about tours, private journeys and the Eternal Sky Guest House.",
  });
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[locale]/contact">) {
  await resolveLocale(params);
  const query = await searchParams;
  const tourSlug = firstParam(query.tour);
  const departureId = firstParam(query.departure);

  const [images, tours, selectedTour] = await Promise.all([
    getPageImages(),
    getTours(),
    tourSlug ? getTourBySlug(tourSlug) : Promise.resolve(null),
  ]);
  const departure = selectedTour?.departures.find((d) => d.id === departureId);

  const details = [
    { label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}`, Icon: Mail },
    { label: "Phone", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`, Icon: Phone },
    { label: "Office", value: siteConfig.contact.address, Icon: MapPin },
    { label: "Hours", value: siteConfig.contact.hours, Icon: Clock },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's start a conversation"
        description="Tell us a little about your plans. A planner based in Ulaanbaatar will reply personally — never with a template."
        image={images.contactHero}
      />

      <section aria-labelledby="contact-form-title" className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="contact-form-title" className="font-display text-3xl font-light text-sky-950 sm:text-4xl">
              {selectedTour ? `Enquire about ${selectedTour.title}` : "Send us an enquiry"}
            </h2>
            <p className="mt-5 leading-relaxed text-charcoal-600">
              Whether you have a tour in mind or just a feeling about Mongolia, we&apos;d love to hear from you.
            </p>
            <ul className="mt-10 space-y-6">
              {details.map(({ label, value, href, Icon }) => (
                <li key={label} className="flex gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-sand-100 text-copper-600">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-charcoal-500 uppercase">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-sky-950 underline-offset-4 hover:underline">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sky-950">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="rounded-[2rem] bg-felt-50 p-6 ring-1 ring-sand-200 sm:p-10 lg:col-span-7 lg:col-start-6">
            <InquiryForm
              tours={tours.map((tour) => ({ value: tour.slug, label: tour.title }))}
              defaultTourSlug={selectedTour?.slug}
              departureLabel={departure ? formatDateRange(departure.startDate, departure.endDate) : undefined}
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}

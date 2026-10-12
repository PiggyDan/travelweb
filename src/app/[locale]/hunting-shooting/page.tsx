import Image from "next/image";
import { ArrowRight, Binoculars, Car, Compass, Fish, MapPin, Mountain, ShieldCheck, TentTree, Utensils } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { images } from "@/data/images";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

const inquiryHref = `${routes.contact}?experience=hunting-shooting`;

const activities = [
  { Icon: Car, title: "Pickup & drop-off", text: "Transport from Ulaanbaatar to the camp and back." },
  { Icon: ShieldCheck, title: "Target shooting", text: "Supervised target-shooting sessions with a safety briefing." },
  { Icon: TentTree, title: "Camp experience", text: "Relax at a countryside camp surrounded by open landscape." },
  { Icon: Mountain, title: "Horse riding", text: "Explore the Mongolian countryside on horseback." },
  { Icon: Fish, title: "Fishing tour", text: "Optional seasonal fishing activities and countryside travel." },
  { Icon: Utensils, title: "Camp food", text: "Traditional meals and local dairy products during your visit." },
];

const features = [
  ["Outdoor escape", "A quiet countryside experience away from the city."],
  ["Safety first", "Clear range rules, controlled sessions and guided activities."],
  ["Local culture", "Meet local families and experience traditional Mongolian hospitality."],
  ["Flexible trips", "Day trips and custom programs for small groups or companies."],
];

const program = [
  "Arrival and safety introduction",
  "Introduction to sporting firearms and range rules",
  "Supervised target-shooting session",
  "Traditional lunch and camp experience",
  "Horse riding or countryside walk",
  "Wildlife photography and bird watching",
  "Nomadic family visit and cultural experience",
  "Return transport to Ulaanbaatar",
];

export async function generateMetadata({ params }: PageProps<"/[locale]/hunting-shooting">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.hunting,
    title: "Hunting & Shooting — Mongolia Outdoor Day Trip",
    description: "A countryside day trip from Ulaanbaatar combining supervised target shooting, horse riding, camp food and Mongolian nomadic culture.",
    image: images.huntingMap,
  });
}

export default async function HuntingPage({ params }: PageProps<"/[locale]/hunting-shooting">) {
  await resolveLocale(params);

  return (
    <>
      <PageHero
        size="large"
        eyebrow="Hunting & Shooting · Ulaanbaatar, Mongolia"
        title={<>Target shooting <span className="italic">in the wild.</span></>}
        description="A countryside day trip combining supervised target shooting, Mongolian culture, horse riding and outdoor adventure."
        image={images.huntingMap}
      >
        <div className="flex flex-wrap gap-4">
          <ButtonLink href={inquiryHref} variant="copper">Plan your trip <ArrowRight aria-hidden className="size-4" /></ButtonLink>
          <ButtonLink href="#program" variant="outline-light">View program</ButtonLink>
        </div>
        <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/25 pt-6">
          {[["110–150 km", "from Ulaanbaatar"], ["Full day", "customizable program"], ["Guided", "outdoor experience"]].map(([value, label]) => (
            <div key={label}><dt className="text-xs text-sky-100">{label}</dt><dd className="mt-2 font-display text-2xl sm:text-3xl">{value}</dd></div>
          ))}
        </dl>
      </PageHero>

      <section aria-labelledby="hunting-about" className="py-20 sm:py-28">
        <Container>
          <SectionHeading id="hunting-about" eyebrow="About the experience" title="More than a shooting range." description="Designed as a complete outdoor experience, the trip combines sporting target shooting with scenery, wildlife, local food and Mongolian nomadic culture." />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([title, text], index) => (
              <article key={title} className="border-t border-sand-300 pt-6">
                <span className="eyebrow text-copper-600">0{index + 1}</span>
                <h3 className="mt-4 font-display text-2xl text-sky-950">{title}</h3>
                <p className="mt-3 leading-relaxed text-charcoal-600">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="hunting-activities" className="bg-sky-950 py-20 text-felt-50 sm:py-28">
        <Container>
          <SectionHeading id="hunting-activities" tone="light" eyebrow="What you can do" title="Outdoor activities" description="Choose a standard day trip or build a custom program for your group." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map(({ Icon, title, text }) => (
              <article key={title} className="bg-sky-950 p-8 sm:p-10">
                <Icon aria-hidden className="size-7 text-copper-300" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-3xl">{title}</h3>
                <p className="mt-3 leading-relaxed text-sky-100">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="program" aria-labelledby="hunting-program" className="scroll-mt-24 py-20 sm:py-28">
        <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <a href={images.huntingProgram.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-3xl bg-sand-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper-600">
            <Image {...images.huntingProgram} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" />
            <span className="block p-4 text-center text-sm text-charcoal-600">Open the original program brochure ↗</span>
          </a>
          <div>
            <SectionHeading id="hunting-program" eyebrow="Sample itinerary" title="A full day outside the city." description="The exact order can change depending on weather, season and your group." />
            <ol className="mt-8 divide-y divide-sand-300 border-y border-sand-300">
              {program.map((step, index) => (
                <li key={step} className="flex gap-5 py-5"><span className="eyebrow pt-1 text-copper-600">{String(index + 1).padStart(2, "0")}</span><span className="text-charcoal-700">{step}</span></li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section aria-labelledby="hunting-location" className="bg-sand-100 py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading id="hunting-location" eyebrow="Location" title="Easy escape from Ulaanbaatar." description="The camp is reached by a mix of paved and countryside roads. Transport can be arranged from Ulaanbaatar." />
            <ul className="my-8 divide-y divide-sand-300 border-y border-sand-300 text-charcoal-700">
              <li className="flex items-center gap-4 py-5"><MapPin aria-hidden className="size-5 shrink-0 text-copper-600" />110 km via paved-road route</li>
              <li className="flex items-center gap-4 py-5"><Compass aria-hidden className="size-5 shrink-0 text-copper-600" />150 km via countryside route</li>
              <li className="flex items-center gap-4 py-5"><Binoculars aria-hidden className="size-5 shrink-0 text-copper-600" />Nature, wildlife and open steppe scenery</li>
            </ul>
            <ButtonLink href={inquiryHref}>Ask about transport <ArrowRight aria-hidden className="size-4" /></ButtonLink>
          </div>
          <a href={images.huntingMap.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-3xl bg-felt-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper-600">
            <Image {...images.huntingMap} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" />
            <span className="block p-4 text-center text-sm text-charcoal-600">Open the original route map brochure ↗</span>
          </a>
        </Container>
      </section>

      <section aria-labelledby="hunting-booking" className="bg-sky-950 py-20 text-felt-50 sm:py-28">
        <Container className="max-w-4xl text-center">
          <SectionHeading id="hunting-booking" tone="light" align="center" eyebrow="Booking & information" title="Ready for a day in the Mongolian countryside?" description="Contact us for available dates, group pricing, transport options and custom programs. Advance booking is recommended." />
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href={inquiryHref} variant="copper">Enquire about this trip <ArrowRight aria-hidden className="size-4" /></ButtonLink>
            <a href={`mailto:${siteConfig.contact.email}?subject=Hunting%20%26%20Shooting%20day%20trip`} className="inline-flex min-h-13 items-center px-6 text-sm underline underline-offset-4">Email us directly</a>
          </div>
        </Container>
      </section>
    </>
  );
}

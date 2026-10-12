import { BedDouble, Check, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/utils";
import { getGuestHouse, getPageImages } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/guest-house">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.guestHouse,
    title: "Dolgion’s Tour Guest House, Ulaanbaatar",
    description:
      "Quiet rooms in central Ulaanbaatar for travellers before and after their Mongolia journey — breakfast, luggage storage and trip briefings.",
  });
}

const timeline = [
  {
    title: "Before your journey",
    text: "Arrive to a quiet room and a hot shower. Meet your guide over tea, collect a local SIM card and leave the luggage you won't need on the road.",
  },
  {
    title: "Between regions",
    text: "Pause in the city between the Gobi and the Altai: laundry, a long sleep in a proper bed and a good coffee.",
  },
  {
    title: "After your journey",
    text: "Come back to your stored bags and a final evening in Ulaanbaatar before your flight home.",
  },
];

export default async function GuestHousePage({ params }: PageProps<"/[locale]/guest-house">) {
  await resolveLocale(params);
  const [guestHouse, images] = await Promise.all([getGuestHouse(), getPageImages()]);

  return (
    <>
      <PageHero
        eyebrow="Guest house · Ulaanbaatar"
        title={guestHouse.name}
        description={guestHouse.tagline}
        image={guestHouse.heroImage}
      />

      <section aria-labelledby="gh-intro" className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2 id="gh-intro" className="font-display text-4xl leading-[1.08] font-light text-sky-950 sm:text-5xl">
              Your base in the capital, <span className="italic">before and after the steppe.</span>
            </h2>
            <p className="mt-6 flex items-center gap-2 text-sm text-charcoal-500">
              <MapPin aria-hidden className="size-4 text-copper-600" />
              {guestHouse.address}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="prose-editorial text-lg leading-relaxed text-charcoal-700 lg:col-span-5 lg:col-start-8">
            {guestHouse.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="gh-when" className="bg-sky-950 py-20 text-felt-50 sm:py-28">
        <Container>
          <SectionHeading id="gh-when" tone="light" eyebrow="How guests use it" title="One house, three moments." className="mb-14" />
          <ol className="grid gap-10 md:grid-cols-3">
            {timeline.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 0.08} className="border-t border-white/20 pt-8">
                <span className="font-display text-4xl font-light text-copper-400">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-sky-100">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="gh-rooms" className="py-20 sm:py-28">
        <Container>
          <SectionHeading id="gh-rooms" eyebrow="Rooms" title="Simple, calm and warm." className="mb-12" />
          <ul className="grid gap-6 md:grid-cols-3">
            {guestHouse.rooms.map((room, index) => (
              <Reveal as="li" key={room.id} delay={index * 0.08}>
                <article className="flex h-full flex-col rounded-[1.5rem] bg-felt-50 p-7 ring-1 ring-sand-200">
                  <BedDouble aria-hidden className="size-6 text-copper-600" strokeWidth={1.25} />
                  <h3 className="mt-5 font-display text-2xl text-sky-950">{room.name}</h3>
                  <p className="mt-2 text-sm text-charcoal-500">Sleeps {room.sleeps}</p>
                  <p className="mt-4 leading-relaxed text-charcoal-700">{room.description}</p>
                  <ul className="mt-5 space-y-2 text-sm text-charcoal-600">
                    {room.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check aria-hidden className="size-3.5 text-steppe-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto border-t border-sand-200 pt-5 text-sm text-charcoal-500">
                    From <span className="font-display text-2xl text-sky-950">{formatPrice(room.priceFrom)}</span> / night
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>

          <div className="mt-16 rounded-[1.5rem] bg-sand-100 p-8 sm:p-10">
            <h3 className="eyebrow text-copper-600">Every stay includes</h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {guestHouse.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-3 text-charcoal-700">
                  <Check aria-hidden className="size-4 shrink-0 text-steppe-500" />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaBanner
        eyebrow="Stay with us"
        title={
          <>
            A calm place <span className="italic">to land.</span>
          </>
        }
        description="Guest house nights are included in most of our journeys, and can be booked separately."
        image={images.finalCta}
        primary={{ label: "Ask about availability", href: routes.contact }}
        secondary={{ label: "View all tours", href: routes.tours }}
      />
    </>
  );
}

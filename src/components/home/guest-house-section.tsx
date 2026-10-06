import { Check } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { routes } from "@/lib/routes";
import type { GuestHouse } from "@/types/content";

export function GuestHouseSection({ guestHouse }: { guestHouse: GuestHouse }) {
  const [primaryImage, secondaryImage] = guestHouse.images;

  return (
    <section aria-labelledby="guest-house-title" className="py-24 sm:py-32 lg:py-40">
      <Container className="grid items-center gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-copper-600">In Ulaanbaatar</p>
          <h2
            id="guest-house-title"
            className="mt-6 font-display text-4xl leading-[1.05] font-light tracking-tight text-sky-950 sm:text-5xl lg:text-6xl"
          >
            {guestHouse.name}
          </h2>
          <p className="mt-4 font-display text-xl text-charcoal-600 italic">{guestHouse.tagline}</p>
          <p className="mt-8 text-lg leading-relaxed text-charcoal-700">{guestHouse.intro[1]}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {guestHouse.amenities.slice(0, 4).map((amenity) => (
              <li key={amenity} className="flex items-center gap-3 text-sm text-charcoal-700">
                <Check aria-hidden className="size-4 shrink-0 text-steppe-500" />
                {amenity}
              </li>
            ))}
          </ul>
          <ButtonLink href={routes.guestHouse} variant="dark" className="mt-12">
            Discover our guest house
          </ButtonLink>
        </Reveal>

        <div className="relative lg:col-span-6 lg:col-start-7">
          {primaryImage && (
            <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:ml-16">
              <Image
                src={primaryImage.src}
                alt={primaryImage.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </Reveal>
          )}
          {secondaryImage && (
            <Reveal
              delay={0.15}
              className="absolute -bottom-10 left-0 hidden aspect-square w-56 overflow-hidden rounded-[1.5rem] border-8 border-felt-100 sm:block"
            >
              <Image src={secondaryImage.src} alt={secondaryImage.alt} fill sizes="224px" className="object-cover" />
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Reveal } from "@/components/ui/reveal";
import { routes } from "@/lib/routes";
import type { ImageAsset } from "@/types/common";

export function IntroSection({ image }: { image: ImageAsset }) {
  return (
    <section id="intro" aria-labelledby="intro-title" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <Reveal>
          <p className="eyebrow text-copper-600">Welcome to Mongolia</p>
          <h2
            id="intro-title"
            className="mt-6 max-w-6xl font-display text-[2.5rem] leading-[1.04] font-light tracking-tight text-sky-950 text-balance sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            Most journeys show you a place.{" "}
            <span className="text-charcoal-500 italic">Mongolia changes the scale of everything.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid items-end gap-12 lg:mt-24 lg:grid-cols-12">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:col-span-7">
            <ParallaxImage image={image} sizes="(min-width: 1024px) 58vw, 100vw" />
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <div className="prose-editorial space-y-0 text-lg leading-relaxed text-charcoal-700">
              <p>
                Here the horizon is wider than you thought possible, a neighbour may live a day&apos;s ride
                away, and the sky — the one Mongolians have called eternal for centuries — seems to start
                at your feet.
              </p>
              <p>
                Dolgion’s Tour was founded in Ulaanbaatar to share this country the way we know it: slowly,
                personally, and with the families who make it home. No crowds, no scripts — just the right
                people, the right season and room to breathe.
              </p>
            </div>
            <ButtonLink href={routes.about} variant="outline-dark" className="mt-10">
              Our story
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

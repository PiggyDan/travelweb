import { Container } from "@/components/ui/container";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Reveal } from "@/components/ui/reveal";
import type { ImageAsset } from "@/types/common";
import type { BrandPillar } from "@/types/content";

interface WhySectionProps {
  pillars: readonly BrandPillar[];
  image: ImageAsset;
  eyebrow?: string;
  title?: string;
}

/**
 * Editorial composition: a sticky statement and image on the left, a
 * numbered manifesto on the right. Deliberately not a grid of icon boxes.
 */
export function WhySection({
  pillars,
  image,
  eyebrow = "Why Eternal Sky",
  title = "We travel the way our families always have — with time, and with respect.",
}: WhySectionProps) {
  return (
    <section aria-labelledby="why-title" className="bg-sky-950 py-24 text-felt-50 sm:py-32 lg:py-40">
      <Container className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="eyebrow text-copper-300">{eyebrow}</p>
              <h2
                id="why-title"
                className="mt-6 font-display text-4xl leading-[1.08] font-light tracking-tight text-balance sm:text-5xl"
              >
                {title}
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="relative mt-12 hidden aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] lg:block">
              <ParallaxImage image={image} sizes="(min-width: 1024px) 30vw, 0px" />
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {pillars.map((pillar, index) => (
            <Reveal
              as="li"
              key={pillar.id}
              className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-white/15 py-10 first:border-t-0 first:pt-0 sm:gap-x-10 sm:py-12"
            >
              <span aria-hidden className="font-display text-5xl leading-none font-light text-copper-400 sm:text-6xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl font-normal sm:text-3xl">{pillar.title}</h3>
                <p className="mt-4 max-w-lg leading-relaxed text-sky-100">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

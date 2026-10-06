import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { routes } from "@/lib/routes";
import type { FeaturedStory } from "@/types/content";

export function FeaturedStorySection({ story }: { story: FeaturedStory }) {
  return (
    <section aria-labelledby="story-title" className="bg-sand-100">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <div className="relative min-h-[60svh] lg:col-span-7 lg:min-h-[90svh]">
          <Image
            src={story.image.src}
            alt={story.image.alt}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-5 py-20 sm:px-8 sm:py-28 lg:col-span-5 lg:px-16 xl:px-20">
          <Reveal>
            <p className="eyebrow text-copper-600">{story.eyebrow}</p>
            <h2
              id="story-title"
              className="mt-6 font-display text-5xl leading-[0.98] font-light tracking-tight text-sky-950 uppercase sm:text-6xl xl:text-7xl"
            >
              {story.title}
            </h2>
            <div className="prose-editorial mt-10 text-lg leading-relaxed text-charcoal-700">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <ButtonLink href={routes.journal} variant="outline-dark" className="mt-10">
              Read the journal
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

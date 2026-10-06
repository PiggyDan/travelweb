import Image from "next/image";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types/content";
import { LocaleLink } from "./locale-link";

/**
 * Immersive image tile linking to the experience on the Experiences page.
 * On large screens the summary rises on hover or keyboard focus; on touch
 * screens it is always visible.
 */
export function ExperienceTile({
  experience,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw",
}: {
  experience: Experience;
  className?: string;
  sizes?: string;
}) {
  const reveal =
    "lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:max-h-24 lg:group-hover:opacity-100 lg:group-focus-within:max-h-24 lg:group-focus-within:opacity-100";

  return (
    <article
      className={cn(
        "group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-sky-900 text-white",
        className,
      )}
    >
      <Image
        src={experience.image.src}
        alt={experience.image.alt}
        fill
        sizes={sizes}
        className="-z-20 object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] motion-safe:group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-sky-950/90 via-sky-950/20 to-transparent" />
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-2xl font-normal">
          <LocaleLink
            href={`${routes.experiences}#${experience.slug}`}
            className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-[-4px] focus-visible:after:outline-copper-300"
          >
            {experience.title}
          </LocaleLink>
        </h3>
        <p className={cn("mt-2 text-sm leading-relaxed text-sky-50/90", reveal)}>{experience.summary}</p>
      </div>
    </article>
  );
}

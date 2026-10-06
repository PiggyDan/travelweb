import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

/** Consistent heading + spacing for each block of the tour detail page. */
export function TourSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-sand-300/70 py-14 first:border-t-0 first:pt-0 sm:py-20">
      <Reveal>
        <p className="eyebrow text-copper-600">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-4 font-display text-3xl leading-tight font-light text-sky-950 sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}

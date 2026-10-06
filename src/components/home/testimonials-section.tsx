import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { formatMonth } from "@/lib/utils";
import type { Testimonial } from "@/types/content";

export function TestimonialsSection({ testimonials }: { testimonials: readonly Testimonial[] }) {
  const [featured, ...rest] = testimonials;
  if (!featured) return null;
  const hasPlaceholders = testimonials.some((t) => t.isPlaceholder);

  return (
    <section aria-labelledby="testimonials-title" className="bg-steppe-800 py-24 text-felt-50 sm:py-32">
      <Container>
        <p className="eyebrow text-copper-300">Guest voices</p>
        <h2 id="testimonials-title" className="sr-only">
          What travellers say
        </h2>

        <Reveal as="article" className="mt-10 max-w-5xl">
          <Quote aria-hidden className="size-10 text-copper-400" strokeWidth={1} />
          <blockquote className="mt-6 font-display text-3xl leading-snug font-light text-balance sm:text-4xl lg:text-5xl">
            “{featured.quote}”
          </blockquote>
          <footer className="mt-8 text-sm text-steppe-100">
            <span className="font-semibold text-white">{featured.authorName}</span>, {featured.authorCountry} ·{" "}
            {featured.tourTitle}, {formatMonth(featured.travelMonth)}
          </footer>
        </Reveal>

        <ul className="mt-20 grid gap-10 border-t border-white/15 pt-12 md:grid-cols-3 md:gap-12">
          {rest.map((testimonial, index) => (
            <Reveal as="li" key={testimonial.id} delay={index * 0.08}>
              <figure>
                <blockquote className="leading-relaxed text-steppe-100">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold text-white">{testimonial.authorName}</span>
                  <span className="block text-steppe-200">
                    {testimonial.authorCountry} · {testimonial.tourTitle}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        {hasPlaceholders && (
          <p className="mt-14 text-xs text-steppe-200">
            Sample testimonials shown for design purposes — to be replaced with verified guest reviews.
          </p>
        )}
      </Container>
    </section>
  );
}

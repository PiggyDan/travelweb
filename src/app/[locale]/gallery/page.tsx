import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { getGalleryImages, getImageCredits, getPageImages } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/gallery">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.gallery,
    title: "Gallery",
    description: "Landscapes, nomadic life, festivals and camps — a visual journey through Mongolia.",
  });
}

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  await resolveLocale(params);
  const [gallery, credits, images] = await Promise.all([getGalleryImages(), getImageCredits(), getPageImages()]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Mongolia in light and space"
        description="A collection of moments from the regions we travel — dunes, lakes, festivals and the people who welcome us."
        image={images.galleryHero}
      />

      <section aria-label="Photographs" className="py-20 sm:py-28">
        <Container>
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
            {gallery.map((item) => (
              <li key={item.id} className="break-inside-avoid">
                <figure className="group overflow-hidden rounded-[1.25rem] bg-felt-50">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="h-auto w-full transition-transform duration-[1.4s] ease-[var(--ease-soft)] motion-safe:group-hover:scale-[1.03]"
                  />
                  <figcaption className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-charcoal-700">{item.caption}</span>
                    <span className="eyebrow shrink-0 text-[0.625rem] text-copper-600">{item.category}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="credits" aria-labelledby="credits-title" className="border-t border-sand-300/70 bg-felt-50 py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="credits-title"
            eyebrow="Photo credits"
            title="With thanks to the photographers"
            description="Photographs on this site are openly licensed works from Wikimedia Commons, used under the licences listed below."
            className="mb-10"
          />
          <ul className="grid gap-x-10 gap-y-3 text-sm text-charcoal-600 sm:grid-cols-2 lg:grid-cols-3">
            {credits.map((image) =>
              image.credit ? (
                <li key={image.src}>
                  <a
                    href={image.credit.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:text-sky-950 hover:underline"
                  >
                    {image.alt.split(" ").slice(0, 6).join(" ")}…
                  </a>{" "}
                  — {image.credit.author}, {image.credit.license}
                </li>
              ) : null,
            )}
          </ul>
        </Container>
      </section>
    </>
  );
}

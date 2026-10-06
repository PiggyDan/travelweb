import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/common";

interface PageHeroProps {
  eyebrow?: string;
  /** Rendered as the page's single <h1>. */
  title: ReactNode;
  description?: ReactNode;
  image: ImageAsset;
  size?: "large" | "medium";
  /** Rendered above the eyebrow, e.g. breadcrumbs. */
  top?: ReactNode;
  /** Rendered below the description, e.g. key facts or buttons. */
  children?: ReactNode;
}

/**
 * Dark, image-led hero used at the top of every inner page. The header is
 * transparent over it, so every page must start with a dark hero.
 */
export function PageHero({ eyebrow, title, description, image, size = "medium", top, children }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex items-end overflow-hidden bg-sky-950 text-white",
        size === "large" ? "min-h-[88svh]" : "min-h-[68svh] sm:min-h-[60svh]",
      )}
    >
      <ParallaxImage image={image} priority sizes="100vw" className="-z-20" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-sky-950 via-sky-950/45 to-sky-950/30"
      />
      <Container className="pt-36 pb-14 sm:pb-20 lg:pb-24">
        {top && <div className="mb-8">{top}</div>}
        <Reveal className="max-w-4xl">
          {eyebrow && <p className="eyebrow mb-5 text-copper-300">{eyebrow}</p>}
          <h1 className="font-display text-[2.75rem] leading-[1.02] font-light tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            {title}
          </h1>
          {description && (
            <div className="mt-6 max-w-2xl text-base leading-relaxed text-sky-50/90 sm:text-lg">
              {description}
            </div>
          )}
        </Reveal>
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </section>
  );
}

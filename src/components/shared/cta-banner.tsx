import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Reveal } from "@/components/ui/reveal";
import type { ImageAsset } from "@/types/common";

interface CtaAction {
  label: string;
  href: string;
}

interface CtaBannerProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  image: ImageAsset;
  primary: CtaAction;
  secondary?: CtaAction;
}

/** Large cinematic call to action, typically the last section before the footer. */
export function CtaBanner({ eyebrow, title, description, image, primary, secondary }: CtaBannerProps) {
  return (
    <section className="relative isolate overflow-hidden bg-sky-950 text-white">
      <ParallaxImage image={image} sizes="100vw" className="-z-20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-sky-950/60" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-sky-950/40 via-transparent to-sky-950/70"
      />
      <Container className="flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
        <Reveal className="flex flex-col items-center">
          {eyebrow && <p className="eyebrow mb-6 text-copper-300">{eyebrow}</p>}
          <h2 className="font-display text-5xl leading-[0.98] font-light tracking-tight text-balance sm:text-7xl lg:text-8xl">
            {title}
          </h2>
          {description && <p className="mt-8 max-w-xl text-base text-sky-50/90 sm:text-lg">{description}</p>}
          <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <ButtonLink href={primary.href} variant="light" className="w-full sm:w-auto">
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="outline-light" className="w-full sm:w-auto">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

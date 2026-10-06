import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { getPageImages } from "@/services/content-service";

export default async function NotFound() {
  const { notFound: image } = await getPageImages();

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-sky-950 text-white">
      <Image src={image.src} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-50" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-sky-950 via-sky-950/70 to-sky-950/50" />
      <Container className="py-32">
        <p className="eyebrow text-copper-300">Error 404</p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.02] font-light tracking-tight sm:text-7xl">
          This trail fades into <span className="italic">the dunes.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-sky-100">
          The page you were looking for has moved or never existed. Even our best guides lose the track sometimes.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routes.home} variant="light">
            Back to home
          </ButtonLink>
          <ButtonLink href={routes.tours} variant="outline-light">
            Explore tours
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

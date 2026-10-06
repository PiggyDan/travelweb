"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Replace with real error reporting (e.g. Sentry) in Phase 2.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-svh items-center bg-sky-950 text-white">
      <Container className="py-32">
        <p className="eyebrow text-copper-300">Something went wrong</p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.02] font-light tracking-tight sm:text-6xl">
          A storm rolled across <span className="italic">the steppe.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-sky-100">
          We couldn&apos;t load this page just now. Please try again — if it keeps happening, let us know.
        </p>
        {error.digest && <p className="mt-4 text-xs text-sky-300">Reference: {error.digest}</p>}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button variant="light" onClick={reset}>
            <RotateCcw aria-hidden className="size-4" />
            Try again
          </Button>
          <ButtonLink href={routes.home} variant="outline-light">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

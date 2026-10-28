"use client";

import dynamic from "next/dynamic";
import type { FeaturedDestination } from "@/types/explorer";

/** Placeholder with the explorer's layout while the map code downloads. */
function ExplorerSkeleton() {
  return (
    <div className="relative h-[calc(100svh-5rem)] min-h-[34rem] w-full overflow-hidden bg-sky-100" aria-busy="true">
      <div className="absolute inset-x-0 bottom-0 h-[13.5rem] animate-pulse rounded-t-3xl bg-felt-50/90 p-5 lg:inset-x-auto lg:top-4 lg:bottom-4 lg:left-4 lg:h-auto lg:w-[26rem] lg:rounded-3xl">
        <div className="hidden h-7 w-2/3 rounded-lg bg-sand-200 lg:block" />
        <div className="mt-3 hidden h-4 w-5/6 rounded bg-sand-200 lg:block" />
        <div className="mt-2 h-13 rounded-2xl bg-sand-200 lg:mt-6" />
        <div className="mt-5 h-28 rounded-2xl bg-sand-200/70" />
      </div>
      <div className="absolute top-4 right-4 h-24 w-11 animate-pulse rounded-2xl bg-felt-50/90" />
    </div>
  );
}

// MapLibre needs the browser (WebGL, window), so the explorer renders client-side only.
const WorldExplorer = dynamic(() => import("./world-explorer").then((m) => m.WorldExplorer), {
  ssr: false,
  loading: ExplorerSkeleton,
});

export function ExplorerLoader({ featured }: { featured: FeaturedDestination[] }) {
  return <WorldExplorer featured={featured} />;
}

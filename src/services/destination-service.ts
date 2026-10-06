import { destinations } from "@/data/destinations";
import type { Destination, DestinationSummary } from "@/types/destination";

/**
 * Destination service — the only module that touches destination data.
 * Swap the bodies for FastAPI calls (`GET /destinations`) in Phase 2.
 */

function toSummary(destination: Destination): DestinationSummary {
  return {
    id: destination.id,
    slug: destination.slug,
    name: destination.name,
    region: destination.region,
    tagline: destination.tagline,
    summary: destination.summary,
    image: destination.image,
    bestSeasons: destination.bestSeasons,
  };
}

export async function getDestinations(): Promise<DestinationSummary[]> {
  return destinations.map(toSummary);
}

export async function getFeaturedDestinations(): Promise<DestinationSummary[]> {
  return destinations.filter((d) => d.featured).map(toSummary);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  return destinations.find((d) => d.slug === slug) ?? null;
}

export async function getDestinationSlugs(): Promise<string[]> {
  return destinations.map((d) => d.slug);
}

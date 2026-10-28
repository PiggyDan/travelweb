import { destinationCoordinates } from "@/data/destination-coordinates";
import type { FeaturedDestination } from "@/types/explorer";
import { getDestinations } from "./destination-service";

/** Our Mongolia destinations that have a map pin, for the world explorer. */
export async function getMapHighlights(): Promise<FeaturedDestination[]> {
  const destinations = await getDestinations();
  return destinations.flatMap((destination) => {
    const pin = destinationCoordinates[destination.slug];
    if (!pin) return [];
    return [
      {
        slug: destination.slug,
        name: destination.name,
        region: destination.region,
        tagline: destination.tagline,
        lat: pin.lat,
        lon: pin.lon,
        approximate: true,
        image: { src: destination.image.src, alt: destination.image.alt },
      },
    ];
  });
}

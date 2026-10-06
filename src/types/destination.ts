import type { ImageAsset, Season } from "./common";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  /** Administrative or geographic region, e.g. "South Gobi Province". */
  region: string;
  tagline: string;
  /** Short description for cards and meta descriptions. */
  summary: string;
  /** Long-form description paragraphs for the detail page. */
  description: string[];
  image: ImageAsset;
  gallery: ImageAsset[];
  highlights: string[];
  bestSeasons: Season[];
  /** Human-readable best months, e.g. "June – September". */
  bestMonths: string;
  idealDuration: string;
  featured: boolean;
}

export type DestinationSummary = Pick<
  Destination,
  "id" | "slug" | "name" | "region" | "tagline" | "summary" | "image" | "bestSeasons"
>;

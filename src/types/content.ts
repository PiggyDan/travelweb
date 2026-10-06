import type { ImageAsset, Money, Season } from "./common";

/** One scene of the scroll-driven home hero. */
export interface HeroChapter {
  /** Large title shown as the scene passes, e.g. "Khuvsgul Lake". */
  label: string;
  /** Short line above it, e.g. "High summer · The north". */
  caption: string;
  image: ImageAsset;
}

/** A clip scrubbed by the home hero's scroll, in place of the chapter photos. */
export interface HeroVideo {
  mp4: string;
  webm?: string;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: ImageAsset;
}

/**
 * A guest review. The backend will call this `Review`; it is linked to a
 * customer and (optionally) a tour. `isPlaceholder` must be false for every
 * review shown in production.
 */
export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorCountry: string;
  tourTitle: string;
  tourSlug?: string;
  /** YYYY-MM */
  travelMonth: string;
  rating: 1 | 2 | 3 | 4 | 5;
  isPlaceholder: boolean;
}

export type BlogCategory = "Planning" | "Culture" | "Packing" | "Festivals";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  readingMinutes: number;
  image: ImageAsset;
  body: BlogSection[];
}

export interface BlogSection {
  heading?: string;
  paragraphs: string[];
}

export interface Festival {
  id: string;
  slug: string;
  name: string;
  /** Human-readable timing, e.g. "11 – 15 July, every year". */
  timing: string;
  location: string;
  summary: string;
  image: ImageAsset;
  relatedTourSlug?: string;
}

export type GalleryCategory = "Landscapes" | "Nomadic life" | "Festivals" | "Camps & stays";

export interface GalleryImage {
  id: string;
  image: ImageAsset;
  caption: string;
  category: GalleryCategory;
}

export interface SeasonGuide {
  season: Season;
  months: string;
  temperature: string;
  summary: string;
  bestFor: string[];
  image: ImageAsset;
}

export interface GuestHouseRoom {
  id: string;
  name: string;
  description: string;
  sleeps: number;
  priceFrom: Money;
  features: string[];
}

export interface GuestHouse {
  name: string;
  tagline: string;
  intro: string[];
  address: string;
  heroImage: ImageAsset;
  images: ImageAsset[];
  rooms: GuestHouseRoom[];
  amenities: string[];
}

export interface TravelInfoSection {
  id: string;
  title: string;
  paragraphs: string[];
  tips?: string[];
}

export interface BrandPillar {
  id: string;
  title: string;
  description: string;
}

export interface FeaturedStory {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: ImageAsset;
}

export interface LegalDocument {
  id: "booking-terms" | "privacy";
  title: string;
  summary: string;
  /** ISO date, YYYY-MM-DD. */
  updatedAt: string;
  sections: { heading: string; paragraphs: string[] }[];
}

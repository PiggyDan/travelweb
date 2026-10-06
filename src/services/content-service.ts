import { blogPosts } from "@/data/blog";
import { brandPillars, featuredStory } from "@/data/brand";
import { experiences } from "@/data/experiences";
import { faqGroups } from "@/data/faqs";
import { festivals } from "@/data/festivals";
import { galleryImages } from "@/data/gallery";
import { guestHouse } from "@/data/guest-house";
import { images } from "@/data/images";
import { legalDocuments } from "@/data/legal";
import { seasonGuides } from "@/data/seasons";
import { testimonials } from "@/data/testimonials";
import { travelInfoSections } from "@/data/travel-info";
import type { FaqGroup, ImageAsset } from "@/types/common";
import type {
  BlogPost,
  BrandPillar,
  Experience,
  FeaturedStory,
  Festival,
  GalleryImage,
  GuestHouse,
  HeroChapter,
  HeroVideo,
  LegalDocument,
  SeasonGuide,
  Testimonial,
  TravelInfoSection,
} from "@/types/content";

/**
 * Editorial content service (experiences, journal, testimonials, FAQs, …).
 * In Phase 2 these map to CMS / FastAPI endpoints with the same signatures.
 */

export async function getExperiences(): Promise<Experience[]> {
  return experiences;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

export async function getJournalPosts(limit?: number): Promise<BlogPost[]> {
  const sorted = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getJournalPostBySlug(slug: string): Promise<BlogPost | null> {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export async function getFaqGroups(): Promise<FaqGroup[]> {
  return faqGroups;
}

export async function getFestivals(): Promise<Festival[]> {
  return festivals;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return galleryImages;
}

export async function getSeasonGuides(): Promise<SeasonGuide[]> {
  return seasonGuides;
}

export async function getGuestHouse(): Promise<GuestHouse> {
  return guestHouse;
}

export async function getTravelInfoSections(): Promise<TravelInfoSection[]> {
  return travelInfoSections;
}

export async function getBrandPillars(): Promise<BrandPillar[]> {
  return brandPillars;
}

export async function getFeaturedStory(): Promise<FeaturedStory> {
  return featuredStory;
}

export async function getLegalDocument(id: LegalDocument["id"]): Promise<LegalDocument> {
  return legalDocuments[id];
}

/** Every registered photo with attribution, for the credits list. */
export async function getImageCredits(): Promise<ImageAsset[]> {
  return Object.values(images).filter((image) => image.credit);
}

/**
 * Scenes for the scroll-driven home hero. When `video` is set its playhead
 * follows the scroll instead (the first chapter's photo is the poster); the
 * chapter titles still play over it.
 */
export async function getHomeHeroMedia(): Promise<{ chapters: HeroChapter[]; video?: HeroVideo }> {
  return {
    // A year in one scroll: green summer steppe through to deep winter.
    chapters: [
      { label: "Welcome to Mongolia", caption: "Summer · Gorkhi-Terelj", image: images.tereljValley },
      { label: "Khuvsgul Lake", caption: "High summer · The north", image: images.khuvsgulOpenWater },
      { label: "Khongoryn Els", caption: "Late summer · The Gobi", image: images.gobiDuneHikers },
      { label: "Altai Mountains", caption: "Autumn · First snow in the west", image: images.altaiShiveetKhairkhan },
      { label: "Mongolian Winter", caption: "Winter · A nomad family moves camp", image: images.nomadsWinterMove },
    ],
    // Drop a clip into public/videos/ and uncomment to scrub video instead:
    // video: { mp4: "/videos/home-hero.mp4", webm: "/videos/home-hero.webm" },
  };
}

/** Named images used directly by page heroes. */
export async function getPageImages() {
  return {
    homeHero: images.gobiDuneHikers,
    intro: images.tereljSky,
    finalCta: images.tereljValley,
    destinationsHero: images.altaiGlacier,
    toursHero: images.gobiCamelCaravan,
    experiencesHero: images.horsesRiverCrossing,
    aboutHero: images.boyWithHorses,
    aboutStory: images.eagleHunterFamily,
    why: images.boyWithHorses,
    contactHero: images.khuvsgulOpenWater,
    galleryHero: images.gobiDuneSea,
    festivalsHero: images.naadamHorseRace,
    faqHero: images.tereljSky,
    travelInfoHero: images.centralSteppeClouds,
    tripPlannerHero: images.altaiLakeCamp,
    journalHero: images.gobiDunesWide,
    legalHero: images.easternLakeDusk,
    notFound: images.gobiDuneSea,
  } satisfies Record<string, ImageAsset>;
}

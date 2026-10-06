import type { Metadata } from "next";
import { DestinationMarquee } from "@/components/home/destination-marquee";
import { DestinationsSection } from "@/components/home/destinations-section";
import { ExperiencesSection } from "@/components/home/experiences-section";
import { FeaturedStorySection } from "@/components/home/featured-story-section";
import { FeaturedToursSection } from "@/components/home/featured-tours-section";
import { GuestHouseSection } from "@/components/home/guest-house-section";
import { IntroSection } from "@/components/home/intro-section";
import { JournalSection } from "@/components/home/journal-section";
import { ScrollHero } from "@/components/home/scroll-hero";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhySection } from "@/components/home/why-section";
import { CtaBanner } from "@/components/shared/cta-banner";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import {
  getBrandPillars,
  getExperiences,
  getFeaturedStory,
  getGuestHouse,
  getHomeHeroMedia,
  getJournalPosts,
  getPageImages,
  getTestimonials,
} from "@/services/content-service";
import { getFeaturedDestinations } from "@/services/destination-service";
import { getFeaturedTours } from "@/services/tour-service";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    ...buildPageMetadata({
      locale,
      path: routes.home,
      title: "Journeys across Mongolia",
      description: siteConfig.description,
    }),
    // The home page uses the layout's default (untemplated) title.
    title: { absolute: `${siteConfig.name} — Journeys across Mongolia` },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await resolveLocale(params);

  const [images, heroMedia, destinations, tours, pillars, experiences, story, guestHouse, testimonials, posts] =
    await Promise.all([
      getPageImages(),
      getHomeHeroMedia(),
      getFeaturedDestinations(),
      getFeaturedTours(6),
      getBrandPillars(),
      getExperiences(),
      getFeaturedStory(),
      getGuestHouse(),
      getTestimonials(),
      getJournalPosts(4),
    ]);

  return (
    <>
      <ScrollHero chapters={heroMedia.chapters} video={heroMedia.video} />
      <DestinationMarquee destinations={destinations} />
      <IntroSection image={images.intro} />
      <DestinationsSection destinations={destinations} />
      <FeaturedToursSection tours={tours} />
      <WhySection pillars={pillars} image={images.why} />
      <ExperiencesSection experiences={experiences} />
      <FeaturedStorySection story={story} />
      <GuestHouseSection guestHouse={guestHouse} />
      <TestimonialsSection testimonials={testimonials} />
      <JournalSection posts={posts} />
      <CtaBanner
        eyebrow="Begin"
        title={
          <>
            Your Mongolia
            <br />
            <span className="italic">starts here.</span>
          </>
        }
        description="Tell us how you like to travel. We'll answer with a journey shaped around you — no obligation, no templates."
        image={images.finalCta}
        primary={{ label: "Plan my journey", href: routes.tripPlanner }}
        secondary={{ label: "View all tours", href: routes.tours }}
      />
    </>
  );
}

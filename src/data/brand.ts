import type { BrandPillar, FeaturedStory } from "@/types/content";
import { images } from "./images";

/**
 * Brand storytelling content (Why Dolgion’s Tour, featured story, about page).
 * MOCK DATA — read only through `services/content-service.ts`.
 */

export const brandPillars: BrandPillar[] = [
  {
    id: "local",
    title: "Local expertise",
    description:
      "We are Mongolian, and so is everyone who guides and drives for us. We know which valley is green this year, which family is moving camp, and which road washed out last week.",
  },
  {
    id: "small",
    title: "Small groups",
    description:
      "Never more than twelve travellers, often far fewer. Small enough to be welcomed into a ger, to change plans when the weather does, and to hear yourself think.",
  },
  {
    id: "responsible",
    title: "Responsible travel",
    description:
      "Fair pay for herders and hosts, carefully chosen camps, no off-road driving across fragile pasture, and leaving every campsite as we found it.",
  },
  {
    id: "authentic",
    title: "Authentic encounters",
    description:
      "No staged performances. We introduce you to people we have known for years, and the time you share with them is real — sometimes messy, always memorable.",
  },
  {
    id: "flexible",
    title: "Flexible journeys",
    description:
      "Every itinerary is a starting point. Add a riding day, linger at a lake, skip a long drive. Private and custom journeys bend entirely around you.",
  },
];

export const featuredStory: FeaturedStory = {
  eyebrow: "A note on space",
  title: "The land without fences",
  paragraphs: [
    "Mongolia is one of the few places on Earth where land is still largely held in common. There are no fences across the steppe, no gates on the mountain passes — only the seasonal routes of herders that have shaped the grasslands for thousands of years.",
    "Travelling here changes how you see distance. A neighbour might live a day's ride away. A road is often only a suggestion. And the sky, the one the Mongols have called eternal for centuries, is the only boundary you will meet.",
  ],
  image: images.horsesRiverCrossing,
};

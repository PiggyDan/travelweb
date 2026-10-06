import type { Experience } from "@/types/content";
import { images } from "./images";

/** MOCK DATA — read only through `services/content-service.ts`. */
export const experiences: Experience[] = [
  {
    id: "exp-horse",
    slug: "horseback-riding",
    title: "Horseback Riding",
    summary: "Cross open valleys the way Mongolians always have.",
    description:
      "From an hour on a gentle herding horse to multi-day treks between camps, riding is how distance makes sense here. Our wranglers match horse to rider with care.",
    image: images.horsesRiverCrossing,
  },
  {
    id: "exp-family",
    slug: "nomadic-family-stay",
    title: "Nomadic Family Stay",
    summary: "Share the ger, the work and the dinner table.",
    description:
      "We work with a small circle of herding families who host guests in a separate ger. You join the day's rhythm — milking, herding, cooking — rather than watching it.",
    image: images.eagleHunterFamily,
  },
  {
    id: "exp-eagle",
    slug: "eagle-hunters",
    title: "Eagle Hunters",
    summary: "A living partnership between hunter and golden eagle.",
    description:
      "In the Altai, Kazakh families still train golden eagles to hunt in winter. Spend time with a family, ride out to the ridges, and attend the October festival.",
    image: images.eagleHunterWithEagle,
  },
  {
    id: "exp-ger",
    slug: "ger-camps",
    title: "Ger Camps",
    summary: "Felt walls, a wood stove, and stars through the roof ring.",
    description:
      "The ger is Mongolia's ingenious round home. Our chosen camps pair traditional gers with proper beds, hot showers and settings that justify the drive.",
    image: images.gobiGerCamp,
  },
  {
    id: "exp-gobi",
    slug: "gobi-adventures",
    title: "Gobi Adventures",
    summary: "Dunes, canyons and camel caravans.",
    description:
      "Climb singing dunes, hike ice-carved gorges and ride Bactrian camels across the plain. The Gobi is the most varied desert you are likely to meet.",
    image: images.gobiCamelCaravan,
  },
  {
    id: "exp-photo",
    slug: "photography",
    title: "Photography",
    summary: "Light, space and faces worth waiting for.",
    description:
      "Long golden hours, enormous skies and generous people. Photography journeys are timed for the light, with guides who understand when to wait.",
    image: images.altaiGlacier,
  },
  {
    id: "exp-hike",
    slug: "hiking",
    title: "Hiking",
    summary: "Valleys without trails, ridges without crowds.",
    description:
      "From gentle walks in Terelj to glacier approaches in the Altai, hiking in Mongolia means finding your own line across a landscape with no fences.",
    image: images.altaiValley,
  },
  {
    id: "exp-festival",
    slug: "festivals",
    title: "Festivals",
    summary: "Naadam, eagles, camels and the lunar new year.",
    description:
      "Mongolia's festivals are joyous, deeply rooted and rarely staged for visitors. We time journeys so you can be there — as a guest, not a spectator.",
    image: images.naadamHorseRace,
  },
];

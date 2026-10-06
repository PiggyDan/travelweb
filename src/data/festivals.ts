import type { Festival } from "@/types/content";
import { images } from "./images";

/**
 * MOCK DATA — read only through `services/content-service.ts`.
 * Festival dates shift year to year; confirm with organisers before publishing.
 */
export const festivals: Festival[] = [
  {
    id: "fst-naadam",
    slug: "naadam",
    name: "Naadam",
    timing: "Mid-July, every year",
    location: "Ulaanbaatar and across the country",
    summary:
      "Mongolia's national celebration of wrestling, archery and horse racing. Spectacular in the capital and wonderfully personal in the countryside.",
    image: images.naadamWrestlers,
    relatedTourSlug: "naadam-festival-journey",
  },
  {
    id: "fst-eagle",
    slug: "golden-eagle-festival",
    name: "Golden Eagle Festival",
    timing: "Early October",
    location: "Ulgii, Bayan-Ulgii Province",
    summary:
      "Kazakh eagle hunters ride in from across the Altai to compete in eagle-calling, horsemanship and traditional games.",
    image: images.eagleHunterPortrait,
    relatedTourSlug: "altai-eagle-hunters-journey",
  },
  {
    id: "fst-tsagaan-sar",
    slug: "tsagaan-sar",
    name: "Tsagaan Sar",
    timing: "January or February (lunar new year)",
    location: "Family homes nationwide",
    summary:
      "The 'White Moon' lunar new year, when families gather, elders are honoured and tables groan with buuz dumplings.",
    image: images.nomadsWinterMove,
    relatedTourSlug: "winter-nomad-experience",
  },
  {
    id: "fst-ice",
    slug: "khuvsgul-ice-festival",
    name: "Khuvsgul Ice Festival",
    timing: "Late February to early March",
    location: "Lake Khuvsgul",
    summary:
      "Horse-sled races, ice sculpture and skating on the frozen surface of the great northern lake.",
    image: images.winterForest,
  },
  {
    id: "fst-musicians",
    slug: "naadam-music",
    name: "Festival Music & Song",
    timing: "Throughout the summer festival season",
    location: "Festival stages across Mongolia",
    summary:
      "Morin khuur horsehead fiddles, long song and throat singing — the soundtrack of every Mongolian celebration.",
    image: images.naadamMusicians,
  },
];

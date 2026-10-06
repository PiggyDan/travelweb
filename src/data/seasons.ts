import type { SeasonGuide } from "@/types/content";
import { images } from "./images";

/** MOCK DATA — read only through `services/content-service.ts`. */
export const seasonGuides: SeasonGuide[] = [
  {
    season: "spring",
    months: "April – May",
    temperature: "-5 °C to 18 °C",
    summary: "Windy and changeable, with newborn animals in the herds and quiet roads.",
    bestFor: ["Gobi before the heat", "Young camels and foals", "Fewer travellers"],
    image: images.gobiCamelsGrazing,
  },
  {
    season: "summer",
    months: "June – August",
    temperature: "10 °C to 30 °C",
    summary: "Green pastures, full rivers, Naadam and the easiest travel of the year.",
    bestFor: ["Naadam festival", "Khuvsgul and central Mongolia", "Family stays"],
    image: images.ridersSteppe,
  },
  {
    season: "autumn",
    months: "September – October",
    temperature: "-5 °C to 20 °C",
    summary: "Golden larches, crisp light and the Golden Eagle Festival in the Altai.",
    bestFor: ["Photography", "Altai and eagle hunters", "Hiking"],
    image: images.altaiShiveetKhairkhan,
  },
  {
    season: "winter",
    months: "November – March",
    temperature: "-30 °C to -5 °C",
    summary: "Brilliant blue skies, frozen lakes and nomadic life at its most resilient.",
    bestFor: ["Tsagaan Sar", "Ice Festival", "Winter herding life"],
    image: images.winterRiver,
  },
];

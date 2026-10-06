import type { GalleryImage } from "@/types/content";
import { images } from "./images";

/** MOCK DATA — read only through `services/content-service.ts`. */
export const galleryImages: GalleryImage[] = [
  { id: "g-1", image: images.gobiDuneHikers, caption: "Dune crest, Khongoryn Els", category: "Landscapes" },
  { id: "g-2", image: images.eagleHunterWithEagle, caption: "Eagle hunter, Bayan-Ulgii", category: "Nomadic life" },
  { id: "g-3", image: images.khuvsgulShore, caption: "Larch shore, Lake Khuvsgul", category: "Landscapes" },
  { id: "g-4", image: images.naadamHorseRace, caption: "Naadam horse race", category: "Festivals" },
  { id: "g-5", image: images.gobiGerCamp, caption: "Morning stoves, Gobi ger camp", category: "Camps & stays" },
  { id: "g-6", image: images.altaiGlacier, caption: "Potanin Glacier, Tavan Bogd", category: "Landscapes" },
  { id: "g-7", image: images.horsesRiverCrossing, caption: "River crossing, western Mongolia", category: "Nomadic life" },
  { id: "g-8", image: images.orkhonWaterfall, caption: "Ulaan Tsutgalan, Orkhon Valley", category: "Landscapes" },
  { id: "g-9", image: images.naadamWrestlers, caption: "Wrestlers' eagle dance", category: "Festivals" },
  { id: "g-10", image: images.gerInterior, caption: "Inside a guest ger", category: "Camps & stays" },
  { id: "g-11", image: images.nomadsWinterMove, caption: "Moving camp in winter", category: "Nomadic life" },
  { id: "g-12", image: images.tereljTurtleRock, caption: "Turtle Rock, Terelj", category: "Landscapes" },
  { id: "g-13", image: images.boyWithHorses, caption: "Young rider, central steppe", category: "Nomadic life" },
  { id: "g-14", image: images.khuvsgulGerCamp, caption: "Lakeside camp near Khuvsgul", category: "Camps & stays" },
  { id: "g-15", image: images.erdeneZuuTemple, caption: "Erdene Zuu monastery", category: "Landscapes" },
  { id: "g-16", image: images.naadamMusicians, caption: "Festival musicians", category: "Festivals" },
  { id: "g-17", image: images.gobiCamelCaravan, caption: "Camel caravan below the dunes", category: "Nomadic life" },
  { id: "g-18", image: images.easternLakeDusk, caption: "Dusk on Khokh Nuur, eastern Mongolia", category: "Landscapes" },
];

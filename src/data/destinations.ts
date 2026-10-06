import type { Destination } from "@/types/destination";
import { images } from "./images";

/**
 * MOCK DATA — read only through `services/destination-service.ts`.
 * Shape matches the planned `GET /destinations` API response.
 */
export const destinations: Destination[] = [
  {
    id: "dst-gobi",
    slug: "gobi-desert",
    name: "Gobi Desert",
    region: "South Gobi Province",
    tagline: "Singing dunes, red cliffs and silence that rings.",
    summary:
      "Sweeping dunes, fossil-rich cliffs and camel herders who read the desert like a map. The Gobi is far more alive than its reputation.",
    description: [
      "The Gobi is not one desert but many: gravel plains that shimmer to the horizon, ice-filled canyons in midsummer, saxaul forests, and the great dune field of Khongoryn Els, where wind across the sand produces a low, unmistakable hum.",
      "Days here follow the light. Mornings are for walking the dunes before the heat, afternoons for camel herding families and long, slow tea, evenings for watching the cliffs at Bayanzag turn the colour of embers. Nights belong to the stars.",
    ],
    image: images.gobiDunes,
    gallery: [images.gobiCamelCaravan, images.gobiDuneHikers, images.gobiGerCamp, images.gobiCamelsGrazing],
    highlights: [
      "Climb the 300-metre dunes of Khongoryn Els at sunset",
      "Ride Bactrian camels with a herding family",
      "Walk the dinosaur-fossil cliffs of Bayanzag",
      "Hike the narrow gorge of Yolyn Am in the Gurvan Saikhan range",
    ],
    bestSeasons: ["spring", "summer", "autumn"],
    bestMonths: "May – early October",
    idealDuration: "5 – 8 days",
    featured: true,
  },
  {
    id: "dst-khuvsgul",
    slug: "khuvsgul-lake",
    name: "Khuvsgul Lake",
    region: "Khuvsgul Province",
    tagline: "The Blue Pearl, ringed by larch and reindeer country.",
    summary:
      "A vast, clear alpine lake bordered by taiga forest and mountain meadows — Mongolia's coolest, greenest corner.",
    description: [
      "Khuvsgul holds a remarkable share of Mongolia's fresh water, so clear you can see stones metres below the surface. Its shores are lined with larch forest and wildflower meadows where yak herders summer their animals.",
      "Travel here is quiet and outdoors: kayaking in the morning calm, riding along the eastern shore, hiking to ridgelines above the water, and evenings by the stove in a lakeside ger. Further north, Tsaatan reindeer herders live in the taiga much as their families always have.",
    ],
    image: images.khuvsgulShore,
    gallery: [images.khuvsgulOpenWater, images.khuvsgulDeadTrees, images.khuvsgulGerCamp],
    highlights: [
      "Kayak or row along the clear northern bays",
      "Ride through larch forest to remote shoreline camps",
      "Meet yak herders in the summer pastures",
      "Join the winter Ice Festival on the frozen lake",
    ],
    bestSeasons: ["summer", "winter"],
    bestMonths: "June – September, or February – March for ice",
    idealDuration: "4 – 7 days",
    featured: true,
  },
  {
    id: "dst-altai",
    slug: "altai-mountains",
    name: "Altai Mountains",
    region: "Bayan-Ulgii Province",
    tagline: "Glaciers, eagle hunters and Mongolia's highest peaks.",
    summary:
      "Snow-capped summits, turquoise lakes and Kazakh eagle-hunting families in the far west — Mongolia at its wildest.",
    description: [
      "In the far west, the Altai rise to more than 4,000 metres around the Tavan Bogd massif, where the Potanin Glacier pours down between five sacred peaks. Below, rivers braid through wide valleys dotted with the white gers of Kazakh herding families.",
      "This is the home of the eagle hunters, who train golden eagles to hunt fox in winter and celebrate the tradition each October. Expect long drives, big days on foot or horseback, and some of the most generous hospitality in the country.",
    ],
    image: images.altaiLakeCamp,
    gallery: [images.altaiGlacier, images.altaiValley, images.eagleHunterWithEagle, images.horsesRiverCrossing],
    highlights: [
      "Trek to the foot of the Potanin Glacier",
      "Stay with a Kazakh eagle-hunting family",
      "Camp beside the lakes of Khoton and Khurgan",
      "Attend the Golden Eagle Festival in early October",
    ],
    bestSeasons: ["summer", "autumn"],
    bestMonths: "June – early October",
    idealDuration: "8 – 12 days",
    featured: true,
  },
  {
    id: "dst-central",
    slug: "central-mongolia",
    name: "Central Mongolia",
    region: "Arkhangai & Tuv Provinces",
    tagline: "The rolling green heart of nomadic life.",
    summary:
      "Endless grassland, volcanic lakes and herding families on the move. If you picture Mongolia, you are probably picturing here.",
    description: [
      "Central Mongolia is the country's pastoral heartland: green rolling steppe, rivers lined with willow, extinct volcanoes and hot springs. Herding families move between seasonal pastures here, and visitors are welcomed with salty milk tea and airag.",
      "It is the ideal first taste of Mongolia, reachable within a day of Ulaanbaatar yet utterly removed from it. Takhi — the world's last truly wild horse — graze the hills of Khustai National Park on the way west.",
    ],
    image: images.centralSteppeClouds,
    gallery: [images.ridersSteppe, images.boyWithHorses, images.horsesMeadow],
    highlights: [
      "Watch wild Takhi horses at dusk in Khustai National Park",
      "Stay with a nomadic herding family",
      "Climb the crater rim of Khorgo volcano",
      "Soak in the Tsenkher hot springs",
    ],
    bestSeasons: ["summer", "autumn"],
    bestMonths: "June – September",
    idealDuration: "4 – 7 days",
    featured: true,
  },
  {
    id: "dst-orkhon",
    slug: "orkhon-valley",
    name: "Orkhon Valley",
    region: "Uvurkhangai Province",
    tagline: "Where empires rose, along a river of waterfalls.",
    summary:
      "A UNESCO-listed cultural landscape of ancient capitals, monasteries and waterfalls — the historical soul of the steppe.",
    description: [
      "For more than two thousand years the Orkhon Valley has been the seat of steppe empires. Kharkhorin, the thirteenth-century capital, lies here, and the walls of Erdene Zuu monastery — built partly from its stones — still enclose the valley's oldest surviving temples.",
      "Upstream, the river drops over the basalt lip of the Ulaan Tsutgalan waterfall into a dark gorge. Families graze yak and horses across the valley floor, and the riding here is some of the best in the country.",
    ],
    image: images.orkhonWaterfall,
    gallery: [images.erdeneZuuWalls, images.erdeneZuuTemple, images.mongolianHorse],
    highlights: [
      "Explore Erdene Zuu, Mongolia's oldest surviving monastery",
      "Visit the site of Kharkhorin, the imperial capital",
      "Hike to the Ulaan Tsutgalan waterfall",
      "Ride the upper Orkhon with local horsemen",
    ],
    bestSeasons: ["summer", "autumn"],
    bestMonths: "June – September",
    idealDuration: "3 – 5 days",
    featured: true,
  },
  {
    id: "dst-terelj",
    slug: "terelj",
    name: "Terelj",
    region: "Gorkhi-Terelj National Park",
    tagline: "Granite, forest and river — an hour from the capital.",
    summary:
      "Granite tors, pine forest and alpine meadows just beyond Ulaanbaatar. The perfect first or last night under Mongolian skies.",
    description: [
      "Gorkhi-Terelj National Park begins barely an hour from Ulaanbaatar, yet the city disappears completely. Granite outcrops — Turtle Rock the most famous — rise from meadows and larch forest along the Tuul and Terelj rivers.",
      "It is ideal for a short escape before or after a longer journey: gentle hikes, riding with local herders, a hilltop meditation temple, and a comfortable ger camp under remarkably dark skies for somewhere so close to the capital.",
    ],
    image: images.tereljValley,
    gallery: [images.tereljTurtleRock, images.horsesMeadow, images.gerInterior],
    highlights: [
      "Walk up to the Aryabal meditation temple",
      "Ride along the Terelj river with local herders",
      "See Turtle Rock and the granite tors",
      "Sleep in a ger camp an hour from the city",
    ],
    bestSeasons: ["spring", "summer", "autumn", "winter"],
    bestMonths: "All year",
    idealDuration: "1 – 3 days",
    featured: true,
  },
  {
    id: "dst-eastern",
    slug: "eastern-mongolia",
    name: "Eastern Mongolia",
    region: "Khentii, Dornod & Sukhbaatar Provinces",
    tagline: "The quiet frontier of grassland and gazelles.",
    summary:
      "Some of the last great intact grasslands on Earth, the homeland of Chinggis Khaan, and herds of gazelle moving to the horizon.",
    description: [
      "Eastern Mongolia is the least visited and perhaps the most elemental part of the country: an ocean of grass that runs unbroken to the horizon, wetlands loud with cranes, and herds of Mongolian gazelle that can number in the tens of thousands.",
      "Khentii, the birthplace of Chinggis Khaan, holds sacred mountains and historic sites tied to his life. Travel here is for those who want space, wildlife and the feeling of having a landscape almost entirely to themselves.",
    ],
    image: images.easternLakeDusk,
    gallery: [images.easternLakeDusk],
    highlights: [
      "Watch gazelle herds on the eastern steppe",
      "Visit sites tied to the life of Chinggis Khaan in Khentii",
      "Birdwatch cranes and waterfowl in the eastern wetlands",
      "Camp under some of the darkest skies in Asia",
    ],
    bestSeasons: ["summer", "autumn"],
    bestMonths: "June – September",
    idealDuration: "6 – 10 days",
    featured: true,
  },
];

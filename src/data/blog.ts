import type { BlogPost } from "@/types/content";
import { images } from "./images";

/** MOCK DATA — read only through `services/content-service.ts`. */
export const blogPosts: BlogPost[] = [
  {
    id: "post-best-time",
    slug: "best-time-to-visit-mongolia",
    title: "The Best Time to Visit Mongolia",
    excerpt:
      "Summer is the classic choice, but each season has its own Mongolia. Here is how to choose, month by month.",
    category: "Planning",
    publishedAt: "2026-03-12",
    readingMinutes: 6,
    image: images.tereljSky,
    body: [
      {
        paragraphs: [
          "Mongolia has a short, glorious summer and a long, bright winter, with brief shoulder seasons in between. There is no wrong time to come — only different journeys.",
        ],
      },
      {
        heading: "June to August: the green season",
        paragraphs: [
          "Pastures are green, rivers run full and herding families are in their summer camps. This is the easiest time to travel and the most popular, with Naadam in mid-July as the highlight. Expect warm days, cool nights and the occasional dramatic thunderstorm.",
        ],
      },
      {
        heading: "September and October: golden light",
        paragraphs: [
          "Larch forests turn gold, the air sharpens and the crowds thin. It is our favourite season for photography and for the Altai, where the Golden Eagle Festival is held in early October.",
        ],
      },
      {
        heading: "November to March: the blue winter",
        paragraphs: [
          "Very cold, but almost always sunny. Winter is for those who want to see nomadic life at its most resilient, frozen lakes and rivers, and festivals such as Tsagaan Sar and the Khuvsgul Ice Festival.",
        ],
      },
      {
        heading: "April and May: the quiet season",
        paragraphs: [
          "Spring is windy and changeable, but it is also the season of newborn animals in the herds and empty roads. The Gobi is pleasant before the summer heat.",
        ],
      },
    ],
  },
  {
    id: "post-gobi-packing",
    slug: "what-to-pack-for-the-gobi",
    title: "What to Pack for the Gobi",
    excerpt:
      "Hot days, cold nights and fine sand that gets everywhere. A practical list from guides who spend their summers in the desert.",
    category: "Packing",
    publishedAt: "2026-04-02",
    readingMinutes: 5,
    image: images.gobiDuneRidge,
    body: [
      {
        paragraphs: [
          "The Gobi asks you to prepare for two climates in a single day. Midday can be hot and bright; after sunset temperatures drop quickly, especially in spring and autumn.",
        ],
      },
      {
        heading: "Layers, not bulk",
        paragraphs: [
          "Pack breathable long sleeves for sun protection, a warm fleece or light down jacket for evenings, and a windproof outer layer. A wide-brimmed hat and a buff for dusty drives are invaluable.",
        ],
      },
      {
        heading: "Feet and eyes",
        paragraphs: [
          "Light hiking shoes are better than heavy boots. Bring good sunglasses, lip balm with SPF and a small pack of wet wipes. Keep cameras in a sealed bag when the wind picks up.",
        ],
      },
    ],
  },
  {
    id: "post-naadam",
    slug: "understanding-naadam-festival",
    title: "Understanding Mongolia's Naadam Festival",
    excerpt:
      "Wrestling, archery and horse racing — the three games of Naadam, and how to enjoy them as a respectful guest.",
    category: "Festivals",
    publishedAt: "2026-05-20",
    readingMinutes: 7,
    image: images.naadamWrestlers,
    body: [
      {
        paragraphs: [
          "Naadam is Mongolia's national festival, celebrated every July in Ulaanbaatar and in towns and villages across the country. Its heart is the 'three games of men' — although women compete in archery and children ride in the horse races.",
        ],
      },
      {
        heading: "The three games",
        paragraphs: [
          "Wrestlers compete in heats with no weight classes; the winner of each bout performs the eagle dance. Archers shoot at small targets called surs from long distances while judges sing out the results. Horse races run across open country over distances of up to around 30 kilometres, with young jockeys riding horses grouped by age.",
        ],
      },
      {
        heading: "Ulaanbaatar or the countryside?",
        paragraphs: [
          "The national Naadam opening ceremony is spectacular. Rural Naadams are smaller and more personal — you might be invited into a family's tent for khuushuur, the festival's fried mutton pastries. We recommend experiencing both.",
        ],
      },
    ],
  },
  {
    id: "post-first-timer",
    slug: "first-timers-guide-to-mongolia",
    title: "A First-Timer's Guide to Mongolia",
    excerpt:
      "Distances, roads, ger etiquette and what a day on the road really looks like. Everything we wish first-time visitors knew.",
    category: "Culture",
    publishedAt: "2026-06-18",
    readingMinutes: 8,
    image: images.ridersSteppe,
    body: [
      {
        paragraphs: [
          "Mongolia is larger than Western Europe, with very few paved roads beyond the main routes. Distances are measured in hours rather than kilometres, and part of the experience is the journey itself.",
        ],
      },
      {
        heading: "Visiting a ger",
        paragraphs: [
          "Step over the threshold rather than on it, move clockwise inside, and accept offered food or tea with your right hand (supporting the elbow with your left is a courteous touch). It is polite to at least taste what you are given.",
        ],
      },
      {
        heading: "Staying connected",
        paragraphs: [
          "Mobile coverage is surprisingly good near towns but disappears in between. Download maps and entertainment before you go, and enjoy the time offline.",
        ],
      },
    ],
  },
];

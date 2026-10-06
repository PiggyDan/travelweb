import type { TravelInfoSection } from "@/types/content";

/**
 * MOCK DATA — read only through `services/content-service.ts`.
 * Entry, health and money rules change; content here is general guidance and
 * must be reviewed against official sources before launch.
 */
export const travelInfoSections: TravelInfoSection[] = [
  {
    id: "visas",
    title: "Visas & entry",
    paragraphs: [
      "Many nationalities can visit Mongolia visa-free for short stays, while others need a visa or e-visa arranged in advance. Requirements change, so always confirm with the Mongolian embassy or the official e-visa portal for your passport.",
      "Your passport should be valid for at least six months after arrival.",
    ],
    tips: ["Check requirements as soon as you book", "Carry a printed copy of your itinerary"],
  },
  {
    id: "getting-there",
    title: "Getting there",
    paragraphs: [
      "Most travellers arrive at Chinggis Khaan International Airport, about an hour from central Ulaanbaatar. There are direct flights from several Asian and European hubs, and the Trans-Mongolian railway links Ulaanbaatar with Beijing and Russia.",
    ],
    tips: ["Airport transfers are included in all our journeys"],
  },
  {
    id: "money",
    title: "Money",
    paragraphs: [
      "The local currency is the tögrög (MNT). Cards are widely accepted in Ulaanbaatar, but cash is essential in the countryside. ATMs are available in the capital and in provincial centres.",
    ],
    tips: ["Bring some clean US dollar notes as backup", "Small notes are useful for local purchases"],
  },
  {
    id: "health",
    title: "Health & insurance",
    paragraphs: [
      "Consult a travel health clinic six to eight weeks before departure for current vaccination advice. Medical facilities are limited outside Ulaanbaatar, so comprehensive insurance including emergency evacuation is required on all our journeys.",
    ],
  },
  {
    id: "connectivity",
    title: "Staying connected",
    paragraphs: [
      "Local SIM cards are inexpensive and coverage is good around towns, but expect long stretches without signal on the road. Most ger camps have electricity for charging in the evenings.",
    ],
    tips: ["Download offline maps before you leave Ulaanbaatar", "Bring a power bank"],
  },
  {
    id: "etiquette",
    title: "Culture & etiquette",
    paragraphs: [
      "Mongolians are famously hospitable. When visiting a ger, step over the threshold, move clockwise inside, and accept tea or food with your right hand. Do not point your feet at the hearth or lean on the central pillars.",
    ],
    tips: ["Ask before photographing people", "A small gift from home is always appreciated"],
  },
];

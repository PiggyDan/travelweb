import type { GuestHouse } from "@/types/content";
import { images } from "./images";

/**
 * MOCK DATA — read only through `services/content-service.ts`.
 * PLACEHOLDER: room names, rates and photos must be replaced with the real
 * guest house details. The images below are stand-ins (no photos of the
 * actual property exist in the repository yet).
 */
export const guestHouse: GuestHouse = {
  name: "Dolgion’s Tour Guest House",
  tagline: "A calm place to land, and to come back to.",
  intro: [
    "Our guest house in central Ulaanbaatar is where most Dolgion’s Tour journeys begin and end. Arrive after a long flight to a quiet room, a hot shower and a team that already knows your plans.",
    "Before your journey, use it to rest, meet your guide and leave luggage you will not need on the road. Afterwards, come back to a proper bed, laundry and a final evening in the city.",
  ],
  address: "Central Ulaanbaatar, Mongolia (exact address to be confirmed)",
  heroImage: images.ulaanbaatarCity,
  images: [images.gerInterior, images.ulaanbaatarCity],
  rooms: [
    {
      id: "room-steppe",
      name: "Steppe Double",
      description: "A calm double room with felt textiles and blackout curtains.",
      sleeps: 2,
      priceFrom: { amount: 65, currency: "USD" },
      features: ["Private bathroom", "Queen bed", "Work desk"],
    },
    {
      id: "room-felt",
      name: "Felt Twin",
      description: "Two single beds, ideal for friends travelling together.",
      sleeps: 2,
      priceFrom: { amount: 60, currency: "USD" },
      features: ["Private bathroom", "Two single beds", "City view"],
    },
    {
      id: "room-family",
      name: "Family Suite",
      description: "A larger room with a separate sleeping nook for children.",
      sleeps: 4,
      priceFrom: { amount: 95, currency: "USD" },
      features: ["Private bathroom", "Double + two singles", "Sitting area"],
    },
  ],
  amenities: [
    "Breakfast included",
    "Free Wi-Fi",
    "Luggage storage while you travel",
    "Laundry service",
    "Airport transfers",
    "Trip briefings with your guide",
    "SIM cards and currency exchange help",
    "Quiet garden courtyard",
  ],
};

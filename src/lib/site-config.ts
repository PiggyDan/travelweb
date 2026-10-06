/**
 * Site-wide configuration.
 *
 * PLACEHOLDERS: the domain, email, phone, address and social URLs below are
 * not real yet. Replace them before launch (the site URL can also be set via
 * the NEXT_PUBLIC_SITE_URL environment variable).
 */
export const siteConfig = {
  name: "Eternal Sky Tour",
  shortName: "Eternal Sky",
  tagline: "Journeys across Mongolia, guided by people who call it home.",
  description:
    "Eternal Sky Tour designs small-group, private and tailor-made journeys across Mongolia — from the Gobi Desert and Altai Mountains to Lake Khuvsgul — led by Mongolian guides.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.eternalskytour.com").replace(/\/$/, ""),
  ogImage: {
    src: "/images/gobi/dune-hikers.jpg",
    width: 1920,
    height: 1275,
    alt: "Two travellers on the crest of a vast sand dune in the Gobi Desert",
  },
  contact: {
    email: "hello@eternalskytour.com",
    phone: "+976 0000 0000",
    address: "Ulaanbaatar, Mongolia",
    hours: "Mon – Sat, 09:00 – 18:00 (UTC+8)",
  },
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
  },
} as const;

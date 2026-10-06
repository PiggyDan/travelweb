import type { Testimonial } from "@/types/content";

/**
 * ⚠️ PLACEHOLDER TESTIMONIALS — NOT REAL GUEST REVIEWS.
 *
 * These are illustrative only, to show the layout. Every entry is flagged
 * `isPlaceholder: true`. Replace them with genuine, verifiable reviews (with
 * the guest's permission) before launch, and do not emit Review structured
 * data for placeholder content.
 */
export const testimonials: Testimonial[] = [
  {
    id: "tst-1",
    quote:
      "We came for the landscapes and left talking about the people. Our guide knew every family along the route, and the night we spent helping round up the horses is something our children still talk about.",
    authorName: "Sample Guest A.",
    authorCountry: "United Kingdom",
    tourTitle: "Nomadic Heart of Mongolia",
    tourSlug: "nomadic-heart-of-mongolia",
    travelMonth: "2025-07",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "tst-2",
    quote:
      "Every detail was handled quietly and well, which left us free to simply be there. The dunes at dawn were worth the whole journey.",
    authorName: "Sample Guest B.",
    authorCountry: "Australia",
    tourTitle: "Gobi Desert Expedition",
    tourSlug: "gobi-desert-expedition",
    travelMonth: "2025-09",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "tst-3",
    quote:
      "Sitting in an eagle hunter's home while the wind howled outside, drinking tea and listening to his grandfather's stories — that is not something you can buy off a shelf.",
    authorName: "Sample Guest C.",
    authorCountry: "Germany",
    tourTitle: "Altai Eagle Hunters Journey",
    tourSlug: "altai-eagle-hunters-journey",
    travelMonth: "2025-10",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "tst-4",
    quote:
      "Small group, unhurried pace, and real care for the places we visited. It felt like travelling with friends who happened to know the whole country.",
    authorName: "Sample Guest D.",
    authorCountry: "Japan",
    tourTitle: "Mongolia Grand Circuit",
    tourSlug: "mongolia-grand-circuit",
    travelMonth: "2025-08",
    rating: 5,
    isPlaceholder: true,
  },
];

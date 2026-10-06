import type { LegalDocument } from "@/types/content";

/**
 * ⚠️ DRAFT LEGAL TEXT — starter structure only. These pages must be written
 * or reviewed by a qualified professional for Mongolian and destination-market
 * law before launch.
 */
export const legalDocuments: Record<LegalDocument["id"], LegalDocument> = {
  "booking-terms": {
    id: "booking-terms",
    title: "Booking Terms",
    summary: "The conditions that apply when you reserve a journey with Eternal Sky Tour.",
    updatedAt: "2026-10-01",
    sections: [
      {
        heading: "Making a reservation",
        paragraphs: [
          "A reservation is confirmed once we have accepted your booking in writing and received any required deposit. Until then, places and prices are not guaranteed.",
        ],
      },
      {
        heading: "Prices and payment",
        paragraphs: [
          "Prices are quoted per person in US dollars. The balance is due before departure on the date stated in your confirmation.",
        ],
      },
      {
        heading: "Changes and cancellations",
        paragraphs: [
          "If you need to change or cancel your journey, contact us as early as possible. Cancellation charges depend on how close to departure the cancellation is made and will be set out in your confirmation.",
        ],
      },
      {
        heading: "Travel insurance",
        paragraphs: ["Comprehensive travel insurance including emergency evacuation is a condition of travelling with us."],
      },
    ],
  },
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    summary: "How we collect, use and protect the personal information you share with us.",
    updatedAt: "2026-10-01",
    sections: [
      {
        heading: "What we collect",
        paragraphs: [
          "When you send an enquiry or book a journey we collect the details you provide, such as your name, contact information, travel dates and preferences.",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: [
          "We use your information only to respond to you, plan and operate your journey, and — if you opt in — to send occasional news. We never sell personal data.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You can ask to see, correct or delete the personal information we hold about you at any time by contacting us.",
        ],
      },
    ],
  },
};

import type { FaqGroup } from "@/types/common";

/** MOCK DATA — read only through `services/content-service.ts`. */
export const faqGroups: FaqGroup[] = [
  {
    id: "planning",
    title: "Planning your journey",
    items: [
      {
        id: "faq-when",
        question: "When is the best time to visit Mongolia?",
        answer:
          "June to September is the classic season, with green pastures and Naadam in July. September and October bring golden colours and the Golden Eagle Festival. Winter is very cold but bright and offers a rare view of nomadic life.",
      },
      {
        id: "faq-how-long",
        question: "How many days do I need?",
        answer:
          "Seven to ten days lets you combine one major region with Ulaanbaatar. Two weeks or more allows the Gobi and central Mongolia together. Mongolia is vast, so we always prefer fewer places, seen properly.",
      },
      {
        id: "faq-fitness",
        question: "Do I need to be very fit?",
        answer:
          "Most journeys suit anyone in reasonable health who is comfortable with long days on rough roads. Each tour has an activity level, and private journeys can be adapted.",
      },
    ],
  },
  {
    id: "on-the-road",
    title: "On the road",
    items: [
      {
        id: "faq-guides",
        question: "Who are your guides?",
        answer:
          "Our guides and drivers are Mongolian, many from the regions they guide in. They speak fluent English and are trained in first aid.",
      },
      {
        id: "faq-food",
        question: "Can you cater for dietary requirements?",
        answer:
          "Yes. Mongolian cuisine is meat-heavy, but our camps and cooks regularly prepare vegetarian meals. Tell us about allergies or requirements when you book.",
      },
      {
        id: "faq-bathrooms",
        question: "What are the bathroom facilities like?",
        answer:
          "Ger camps have hot showers and flush toilets in shared blocks. Family stays and expedition camps are simpler, with outdoor long-drop toilets.",
      },
    ],
  },
  {
    id: "booking",
    title: "Booking & payment",
    items: [
      {
        id: "faq-deposit",
        question: "How do I reserve a place?",
        answer:
          "Send us an enquiry and we will confirm availability and answer questions. Online booking and payment will be available soon; until then we confirm reservations personally.",
      },
      {
        id: "faq-insurance",
        question: "Is travel insurance required?",
        answer:
          "Yes. Comprehensive travel insurance including emergency evacuation is required for all journeys.",
      },
      {
        id: "faq-private",
        question: "Can any group tour be run privately?",
        answer:
          "Almost always. Private versions cost more for small parties but let you choose your dates and pace.",
      },
    ],
  },
];

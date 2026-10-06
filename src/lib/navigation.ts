import { routes } from "./routes";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const mainNavigation: readonly NavItem[] = [
  { label: "Destinations", href: routes.destinations },
  { label: "Tours", href: routes.tours },
  { label: "Experiences", href: routes.experiences },
  { label: "Guest House", href: routes.guestHouse },
  { label: "Travel Info", href: routes.travelInformation },
  { label: "About", href: routes.about },
];

export const secondaryNavigation: readonly NavItem[] = [
  { label: "Festivals", href: routes.festivals },
  { label: "Gallery", href: routes.gallery },
  { label: "Journal", href: routes.journal },
  { label: "FAQ", href: routes.faq },
  { label: "Contact", href: routes.contact },
];

export const footerNavigation: readonly NavGroup[] = [
  {
    title: "Explore",
    items: [
      { label: "Destinations", href: routes.destinations },
      { label: "Tours", href: routes.tours },
      { label: "Private Tours", href: routes.toursByType("private") },
      { label: "Group Tours", href: routes.toursByType("group") },
      { label: "Custom Tours", href: routes.toursByType("custom") },
    ],
  },
  {
    title: "Discover",
    items: [
      { label: "About", href: routes.about },
      { label: "Guest House", href: routes.guestHouse },
      { label: "Festivals", href: routes.festivals },
      { label: "Gallery", href: routes.gallery },
      { label: "Travel Information", href: routes.travelInformation },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact", href: routes.contact },
      { label: "FAQ", href: routes.faq },
      { label: "Booking Terms", href: routes.bookingTerms },
      { label: "Privacy", href: routes.privacy },
    ],
  },
];

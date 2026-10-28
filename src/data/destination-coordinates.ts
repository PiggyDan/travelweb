/**
 * Map pins for our Mongolia destinations on the world explorer, keyed by
 * destination slug. Each destination is a region, so its pin sits on a
 * well-known site within it (named in `site`) and is shown as approximate.
 */
export const destinationCoordinates: Record<string, { lat: number; lon: number; site: string }> = {
  "gobi-desert": { lat: 43.78, lon: 102.33, site: "Khongoryn Els dunes" },
  "khuvsgul-lake": { lat: 51.0, lon: 100.5, site: "Khuvsgul Lake" },
  "altai-mountains": { lat: 49.15, lon: 87.82, site: "Tavan Bogd" },
  "central-mongolia": { lat: 47.2, lon: 102.82, site: "Kharkhorin" },
  "orkhon-valley": { lat: 46.79, lon: 101.96, site: "Orkhon Waterfall" },
  terelj: { lat: 47.91, lon: 107.42, site: "Turtle Rock, Gorkhi-Terelj" },
  "eastern-mongolia": { lat: 47.5, lon: 112.5, site: "Eastern steppe" },
};

import { notFound } from "next/navigation";

/**
 * Catch-all for unknown paths under a locale (e.g. /en/does-not-exist), so
 * they render the branded `[locale]/not-found.tsx` inside the site layout.
 */
export default function CatchAllPage() {
  notFound();
}

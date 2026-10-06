import { TripPlanView } from "@/components/admin/trip-plan-view";
import { getExperiences } from "@/services/content-service";
import { getDestinations } from "@/services/destination-service";

export default async function TripPlanPage({ params }: PageProps<"/admin/trips/[id]">) {
  const { id } = await params;
  const [experiences, destinations] = await Promise.all([getExperiences(), getDestinations()]);
  // The planner stores slugs; staff see the same names travellers picked from.
  const labels = Object.fromEntries([
    ...experiences.map((e) => [e.slug, e.title] as const),
    ...destinations.map((d) => [d.slug, d.name] as const),
  ]);
  return <TripPlanView id={Number(id)} labels={labels} />;
}

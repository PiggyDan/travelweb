import { cn } from "@/lib/utils";
import type { TripPlanStatus } from "@/types/chat";

export const STATUS_LABELS: Record<TripPlanStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  booked: "Booked",
  closed: "Closed",
};

export const STATUSES = Object.keys(STATUS_LABELS) as TripPlanStatus[];

const STATUS_STYLES: Record<TripPlanStatus, string> = {
  new: "bg-copper-500 text-white",
  contacted: "bg-sky-100 text-sky-800",
  quoted: "bg-sand-200 text-sand-700",
  booked: "bg-steppe-100 text-steppe-700",
  closed: "bg-charcoal-900/5 text-charcoal-500",
};

export function StatusBadge({ status }: { status: TripPlanStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const dateTime = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function formatWhen(iso: string): string {
  return dateTime.format(new Date(iso));
}

"use client";

import { Reorder, useDragControls } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bike,
  Car,
  Footprints,
  GripVertical,
  Info,
  LoaderCircle,
  Plane,
  ArrowRightLeft,
  RotateCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { formatDistance, formatDuration } from "@/lib/explorer/format";
import type { ExplorerMessages } from "@/lib/explorer/messages";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";
import type { RouteUnavailableReason, TravelMode } from "@/types/explorer";
import type { Leg, Stop } from "./types";

const MODE_ICONS: Record<TravelMode, typeof Car> = { driving: Car, walking: Footprints, cycling: Bike, flight: Plane };
const MODES: readonly TravelMode[] = ["driving", "walking", "cycling", "flight"];
/** Failures worth retrying; the rest won't change on a second try. */
const TRANSIENT: readonly RouteUnavailableReason[] = ["quota", "rate_limited", "provider_error"];

interface RoutePanelProps {
  stops: Stop[];
  legs: Leg[];
  locale: Locale;
  messages: ExplorerMessages;
  replacingUid: string | null;
  maxStops: number;
  onReorder(stops: Stop[]): void;
  onMove(uid: string, delta: -1 | 1): void;
  onRemove(uid: string): void;
  onReplace(uid: string): void;
  onClear(): void;
  onModeChange(pair: string, mode: TravelMode): void;
  onRetry(key: string): void;
  onExample(): void;
}

export function RoutePanel(props: RoutePanelProps) {
  const { stops, legs, messages, maxStops, onReorder, onClear, onExample } = props;

  if (stops.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sand-300 px-5 py-6 text-center">
        <p className="font-display text-lg text-sky-950">{messages.route.emptyTitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{messages.route.emptyBody}</p>
        <button
          type="button"
          onClick={onExample}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-950/5 px-4 text-sm font-semibold text-sky-950 transition-colors hover:bg-sky-950/10"
        >
          <Sparkles aria-hidden className="size-4 text-copper-600" />
          {messages.route.example}
        </button>
        <p className="mt-2 text-xs text-charcoal-500">{messages.route.exampleRoute}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="eyebrow text-copper-600">{messages.route.heading}</h2>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-charcoal-600 hover:bg-sky-950/5"
        >
          <Trash2 aria-hidden className="size-3.5" />
          {messages.route.clear}
        </button>
      </div>

      <Reorder.Group as="ol" axis="y" values={stops} onReorder={onReorder} className="mt-3">
        {stops.map((stop, index) => (
          <StopItem key={stop.uid} stop={stop} index={index} leg={legs[index]} {...props} />
        ))}
      </Reorder.Group>

      <p className="mt-3 text-xs text-charcoal-500">
        {stops.length >= maxStops ? messages.route.maxStops(maxStops) : messages.route.addMore}
      </p>
    </div>
  );
}

function StopItem({
  stop,
  index,
  leg,
  stops,
  locale,
  messages,
  replacingUid,
  onMove,
  onRemove,
  onReplace,
  onModeChange,
  onRetry,
}: RoutePanelProps & { stop: Stop; index: number; leg: Leg | undefined }) {
  const controls = useDragControls();
  const last = index === stops.length - 1;
  const replacing = replacingUid === stop.uid;

  return (
    <Reorder.Item as="li" value={stop} dragListener={false} dragControls={controls} className="relative list-none">
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl bg-felt-50 py-2 pr-1.5 pl-1 ring-1 transition-shadow",
          replacing ? "ring-2 ring-copper-500" : "ring-sand-200",
        )}
      >
        <button
          type="button"
          aria-label={messages.route.dragHandle(stop.name)}
          onPointerDown={(event) => controls.start(event)}
          className="inline-flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-charcoal-400 hover:text-charcoal-700 active:cursor-grabbing"
        >
          <GripVertical aria-hidden className="size-4" />
        </button>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
            index === 0 ? "bg-copper-600" : "bg-sky-800",
          )}
          aria-hidden
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-sky-950">
            <span className="sr-only">{index === 0 ? messages.route.start : messages.route.stop(index + 1)}: </span>
            {stop.name}
          </p>
          {stop.context && <p className="truncate text-xs text-charcoal-500">{stop.context}</p>}
        </div>
        <div className="flex shrink-0 items-center">
          <IconButton label={messages.route.moveUp(stop.name)} disabled={index === 0} onClick={() => onMove(stop.uid, -1)}>
            <ArrowUp aria-hidden className="size-3.5" />
          </IconButton>
          <IconButton label={messages.route.moveDown(stop.name)} disabled={last} onClick={() => onMove(stop.uid, 1)}>
            <ArrowDown aria-hidden className="size-3.5" />
          </IconButton>
          <IconButton label={messages.route.replace(stop.name)} pressed={replacing} onClick={() => onReplace(stop.uid)}>
            <ArrowRightLeft aria-hidden className="size-3.5" />
          </IconButton>
          <IconButton label={messages.route.remove(stop.name)} onClick={() => onRemove(stop.uid)}>
            <X aria-hidden className="size-4" />
          </IconButton>
        </div>
      </div>

      {leg && (
        <LegRow leg={leg} locale={locale} messages={messages} onModeChange={onModeChange} onRetry={onRetry} />
      )}
    </Reorder.Item>
  );
}

function LegRow({
  leg,
  locale,
  messages,
  onModeChange,
  onRetry,
}: Pick<RoutePanelProps, "locale" | "messages" | "onModeChange" | "onRetry"> & { leg: Leg }) {
  const { state } = leg;
  const crossesBorder =
    leg.mode !== "flight" &&
    state.status === "ok" &&
    leg.from.countryCode &&
    leg.to.countryCode &&
    leg.from.countryCode !== leg.to.countryCode;

  return (
    <div className="relative my-1 ml-[2.4rem] border-l-2 border-dashed border-sand-300 py-2 pl-4">
      <div role="group" aria-label={messages.route.legMode(leg.from.name, leg.to.name)} className="flex flex-wrap gap-1">
        {MODES.map((mode) => {
          const Icon = MODE_ICONS[mode];
          const active = leg.mode === mode;
          return (
            <button
              key={mode}
              type="button"
              aria-pressed={active}
              title={messages.modes[mode]}
              onClick={() => onModeChange(leg.pair, mode)}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-colors",
                active ? "bg-copper-600 text-white" : "text-charcoal-600 hover:bg-sky-950/5",
              )}
            >
              <Icon aria-hidden className="size-3.5" />
              <span className={cn(!active && "sr-only")}>{messages.modes[mode]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 text-xs leading-relaxed" aria-live="polite">
        {state.status === "loading" && (
          <p className="flex items-center gap-1.5 text-charcoal-500">
            <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
            {messages.leg.loading}
          </p>
        )}
        {state.status === "ok" && (
          <p className="font-semibold text-sky-950">
            {formatDistance(state.distanceMeters, locale)} · {formatDuration(state.durationSeconds, messages)}
          </p>
        )}
        {state.status === "flight" && (
          <>
            <p className="font-semibold text-sky-950">≈ {formatDistance(state.distanceMeters, locale)}</p>
            <p className="mt-0.5 flex gap-1.5 text-charcoal-500">
              <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              {messages.leg.flightNote}
            </p>
          </>
        )}
        {state.status === "unavailable" && (
          <div className="rounded-xl bg-copper-600/10 p-2.5 text-charcoal-700">
            <p className="flex gap-1.5">
              <AlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0 text-copper-600" />
              {messages.leg.reasons[state.reason]}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onModeChange(leg.pair, "flight")}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-felt-50 px-3 font-semibold text-sky-950 ring-1 ring-sand-200 hover:bg-felt-200"
              >
                <Plane aria-hidden className="size-3.5" />
                {messages.leg.tryFlight}
              </button>
              {TRANSIENT.includes(state.reason) && (
                <button
                  type="button"
                  onClick={() => onRetry(leg.key)}
                  className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 font-semibold text-sky-950 hover:bg-sky-950/5"
                >
                  <RotateCw aria-hidden className="size-3.5" />
                  {messages.leg.retry}
                </button>
              )}
            </div>
          </div>
        )}
        {crossesBorder && (
          <p className="mt-1 flex gap-1.5 text-charcoal-500">
            <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {messages.leg.borderNote}
          </p>
        )}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  pressed,
  children,
}: {
  label: string;
  onClick(): void;
  disabled?: boolean;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full text-charcoal-600 transition-colors hover:bg-sky-950/5 hover:text-sky-950 disabled:pointer-events-none disabled:opacity-30",
        pressed && "bg-copper-600/15 text-copper-700",
      )}
    >
      {children}
    </button>
  );
}

/** Totals across legs. Only real routing results and straight-line flight distances are added up. */
export function RouteSummary({ legs, locale, messages }: { legs: Leg[]; locale: Locale; messages: ExplorerMessages }) {
  if (legs.length === 0) return null;
  let distance = 0;
  let roadSeconds = 0;
  let hasFlight = false;
  let hasRoad = false;
  let unrouted = 0;
  let loading = false;
  const attributions = new Set<string>();

  for (const { state } of legs) {
    if (state.status === "ok") {
      distance += state.distanceMeters;
      roadSeconds += state.durationSeconds;
      hasRoad = true;
      attributions.add(state.attribution);
    } else if (state.status === "flight") {
      distance += state.distanceMeters;
      hasFlight = true;
    } else if (state.status === "unavailable") {
      unrouted += 1;
    } else {
      loading = true;
    }
  }

  return (
    <section aria-labelledby="route-summary-heading" className="rounded-2xl bg-sky-950 p-5 text-felt-100">
      <h2 id="route-summary-heading" className="eyebrow text-copper-300">
        {messages.summary.heading}
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs text-sky-200">{messages.summary.totalDistance}</dt>
          <dd className="mt-0.5 font-display text-2xl">{loading && distance === 0 ? "…" : formatDistance(distance, locale)}</dd>
        </div>
        <div>
          <dt className="text-xs text-sky-200">{messages.summary.roadTime}</dt>
          <dd className="mt-0.5 font-display text-2xl">{hasRoad ? formatDuration(roadSeconds, messages) : "—"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-sky-200">{messages.summary.legs(legs.length)}</p>
      <ul className="mt-2 space-y-1 text-xs leading-relaxed text-sky-200">
        {hasFlight && <li>{messages.summary.flightDistanceNote}</li>}
        {hasRoad && <li>{messages.summary.estimatesNote}</li>}
        {unrouted > 0 && <li className="text-copper-300">{messages.summary.unrouted(unrouted)}</li>}
        {[...attributions].map((attribution) => (
          <li key={attribution} className="text-sky-300">
            {attribution}
          </li>
        ))}
      </ul>
    </section>
  );
}

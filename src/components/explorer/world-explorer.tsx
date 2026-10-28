"use client";

import { Check, ChevronLeft, ChevronRight, Globe2, Link2, Map as MapIcon, Maximize, Minimize, Minus, Plus, Route } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ThemeToggle, useDarkTheme } from "@/components/layout/theme-toggle";
import { useLocale } from "@/components/shared/locale-link";
import { EXAMPLE_ROUTE } from "@/lib/explorer/example-route";
import { defaultModeFor, greatCircle, haversineMeters, roundCoord } from "@/lib/explorer/geo";
import { getExplorerMessages } from "@/lib/explorer/messages";
import { decodeRoute, encodeRoute, MAX_STOPS, type RouteStopData } from "@/lib/explorer/route-url";
import { cn } from "@/lib/utils";
import type { CountryInfo, FeaturedDestination, GeoRouteResponse, GeoSearchResponse, Place, TravelMode } from "@/types/explorer";
import { CountryPanel, FeaturedList, FeaturedPanel } from "./detail-panels";
import { MapView, type MapPadding, type MapViewHandle, type Projection } from "./map-view";
import { PlaceSearch, type SearchSelection } from "./place-search";
import { RoutePanel, RouteSummary } from "./route-panel";
import type { Leg, LegState, Stop } from "./types";

/**
 * World explorer: a full-height map with a planner panel (side panel on
 * desktop, bottom sheet on mobile). The route lives in the URL, so any
 * planned route can be shared or bookmarked without an account.
 */

type Detail = { type: "country"; iso2: string } | { type: "featured"; slug: string } | null;

const PROJECTION_KEY = "explorer-projection";

let uidCounter = 0;
const newUid = () => `s${(uidCounter += 1).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const withUid = (stop: RouteStopData, context: string | null = null): Stop => ({ ...stop, context, uid: newUid() });

function routeFromUrl(): { stops: Stop[]; legModes: Record<string, TravelMode> } {
  const { stops, modes } = decodeRoute(new URLSearchParams(window.location.search));
  const withIds = stops.map((stop) => withUid(stop));
  const legModes: Record<string, TravelMode> = {};
  withIds.slice(1).forEach((to, i) => {
    legModes[`${withIds[i].uid}>${to.uid}`] = modes[i];
  });
  return { stops: withIds, legModes };
}

function placeToStop(place: Place): Stop {
  return withUid(
    { name: place.name, lat: roundCoord(place.lat), lon: roundCoord(place.lon), kind: place.kind, countryCode: place.countryCode },
    place.context,
  );
}

const desktopQuery = "(min-width: 1024px)";
function useDesktop(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(desktopQuery);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(desktopQuery).matches,
    () => true,
  );
}

export function WorldExplorer({ featured }: { featured: FeaturedDestination[] }) {
  const locale = useLocale();
  const messages = getExplorerMessages(locale);
  const dark = useDarkTheme();
  const desktop = useDesktop();

  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapViewHandle>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const inflight = useRef(new Set<string>());

  const [initial] = useState(routeFromUrl);
  const [stops, setStops] = useState<Stop[]>(initial.stops);
  const [legModes, setLegModes] = useState(initial.legModes);
  const [roadResults, setRoadResults] = useState<Record<string, GeoRouteResponse>>({});
  const [countries, setCountries] = useState<CountryInfo[] | null>(null);
  const [detail, setDetail] = useState<Detail>(null);
  const [replacingUid, setReplacingUid] = useState<string | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");
  const [projection, setProjection] = useState<Projection>(() => {
    try {
      return localStorage.getItem(PROJECTION_KEY) === "mercator" ? "mercator" : "globe";
    } catch {
      return "globe";
    }
  });
  const [panelOpen, setPanelOpen] = useState(true);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [fitToken, setFitToken] = useState(initial.stops.length > 0 ? 1 : 0);
  const [fullscreen, setFullscreen] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "failed">("idle");

  // --- Legs: flights are drawn locally; road legs come from /api/geo/route ----
  const legs = useMemo<Leg[]>(
    () =>
      stops.slice(1).map((to, i) => {
        const from = stops[i];
        const pair = `${from.uid}>${to.uid}`;
        const mode = legModes[pair] ?? defaultModeFor(from, to);
        const key = `${mode}|${roundCoord(from.lon)},${roundCoord(from.lat)}|${roundCoord(to.lon)},${roundCoord(to.lat)}`;
        const state: LegState =
          mode === "flight"
            ? { status: "flight", coordinates: greatCircle(from, to), distanceMeters: haversineMeters(from, to) }
            : (roadResults[key] ?? { status: "loading" });
        return { pair, key, from, to, mode, state };
      }),
    [stops, legModes, roadResults],
  );

  useEffect(() => {
    for (const leg of legs) {
      if (leg.state.status !== "loading" || inflight.current.has(leg.key)) continue;
      inflight.current.add(leg.key);
      const params = new URLSearchParams({
        mode: leg.mode,
        from: `${roundCoord(leg.from.lon)},${roundCoord(leg.from.lat)}`,
        to: `${roundCoord(leg.to.lon)},${roundCoord(leg.to.lat)}`,
      });
      fetch(`/api/geo/route?${params}`)
        .then((response) => response.json() as Promise<GeoRouteResponse>)
        .catch((): GeoRouteResponse => ({ status: "unavailable", reason: "provider_error" }))
        .then((result) => {
          inflight.current.delete(leg.key);
          setRoadResults((previous) => ({ ...previous, [leg.key]: result }));
        });
    }
  }, [legs]);

  const mapLegs = useMemo(
    () =>
      legs.map((leg) => ({
        key: leg.key,
        kind: leg.mode === "flight" ? ("flight" as const) : ("road" as const),
        coordinates: leg.state.status === "flight" || leg.state.status === "ok" ? leg.state.coordinates : null,
      })),
    [legs],
  );

  // --- Keep the route in the URL ---------------------------------------------
  useEffect(() => {
    const query = encodeRoute({ stops, modes: legs.map((leg) => leg.mode) }).toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", url);
  }, [stops, legs]);

  // --- Country facts (static file, loaded once) -------------------------------
  useEffect(() => {
    let cancelled = false;
    fetch("/geo/countries.json")
      .then((response) => response.json() as Promise<CountryInfo[]>)
      .then((data) => !cancelled && setCountries(data))
      .catch((error) => console.error("[explorer] country data failed to load", error));
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Camera follows the route once the map is ready -------------------------
  useEffect(() => {
    if (fitToken > 0 && mapStatus === "ready") mapRef.current?.fitRoute();
  }, [fitToken, mapStatus]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // --- Actions -------------------------------------------------------------------
  const requestFit = () => setFitToken((token) => token + 1);

  function addStop(stop: Stop) {
    const replaceIndex = replacingUid ? stops.findIndex((s) => s.uid === replacingUid) : -1;
    if (replaceIndex < 0 && stops.length >= MAX_STOPS) return;
    const next = replaceIndex >= 0 ? stops.map((s, i) => (i === replaceIndex ? stop : s)) : [...stops, stop];
    setStops(next);
    setReplacingUid(null);
    setDetail(null);
    // On phones, drop the sheet so the traveller sees the route they just extended.
    if (!desktop) setSheetExpanded(false);
    if (next.length >= 2) requestFit();
    else mapRef.current?.flyToPlace(stop);
  }

  const selectCountry = useCallback(
    (iso2: string, fallback?: { lat: number; lon: number }) => {
      const info = countries?.find((c) => c.iso2 === iso2);
      setDetail({ type: "country", iso2 });
      setSheetExpanded(true);
      const point = info ?? fallback;
      if (point) mapRef.current?.flyToCountry(iso2, point);
    },
    [countries],
  );

  function handleSearchSelect(selection: SearchSelection) {
    if (selection.type === "country") selectCountry(selection.iso2);
    else if (selection.place.kind === "country" && selection.place.countryCode)
      selectCountry(selection.place.countryCode, selection.place);
    else addStop(placeToStop(selection.place));
  }

  const handleFeaturedClick = useCallback(
    (slug: string) => {
      const destination = featured.find((d) => d.slug === slug);
      if (!destination) return;
      setDetail({ type: "featured", slug });
      setSheetExpanded(true);
      mapRef.current?.flyToPlace({ lat: destination.lat, lon: destination.lon, kind: "region" });
    },
    [featured],
  );

  async function addCapital(iso2: string, capital: string, countryLabel: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({ q: `${capital}, ${countryLabel}`, lang: locale });
      const response = await fetch(`/api/geo/search?${params}`);
      if (!response.ok) return false;
      const { results } = (await response.json()) as GeoSearchResponse;
      const match =
        results.find((r) => r.countryCode === iso2 && r.kind === "city") ??
        results.find((r) => r.countryCode === iso2 && r.kind !== "country");
      if (!match) return false;
      addStop(placeToStop(match));
      return true;
    } catch {
      return false;
    }
  }

  function moveStop(uid: string, delta: -1 | 1) {
    const index = stops.findIndex((s) => s.uid === uid);
    const target = index + delta;
    if (index < 0 || target < 0 || target >= stops.length) return;
    const next = [...stops];
    [next[index], next[target]] = [next[target], next[index]];
    setStops(next);
  }

  function startReplace(uid: string) {
    const replacing = replacingUid === uid ? null : uid;
    setReplacingUid(replacing);
    if (replacing) {
      setSheetExpanded(true);
      searchRef.current?.focus();
    }
  }

  function toggleProjection() {
    const next = projection === "globe" ? "mercator" : "globe";
    setProjection(next);
    try {
      localStorage.setItem(PROJECTION_KEY, next);
    } catch {
      // Storage unavailable; the choice lasts for this page view.
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else rootRef.current?.requestFullscreen().catch(() => undefined);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
    window.setTimeout(() => setShareStatus("idle"), 2500);
  }

  // --- Derived view state ----------------------------------------------------------
  const selectedCountry = detail?.type === "country" ? detail.iso2 : null;
  const countryInfo = selectedCountry ? countries?.find((c) => c.iso2 === selectedCountry) : undefined;
  const featuredInfo = detail?.type === "featured" ? featured.find((d) => d.slug === detail.slug) : undefined;
  const replacingStop = stops.find((s) => s.uid === replacingUid);
  const canAddStop = stops.length < MAX_STOPS;
  const canFullscreen = typeof document !== "undefined" && document.fullscreenEnabled;

  const padding: MapPadding = desktop
    ? { top: 24, right: 88, bottom: 24, left: panelOpen ? 448 : 24 }
    : { top: 24, right: 72, bottom: sheetExpanded ? Math.round(window.innerHeight * 0.6) : 216, left: 16 };

  const mapStops = useMemo(() => stops.map(({ uid, name, lat, lon }) => ({ uid, name, lat, lon })), [stops]);

  return (
    <div ref={rootRef} className="relative h-[calc(100svh-5rem)] min-h-[34rem] w-full overflow-hidden bg-sky-100">
      <MapView
        ref={mapRef}
        stops={mapStops}
        legs={mapLegs}
        featured={featured}
        selectedCountry={selectedCountry}
        dark={dark}
        projection={projection}
        locale={locale}
        messages={messages}
        padding={padding}
        onCountryClick={selectCountry}
        onFeaturedClick={handleFeaturedClick}
        onStatusChange={setMapStatus}
      />

      {mapStatus !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-sky-100 lg:pl-[26rem]" role="status">
          {mapStatus === "loading" ? (
            <p className="flex flex-col items-center gap-3 text-sm text-charcoal-600">
              <Globe2 aria-hidden className="size-10 animate-pulse text-sky-400" strokeWidth={1.25} />
              {messages.map.loading}
            </p>
          ) : (
            <p className="mx-6 max-w-sm rounded-2xl bg-felt-50 p-5 text-center text-sm text-charcoal-700 shadow-lg ring-1 ring-sand-200">
              {messages.map.error}
            </p>
          )}
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Phones zoom with a pinch, so the zoom buttons are desktop-only. */}
        <ControlGroup display="hidden lg:flex">
          <ControlButton label={messages.map.zoomIn} onClick={() => mapRef.current?.zoomIn()}>
            <Plus aria-hidden className="size-5" strokeWidth={1.75} />
          </ControlButton>
          <ControlButton label={messages.map.zoomOut} onClick={() => mapRef.current?.zoomOut()}>
            <Minus aria-hidden className="size-5" strokeWidth={1.75} />
          </ControlButton>
        </ControlGroup>
        <ControlGroup>
          <ControlButton label={projection === "globe" ? messages.map.flat : messages.map.globe} onClick={toggleProjection}>
            {projection === "globe" ? (
              <MapIcon aria-hidden className="size-5" strokeWidth={1.5} />
            ) : (
              <Globe2 aria-hidden className="size-5" strokeWidth={1.5} />
            )}
          </ControlButton>
          {stops.length > 0 && (
            <ControlButton label={messages.map.fitRoute} onClick={requestFit}>
              <Route aria-hidden className="size-5" strokeWidth={1.5} />
            </ControlButton>
          )}
          {canFullscreen && (
            <ControlButton
              label={fullscreen ? messages.map.exitFullscreen : messages.map.fullscreen}
              onClick={toggleFullscreen}
              className="hidden sm:inline-flex"
            >
              {fullscreen ? (
                <Minimize aria-hidden className="size-5" strokeWidth={1.5} />
              ) : (
                <Maximize aria-hidden className="size-5" strokeWidth={1.5} />
              )}
            </ControlButton>
          )}
          <ThemeToggle className="text-sky-950 hover:bg-sky-950/5" />
        </ControlGroup>
      </div>

      {/* Show the planner again (desktop, when collapsed) */}
      {!panelOpen && (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          aria-expanded={false}
          aria-controls="explorer-panel"
          className="absolute top-4 left-4 z-10 hidden min-h-11 items-center gap-2 rounded-full bg-felt-50/95 px-4 text-sm font-semibold text-sky-950 shadow-lg ring-1 ring-sand-200 backdrop-blur-md lg:inline-flex"
        >
          {messages.map.showPanel}
          <ChevronRight aria-hidden className="size-4" />
        </button>
      )}

      {/* Planner: bottom sheet on mobile, side panel on desktop */}
      <aside
        id="explorer-panel"
        aria-label={messages.heading}
        className={cn(
          "absolute z-10 flex flex-col bg-felt-50/95 shadow-2xl ring-1 shadow-sky-950/20 ring-sand-200 backdrop-blur-md transition-[transform,height] duration-500 ease-soft",
          "inset-x-0 bottom-0 rounded-t-3xl",
          sheetExpanded ? "h-[62svh]" : "h-[13.5rem]",
          "lg:inset-x-auto lg:top-4 lg:bottom-4 lg:left-4 lg:h-auto lg:w-[26rem] lg:rounded-3xl",
          !panelOpen && "lg:pointer-events-none lg:-translate-x-[calc(100%+2rem)]",
        )}
        inert={desktop && !panelOpen}
      >
        <button
          type="button"
          onClick={() => setSheetExpanded((open) => !open)}
          aria-expanded={sheetExpanded}
          aria-controls="explorer-panel-body"
          aria-label={sheetExpanded ? messages.map.collapsePanel : messages.map.expandPanel}
          className="flex h-7 w-full shrink-0 items-center justify-center lg:hidden"
        >
          <span aria-hidden className="h-1.5 w-12 rounded-full bg-sand-300" />
        </button>

        <div className="flex items-start gap-3 px-5 lg:pt-5">
          <div className="hidden min-w-0 flex-1 lg:block" aria-hidden>
            <p className="font-display text-2xl leading-tight text-sky-950">{messages.heading}</p>
            <p className="mt-1 text-sm leading-relaxed text-charcoal-600">{messages.intro}</p>
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            aria-label={messages.map.hidePanel}
            aria-expanded
            aria-controls="explorer-panel"
            className="-mr-2 hidden size-10 shrink-0 items-center justify-center rounded-full text-charcoal-600 hover:bg-sky-950/5 lg:inline-flex"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
        </div>

        <div className="px-5 pt-1 lg:pt-4">
          <PlaceSearch
            inputRef={searchRef}
            countries={countries}
            locale={locale}
            messages={messages}
            replacing={replacingStop?.name ?? null}
            onSelect={handleSearchSelect}
            onCancelReplace={() => setReplacingUid(null)}
            onFocusInput={() => setSheetExpanded(true)}
          />
        </div>

        <div id="explorer-panel-body" data-lenis-prevent className="mt-4 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 pb-28 lg:pb-5">
          {countryInfo && (
            <CountryPanel
              key={countryInfo.iso2}
              country={countryInfo}
              locale={locale}
              messages={messages}
              canAddStop={canAddStop}
              onAddCapital={(capital) => addCapital(countryInfo.iso2, capital, countryInfo.name)}
              onClose={() => setDetail(null)}
            />
          )}
          {featuredInfo && (
            <FeaturedPanel
              destination={featuredInfo}
              messages={messages}
              canAddStop={canAddStop}
              onAdd={() =>
                addStop(
                  withUid(
                    { name: featuredInfo.name, lat: featuredInfo.lat, lon: featuredInfo.lon, kind: "region", countryCode: "MN" },
                    featuredInfo.region,
                  ),
                )
              }
              onClose={() => setDetail(null)}
            />
          )}

          <RoutePanel
            stops={stops}
            legs={legs}
            locale={locale}
            messages={messages}
            replacingUid={replacingUid}
            maxStops={MAX_STOPS}
            onReorder={setStops}
            onMove={moveStop}
            onRemove={(uid) => {
              setStops((current) => current.filter((s) => s.uid !== uid));
              if (replacingUid === uid) setReplacingUid(null);
            }}
            onReplace={startReplace}
            onClear={() => {
              setStops([]);
              setLegModes({});
              setReplacingUid(null);
            }}
            onModeChange={(pair, mode) => setLegModes((current) => ({ ...current, [pair]: mode }))}
            onRetry={(key) =>
              setRoadResults((current) => {
                const next = { ...current };
                delete next[key];
                return next;
              })
            }
            onExample={() => {
              setStops(EXAMPLE_ROUTE.map((stop) => withUid(stop)));
              setLegModes({});
              setDetail(null);
              requestFit();
            }}
          />

          <RouteSummary legs={legs} locale={locale} messages={messages} />

          {stops.length >= 2 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-950/5 px-4 text-sm font-semibold text-sky-950 transition-colors hover:bg-sky-950/10"
              >
                {shareStatus === "copied" ? (
                  <Check aria-hidden className="size-4 text-steppe-600" />
                ) : (
                  <Link2 aria-hidden className="size-4" />
                )}
                {messages.share.button}
              </button>
              <span role="status" className="text-xs text-charcoal-500">
                {shareStatus === "copied" ? messages.share.copied : shareStatus === "failed" ? messages.share.failed : ""}
              </span>
            </div>
          )}

          {stops.length === 0 && !detail && (
            <FeaturedList featured={featured} messages={messages} onSelect={handleFeaturedClick} />
          )}

          <p className="text-[0.6875rem] leading-relaxed text-charcoal-500">{messages.map.boundariesNote}</p>
        </div>
      </aside>
    </div>
  );
}

/** `display` lets a group hide at some breakpoints, e.g. "hidden lg:flex". */
function ControlGroup({ children, display = "flex" }: { children: ReactNode; display?: string }) {
  return (
    <div
      className={cn(
        display,
        "flex-col overflow-hidden rounded-2xl bg-felt-50/95 shadow-lg ring-1 shadow-sky-950/15 ring-sand-200 backdrop-blur-md",
      )}
    >
      {children}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick(): void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-11 items-center justify-center text-sky-950 transition-colors hover:bg-sky-950/5",
        className,
      )}
    >
      {children}
    </button>
  );
}

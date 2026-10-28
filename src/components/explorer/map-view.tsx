"use client";

import type { FeatureCollection, Geometry, LineString } from "geojson";
import type {
  ExpressionSpecification,
  FilterSpecification,
  GeoJSONSource,
  Map as MapLibreMap,
  MapMouseEvent,
  Marker,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { feature as topoFeature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { boundsOf, unwrapLongitudes } from "@/lib/explorer/geo";
import type { ExplorerMessages } from "@/lib/explorer/messages";
import type { Locale } from "@/types/common";
import type { FeaturedDestination, PlaceKind } from "@/types/explorer";

/**
 * The world map (MapLibre GL). It owns the map instance imperatively; the
 * explorer drives it through props (data) and the handle (camera moves).
 *
 * Basemap: OpenFreeMap vector tiles (OpenStreetMap data), free with no key
 * or request limits but no SLA. Override with NEXT_PUBLIC_MAP_STYLE_LIGHT /
 * NEXT_PUBLIC_MAP_STYLE_DARK (e.g. a MapTiler style URL with a key that is
 * restricted to this site's domain).
 */

const STYLE_LIGHT = process.env.NEXT_PUBLIC_MAP_STYLE_LIGHT || "https://tiles.openfreemap.org/styles/positron";
const STYLE_DARK = process.env.NEXT_PUBLIC_MAP_STYLE_DARK || "https://tiles.openfreemap.org/styles/dark";

const FEATURED_COUNTRY = "MN";
const FEATURED_MIN_ZOOM = 3;
const COLORS = {
  copper: "#b7793f",
  copperLight: "#e2b98c",
  sky: "#3f6187",
  skyDeep: "#2e4b6d",
  night: "#0b1522",
};

export type Projection = "globe" | "mercator";

export interface MapStop {
  uid: string;
  name: string;
  lat: number;
  lon: number;
}

export interface MapLeg {
  key: string;
  kind: "road" | "flight";
  /** [lon, lat] pairs, or null while loading / when no route exists. */
  coordinates: [number, number][] | null;
}

export interface MapPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface MapViewHandle {
  zoomIn(): void;
  zoomOut(): void;
  fitRoute(): void;
  flyToPlace(place: { lat: number; lon: number; kind: PlaceKind }): void;
  flyToCountry(iso2: string, fallback: { lat: number; lon: number }): void;
}

interface MapViewProps {
  ref?: Ref<MapViewHandle>;
  stops: MapStop[];
  legs: MapLeg[];
  featured: FeaturedDestination[];
  selectedCountry: string | null;
  dark: boolean;
  projection: Projection;
  locale: Locale;
  messages: ExplorerMessages;
  padding: MapPadding;
  onCountryClick(iso2: string): void;
  onFeaturedClick(slug: string): void;
  onStatusChange(status: "ready" | "error"): void;
}

const EMPTY: FeatureCollection = { type: "FeatureCollection", features: [] };
const ZOOM_FOR_KIND: Record<PlaceKind, number> = { country: 4, region: 6, city: 10, place: 13 };

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MapView(props: MapViewProps) {
  const { ref, stops, legs, featured, selectedCountry, dark, projection, messages } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerClassRef = useRef<typeof Marker | null>(null);
  const countriesRef = useRef<FeatureCollection | null>(null);
  const countryBoundsRef = useRef(new Map<string, [number, number, number, number]>());
  const stopMarkersRef = useRef<Marker[]>([]);
  const featuredMarkersRef = useRef<Marker[]>([]);
  const hoverRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  // Latest props for map event handlers, which are bound once.
  const latest = useRef(props);
  const routeRef = useRef<{ fc: FeatureCollection; points: [number, number][] }>({ fc: EMPTY, points: [] });
  useEffect(() => {
    latest.current = props;
  });

  // --- Create the map once --------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let map: MapLibreMap | null = null;

    (async () => {
      try {
        const maplibre = await import("maplibre-gl");
        if (cancelled) return;
        // Served from /public by scripts/copy-maplibre-worker.mjs; the bundled default URL doesn't resolve.
        maplibre.setWorkerUrl(`/vendor/maplibre-gl-worker-${maplibre.getVersion()}.mjs`);
        markerClassRef.current = maplibre.Marker;
        const initial = latest.current;
        const mobile = window.matchMedia("(max-width: 1023px)").matches;

        map = new maplibre.Map({
          container,
          style: initial.dark ? STYLE_DARK : STYLE_LIGHT,
          center: [105, 46],
          zoom: mobile ? 1.4 : 2.2,
          minZoom: 0.8,
          maxZoom: 18,
          attributionControl: false,
          dragRotate: false,
          pitchWithRotate: false,
        });
        // Bottom-left/right are covered by the planner sheet (mobile) or panel and chat button (desktop).
        map.addControl(
          new maplibre.AttributionControl({ compact: true, customAttribution: "Boundaries: Natural Earth" }),
          mobile ? "top-left" : "bottom-right",
        );
        // On phones, start collapsed behind its "i" button so it doesn't cover the map.
        if (mobile) container.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
        map.touchZoomRotate.disableRotation();
        mapRef.current = map;
        map.getCanvas().setAttribute("aria-label", initial.messages.meta.title);

        map.on("style.load", () => {
          if (!map) return;
          const { dark, projection, locale, selectedCountry } = latest.current;
          installOverlays(map, {
            dark,
            projection,
            locale,
            selectedCountry,
            countries: countriesRef.current ?? EMPTY,
            route: routeRef.current.fc,
          });
        });
        map.once("load", () => {
          setReady(true);
          latest.current.onStatusChange("ready");
        });
        map.on("error", (event) => {
          // Tile hiccups are recoverable; a style that never loads is not.
          if (map && !map.isStyleLoaded() && !("sourceId" in event)) latest.current.onStatusChange("error");
        });

        map.on("mousemove", "country-fill", (event) => {
          const iso2 = event.features?.[0]?.properties?.iso2 as string | undefined;
          setHover(iso2 ?? null);
          if (map) map.getCanvas().style.cursor = iso2 ? "pointer" : "";
        });
        map.on("mouseleave", "country-fill", () => {
          setHover(null);
          if (map) map.getCanvas().style.cursor = "";
        });
        map.on("click", (event: MapMouseEvent) => {
          if (!map || event.originalEvent.target !== map.getCanvas()) return;
          const hit = map.queryRenderedFeatures(event.point, { layers: ["country-fill"] })[0];
          const iso2 = hit?.properties?.iso2 as string | undefined;
          if (iso2) latest.current.onCountryClick(iso2);
        });
        map.on("zoom", () => map && setFeaturedVisibility(map, featuredMarkersRef.current));

        // Simplified country shapes for hover/click, loaded once and kept across style swaps.
        const response = await fetch("/geo/countries-110m.json");
        const topology = (await response.json()) as Topology;
        if (cancelled) return;
        const countries = topoFeature(topology, topology.objects.countries) as FeatureCollection<
          Geometry,
          { iso2: string | null; name: string }
        >;
        countriesRef.current = countries;
        for (const f of countries.features) {
          if (f.properties.iso2) countryBoundsRef.current.set(f.properties.iso2, countryBounds(f.geometry));
        }
        (map.getSource("countries") as GeoJSONSource | undefined)?.setData(countries);
      } catch (error) {
        console.error("[explorer] map failed to start", error);
        if (!cancelled) latest.current.onStatusChange("error");
      }
    })();

    function setHover(iso2: string | null) {
      if (!map || hoverRef.current === iso2) return;
      if (hoverRef.current) map.setFeatureState({ source: "countries", id: hoverRef.current }, { hover: false });
      hoverRef.current = iso2;
      if (iso2) map.setFeatureState({ source: "countries", id: iso2 }, { hover: true });
    }

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // --- Theme and projection ---------------------------------------------------
  const appliedDark = useRef(dark);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedDark.current === dark) return;
    appliedDark.current = dark;
    hoverRef.current = null;
    map.setStyle(dark ? STYLE_DARK : STYLE_LIGHT, { diff: false });
  }, [dark]);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.isStyleLoaded()) map.setProjection({ type: projection });
  }, [projection]);

  // --- Selected country -------------------------------------------------------
  const previousSelected = useRef<string | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("country-outline")) {
      previousSelected.current = selectedCountry;
      return;
    }
    if (previousSelected.current) {
      map.setFeatureState({ source: "countries", id: previousSelected.current }, { selected: false });
    }
    if (selectedCountry) map.setFeatureState({ source: "countries", id: selectedCountry }, { selected: true });
    map.setFilter("country-outline", outlineFilter(selectedCountry));
    previousSelected.current = selectedCountry;
  }, [selectedCountry]);

  // --- Route lines and stop markers ------------------------------------------
  useEffect(() => {
    // Unwrap stops so a route across the Pacific stays one continuous line,
    // then shift each leg's geometry onto the same world copy as its start.
    const points = unwrapLongitudes(stops.map((s) => [s.lon, s.lat]));
    const fc: FeatureCollection<LineString, { kind: "road" | "flight" }> = { type: "FeatureCollection", features: [] };
    const allPoints: [number, number][] = [...points];
    legs.forEach((leg, i) => {
      if (!leg.coordinates?.length || !points[i]) return;
      const shift = Math.round((points[i][0] - leg.coordinates[0][0]) / 360) * 360;
      const coordinates = leg.coordinates.map(([lon, lat]) => [lon + shift, lat] as [number, number]);
      fc.features.push({ type: "Feature", properties: { kind: leg.kind }, geometry: { type: "LineString", coordinates } });
      allPoints.push(...coordinates);
    });
    routeRef.current = { fc, points: allPoints };
    (mapRef.current?.getSource("route") as GeoJSONSource | undefined)?.setData(fc);

    const MarkerClass = markerClassRef.current;
    for (const marker of stopMarkersRef.current) marker.remove();
    stopMarkersRef.current = [];
    const map = mapRef.current;
    if (!map || !MarkerClass) return;
    stopMarkersRef.current = stops.map((stop, i) => {
      const el = document.createElement("div");
      el.className =
        "z-[2] flex size-8 items-center justify-center rounded-full border-2 border-white bg-sky-950 text-xs font-bold text-white shadow-lg shadow-sky-950/30";
      if (i === 0) el.classList.replace("bg-sky-950", "bg-copper-600");
      el.textContent = String(i + 1);
      el.title = stop.name;
      el.setAttribute("aria-hidden", "true");
      return new MarkerClass({ element: el }).setLngLat(points[i] ?? [stop.lon, stop.lat]).addTo(map);
    });
    // `ready` flips once the map has loaded, so a route opened from a link gets its markers too.
  }, [stops, legs, ready]);

  // --- Featured Mongolia destinations ---------------------------------------
  useEffect(() => {
    const MarkerClass = markerClassRef.current;
    const map = mapRef.current;
    for (const marker of featuredMarkersRef.current) marker.remove();
    featuredMarkersRef.current = [];
    if (!map || !MarkerClass) return;
    featuredMarkersRef.current = featured.map((destination) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className =
        "group flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-copper-500";
      el.setAttribute("aria-label", `${destination.name} — ${messages.featured.approximate}`);
      el.title = destination.name;
      const dot = document.createElement("span");
      dot.className =
        "block size-3.5 rotate-45 rounded-[3px] border-2 border-white bg-copper-600 shadow-md transition-transform group-hover:scale-125";
      el.append(dot);
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        latest.current.onFeaturedClick(destination.slug);
      });
      return new MarkerClass({ element: el }).setLngLat([destination.lon, destination.lat]).addTo(map);
    });
    setFeaturedVisibility(map, featuredMarkersRef.current);
  }, [featured, messages, ready]);

  // --- Camera -----------------------------------------------------------------
  // The planner panel / sheet covers part of the map, so each camera move is
  // given that area explicitly: `padding` for fitBounds, `offset` for flyTo and
  // easeTo. The map's persistent padding stays zero, because MapLibre combines it
  // with call padding differently in globe and flat projections.
  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    fitRoute() {
      const map = mapRef.current;
      const bounds = boundsOf(routeRef.current.points);
      if (!map || !bounds) return;
      const [west, south, east, north] = bounds;
      if (east - west < 0.01 && north - south < 0.01) {
        map.easeTo({
          center: [west, south],
          zoom: 9,
          offset: offsetFor(latest.current.padding),
          duration: prefersReducedMotion() ? 0 : 1000,
        });
        return;
      }
      map.fitBounds(
        [
          [west, south],
          [east, north],
        ],
        { padding: inset(map, latest.current.padding, 56), maxZoom: 10, duration: prefersReducedMotion() ? 0 : 1200 },
      );
    },
    flyToPlace({ lat, lon, kind }) {
      mapRef.current?.flyTo({
        center: [lon, lat],
        zoom: ZOOM_FOR_KIND[kind],
        offset: offsetFor(latest.current.padding),
        duration: prefersReducedMotion() ? 0 : 1600,
        essential: false,
      });
    },
    flyToCountry(iso2, fallback) {
      const map = mapRef.current;
      if (!map) return;
      const bounds = countryBoundsRef.current.get(iso2);
      const duration = prefersReducedMotion() ? 0 : 1400;
      if (bounds) {
        map.fitBounds(
          [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
          ],
          { padding: inset(map, latest.current.padding, 40), maxZoom: 6, duration },
        );
      } else {
        map.flyTo({ center: [fallback.lon, fallback.lat], zoom: 5, offset: offsetFor(latest.current.padding), duration });
      }
    },
  }));

  // MapLibre's (unlayered) CSS sets `position: relative` on the map element, which beats
  // Tailwind's layered utilities, so the wrapper does the positioning.
  return (
    <div
      data-lenis-prevent
      className="absolute inset-0 bg-sky-100 [&_.maplibregl-ctrl-bottom-right]:mr-20 lg:[&_.maplibregl-ctrl-bottom-right]:mr-24"
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

interface OverlayState {
  dark: boolean;
  projection: Projection;
  locale: Locale;
  selectedCountry: string | null;
  countries: FeatureCollection;
  route: FeatureCollection;
}

/** (Re)adds our sources and layers. Runs after every style load, including theme swaps. */
function installOverlays(map: MapLibreMap, state: OverlayState) {
  const { dark: isDark, projection: proj, locale: lang, selectedCountry: selected } = state;
  map.setProjection({ type: proj });

  const firstLabel = map.getStyle().layers.find((layer) => layer.type === "symbol")?.id;
  if (!map.getSource("countries")) {
    map.addSource("countries", { type: "geojson", data: state.countries, promoteId: "iso2" });
  }
  const isFeatured: ExpressionSpecification = ["==", ["get", "iso2"], FEATURED_COUNTRY];
  map.addLayer(
    {
      id: "country-fill",
      type: "fill",
      source: "countries",
      paint: {
        "fill-color": ["case", isFeatured, COLORS.copper, isDark ? COLORS.copperLight : COLORS.sky],
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          0.3,
          ["boolean", ["feature-state", "hover"], false],
          0.16,
          isFeatured,
          0.18,
          0,
        ],
      },
    },
    firstLabel,
  );
  map.addLayer(
    {
      id: "country-outline",
      type: "line",
      source: "countries",
      filter: outlineFilter(selected),
      paint: {
        "line-color": ["case", isFeatured, COLORS.copper, isDark ? COLORS.copperLight : COLORS.skyDeep],
        "line-width": 1.5,
        "line-opacity": 0.9,
      },
    },
    firstLabel,
  );

  if (!map.getSource("route")) map.addSource("route", { type: "geojson", data: state.route });
  const lineLayout = { "line-join": "round", "line-cap": "round" } as const;
  map.addLayer({
    id: "route-casing",
    type: "line",
    source: "route",
    filter: ["==", ["get", "kind"], "road"],
    layout: lineLayout,
    paint: { "line-color": isDark ? COLORS.night : "#ffffff", "line-width": 8, "line-opacity": 0.85 },
  });
  map.addLayer({
    id: "route-road",
    type: "line",
    source: "route",
    filter: ["==", ["get", "kind"], "road"],
    layout: lineLayout,
    paint: { "line-color": isDark ? COLORS.copperLight : COLORS.copper, "line-width": 4.5 },
  });
  map.addLayer({
    id: "route-flight",
    type: "line",
    source: "route",
    filter: ["==", ["get", "kind"], "flight"],
    layout: { "line-cap": "round" },
    paint: {
      "line-color": isDark ? COLORS.copperLight : COLORS.skyDeep,
      "line-width": 2.5,
      "line-dasharray": [1, 2],
      "line-opacity": 0.9,
    },
  });

  if (selected) map.setFeatureState({ source: "countries", id: selected }, { selected: true });
  if (lang !== "en") localizeLabels(map, lang);
}

/** Our destination pins only make sense once Mongolia is big enough to tell them apart. */
function setFeaturedVisibility(map: MapLibreMap, markers: Marker[]) {
  const visible = map.getZoom() >= FEATURED_MIN_ZOOM;
  for (const marker of markers) marker.getElement().style.visibility = visible ? "visible" : "hidden";
}

function outlineFilter(selected: string | null): FilterSpecification {
  return ["any", ["==", ["get", "iso2"], FEATURED_COUNTRY], ["==", ["get", "iso2"], selected ?? ""]];
}

/** Covered area plus a margin, scaled down if it would leave too little map to fit anything into. */
function inset(map: MapLibreMap, padding: MapPadding, extra: number): MapPadding {
  const { clientWidth: width, clientHeight: height } = map.getContainer();
  const scale = (a: number, b: number, size: number) => Math.min(1, Math.max(0, size - 120) / Math.max(1, a + b));
  const sx = scale(padding.left + extra, padding.right + extra, width);
  const sy = scale(padding.top + extra, padding.bottom + extra, height);
  return {
    top: (padding.top + extra) * sy,
    right: (padding.right + extra) * sx,
    bottom: (padding.bottom + extra) * sy,
    left: (padding.left + extra) * sx,
  };
}

/** Pixel offset that centres a point in the uncovered part of the map. */
function offsetFor(padding: MapPadding): [number, number] {
  return [(padding.left - padding.right) / 2, (padding.top - padding.bottom) / 2];
}

/**
 * Bounds of a country shape. Shapes that cross the antimeridian (Russia,
 * Fiji, the US with Alaska) are measured in 0–360° longitude instead, so the
 * camera frames the country rather than the whole world.
 */
function countryBounds(geometry: Geometry): [number, number, number, number] {
  const points: [number, number][] = [];
  const collect = (coords: unknown): void => {
    if (typeof (coords as number[])[0] === "number") points.push(coords as [number, number]);
    else for (const c of coords as unknown[]) collect(c);
  };
  if ("coordinates" in geometry) collect(geometry.coordinates);

  const plain = boundsOf(points) ?? [-180, -85, 180, 85];
  if (plain[2] - plain[0] <= 180) return plain;
  const shifted = boundsOf(points.map(([lon, lat]) => [lon < 0 ? lon + 360 : lon, lat]));
  return shifted && shifted[2] - shifted[0] < plain[2] - plain[0] ? shifted : plain;
}

/** Show place names in the UI language where the map data has them. */
function localizeLabels(map: MapLibreMap, lang: string) {
  for (const layer of map.getStyle().layers) {
    if (layer.type !== "symbol") continue;
    const field = map.getLayoutProperty(layer.id, "text-field");
    if (!field || !JSON.stringify(field).includes('"name')) continue;
    map.setLayoutProperty(layer.id, "text-field", ["coalesce", ["get", `name:${lang}`], ["get", "name"]]);
  }
}

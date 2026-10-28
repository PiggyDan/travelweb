import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXAMPLE_ROUTE } from "@/lib/explorer/example-route";
import { decodeRoute, encodeRoute, MAX_STOPS } from "@/lib/explorer/route-url";

describe("route URL", () => {
  it("round-trips stops and leg modes", () => {
    const modes = ["flight", "flight", "driving", "flight", "flight"] as const;
    const params = encodeRoute({ stops: EXAMPLE_ROUTE, modes: [...modes] });
    const decoded = decodeRoute(new URLSearchParams(params.toString()));
    assert.deepEqual(decoded.stops, EXAMPLE_ROUTE);
    assert.deepEqual(decoded.modes, modes);
  });

  it("returns no params for an empty route", () => {
    assert.equal(encodeRoute({ stops: [], modes: [] }).toString(), "");
    assert.deepEqual(decodeRoute(new URLSearchParams()), { stops: [], modes: [] });
  });

  it("drops malformed and out-of-range stops", () => {
    const params = new URLSearchParams({
      stops: "Seoul~37.5~126.9~city~KR|Nowhere~95~10~city~XX|~1~2~city~|Bad~abc~1~place~|Paris~48.85~2.35~bogus~fr",
      modes: "z",
    });
    const { stops, modes } = decodeRoute(params);
    assert.deepEqual(
      stops.map((s) => s.name),
      ["Seoul", "Paris"],
    );
    // Unknown kind and lowercase country code are not trusted.
    assert.equal(stops[1].kind, "place");
    assert.equal(stops[1].countryCode, null);
    // An unknown mode code falls back to the distance-based default (Seoul–Paris is long: flight).
    assert.deepEqual(modes, ["flight"]);
  });

  it("strips separators from names and caps the number of stops", () => {
    const many = Array.from({ length: MAX_STOPS + 5 }, (_, i) => ({
      name: `Stop|${i}~x`,
      lat: i,
      lon: i,
      kind: "place" as const,
      countryCode: null,
    }));
    const decoded = decodeRoute(encodeRoute({ stops: many, modes: [] }));
    assert.equal(decoded.stops.length, MAX_STOPS);
    assert.equal(decoded.stops[3].name, "Stop 3 x");
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { boundsOf, defaultModeFor, greatCircle, haversineMeters, isValidLatLon, unwrapLongitudes } from "@/lib/explorer/geo";

const ULAANBAATAR = { lat: 47.91847, lon: 106.9177 };
const SEOUL = { lat: 37.56668, lon: 126.97829 };
const TOKYO = { lat: 35.68125, lon: 139.76671 };
const OSAKA = { lat: 34.69374, lon: 135.50218 };
const LOS_ANGELES = { lat: 34.05223, lon: -118.24368 };

describe("haversineMeters", () => {
  it("measures known city pairs within 1%", () => {
    // Published great-circle distances: UB–Seoul ≈ 1,990 km, Tokyo–Osaka ≈ 400 km.
    assert.ok(Math.abs(haversineMeters(ULAANBAATAR, SEOUL) / 1000 - 1990) < 20);
    assert.ok(Math.abs(haversineMeters(TOKYO, OSAKA) / 1000 - 400) < 5);
  });

  it("is zero for the same point and symmetric", () => {
    assert.equal(haversineMeters(SEOUL, SEOUL), 0);
    assert.equal(haversineMeters(SEOUL, TOKYO), haversineMeters(TOKYO, SEOUL));
  });
});

describe("greatCircle", () => {
  it("starts and ends at the given points", () => {
    const line = greatCircle(ULAANBAATAR, SEOUL, 16);
    assert.equal(line.length, 17);
    assert.deepEqual(line[0].map((n) => n.toFixed(4)), [ULAANBAATAR.lon.toFixed(4), ULAANBAATAR.lat.toFixed(4)]);
    assert.deepEqual(line.at(-1)!.map((n) => n.toFixed(4)), [SEOUL.lon.toFixed(4), SEOUL.lat.toFixed(4)]);
  });

  it("stays continuous across the antimeridian", () => {
    const line = greatCircle(TOKYO, LOS_ANGELES);
    for (let i = 1; i < line.length; i++) assert.ok(Math.abs(line[i][0] - line[i - 1][0]) < 180);
    // Unwrapped eastward past 180° rather than jumping to -118°.
    assert.ok(Math.abs(line.at(-1)![0] - (LOS_ANGELES.lon + 360)) < 1e-6);
  });

  it("handles identical points", () => {
    assert.equal(greatCircle(SEOUL, SEOUL).length, 2);
  });
});

describe("helpers", () => {
  it("unwraps longitudes", () => {
    assert.deepEqual(
      unwrapLongitudes([
        [170, 0],
        [-170, 0],
        [175, 0],
      ]),
      [
        [170, 0],
        [190, 0],
        [175, 0],
      ],
    );
  });

  it("computes bounds", () => {
    assert.equal(boundsOf([]), null);
    assert.deepEqual(
      boundsOf([
        [1, 2],
        [-3, 5],
      ]),
      [-3, 2, 1, 5],
    );
  });

  it("defaults long hops to flights and short ones to driving", () => {
    assert.equal(defaultModeFor(ULAANBAATAR, SEOUL), "flight");
    assert.equal(defaultModeFor(TOKYO, OSAKA), "driving");
  });

  it("validates coordinates", () => {
    assert.ok(isValidLatLon(0, 0));
    assert.ok(!isValidLatLon(91, 0));
    assert.ok(!isValidLatLon(0, 181));
    assert.ok(!isValidLatLon(Number.NaN, 0));
  });
});

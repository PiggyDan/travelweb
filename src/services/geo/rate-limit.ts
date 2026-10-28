import "server-only";

/**
 * Best-effort fixed-window rate limiter, per client IP and per server
 * instance. On serverless hosts each instance keeps its own counts, so this
 * only blunts bursts; the real protection is CDN caching of identical
 * requests (see the route handlers). For a hard global limit, add a Vercel
 * Firewall rate-limit rule on /api/geo/*.
 */

interface Window {
  start: number;
  count: number;
}

const buckets = new Map<string, Map<string, Window>>();
const MAX_TRACKED_CLIENTS = 5_000;

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

/** Returns true when the request is within `limit` requests per `windowMs`. */
export function allowRequest(bucket: string, key: string, limit: number, windowMs = 60_000): boolean {
  let windows = buckets.get(bucket);
  if (!windows) {
    windows = new Map();
    buckets.set(bucket, windows);
  }

  const now = Date.now();
  const current = windows.get(key);
  if (!current || now - current.start >= windowMs) {
    if (windows.size >= MAX_TRACKED_CLIENTS) {
      for (const [k, w] of windows) if (now - w.start >= windowMs) windows.delete(k);
      if (windows.size >= MAX_TRACKED_CLIENTS) windows.clear();
    }
    windows.set(key, { start: now, count: 1 });
    return true;
  }

  current.count += 1;
  return current.count <= limit;
}

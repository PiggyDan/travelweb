import type { NextConfig } from "next";

// The FastAPI backend (see backend/README.md). Browsers only ever talk to this
// site: `/api/*` is proxied there, so session cookies stay first-party.
const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    // Versioned files (scripts/copy-maplibre-worker.mjs) never change under the same name.
    return [{ source: "/vendor/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Photos are self-hosted under /public/images. If a CDN or the FastAPI
    // media server is introduced later, allow its host here, e.g.:
    // remotePatterns: [new URL("https://media.eternalskytour.com/**")],
  },
};

export default nextConfig;

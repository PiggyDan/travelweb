/**
 * Browser-side client for the FastAPI backend. Requests go to this site's own
 * `/api/*`, which next.config.ts proxies to the backend, so cookies (chat and
 * admin sessions) are sent automatically.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Field name → message, from FastAPI validation errors. */
    readonly fieldErrors: Partial<Record<string, string>> = {},
  ) {
    super(message);
  }
}

interface FastApiValidationIssue {
  loc: (string | number)[];
  msg: string;
}

function parseError(status: number, body: unknown): ApiError {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return new ApiError(status, detail);
  if (Array.isArray(detail)) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of detail as FastApiValidationIssue[]) {
      const field = issue.loc.at(-1);
      // Model-level checks (e.g. date order) arrive without a field name.
      const key = typeof field === "string" && field !== "body" ? field : "_form";
      fieldErrors[key] ??= issue.msg.replace(/^Value error, /, "");
    }
    return new ApiError(status, "Please check the highlighted fields.", fieldErrors);
  }
  return new ApiError(status, status >= 500 ? "Our server had a problem. Please try again." : "Request failed.");
}

export async function api<T>(path: string, init: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method: init.method ?? (init.body === undefined ? "GET" : "POST"),
      headers: init.body === undefined ? undefined : { "Content-Type": "application/json" },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      credentials: "same-origin",
      cache: "no-store",
      signal: init.signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError(0, "We couldn't reach our server. Please check your connection and try again.");
  }

  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON (e.g. the proxy's own error page when the backend is down).
  }
  if (!response.ok) {
    throw response.status === 500 && body === null
      ? new ApiError(503, "Our server is unavailable right now. Please try again shortly.")
      : parseError(response.status, body);
  }
  return body as T;
}

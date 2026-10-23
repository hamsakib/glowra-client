import { clearSession, getToken } from "./session";

function resolveApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_URL must be set for production builds.");
  }
  return "http://localhost:5000";
}

export const API_URL = resolveApiUrl();

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

/**
 * fetch wrapper: JSON in/out, attaches the JWT, and turns API errors into ApiError.
 * An expired or invalid session (401 on an authenticated call) clears the session and
 * sends the user to /login with a notice.
 */
export async function api(path, { method = "GET", body, token, auth = true, signal, next, cache } = {}) {
  const headers = {};
  const jwt = token ?? (auth && typeof window !== "undefined" ? getToken() : null);
  if (jwt) headers.Authorization = `Bearer ${jwt}`;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  if (body && !isForm) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      signal,
      next,
      cache,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && jwt && typeof window !== "undefined") {
      clearSession();
      const here = window.location.pathname + window.location.search;
      // Full reload on purpose: it resets every client cache after the session ends.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/login?expired=1&next=${encodeURIComponent(here)}`);
    }
    throw new ApiError(data.message || "Something went wrong", res.status, data.errors);
  }
  return data;
}

/** Builds a query string from an object, skipping empty values. */
export function qs(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) continue;
    search.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

/** Server-side fetch for public data (used by server components for SEO + first paint). */
export async function serverGet(path, revalidate = 120) {
  try {
    return await api(path, { auth: false, next: { revalidate } });
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}
